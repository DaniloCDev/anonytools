import { UseRegisterDTO } from "./dtos";
import { prisma } from "../../config/prisma/client";
import { User } from "@prisma/client"

type LogsFilter = {
    email?: string;
    status?: string;
    actionType?: string;
    search?: string;
    page?: number;
    perPage?: number;
};


class UserRepository {
    async createUser(data: UseRegisterDTO) {
        return prisma.user.create({
            data:
            {
                name: data.name,
                email: data.email,
                password: data.password,
            },
        })
    }

     async getLogs(filter: LogsFilter) {
        const {
            email,
            status,
            actionType,
            search,
            page = 1,
            perPage = 20,
        } = filter;

        const where: any = {};

        if (email) {
            where.userEmail = { contains: email, mode: "insensitive" };
        }

        if (status) {
            where.status = status;
        }

        if (actionType) {
            where.actionType = actionType;
        }

        if (search) {
            where.message = { contains: search, mode: "insensitive" };
        }

        const logs = await prisma.activityLog.findMany({
            where,
            orderBy: {
                createdAt: "desc",
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });

        const totalCount = await prisma.activityLog.count({ where });

        return {
            logs,
            totalCount,
            page,
            perPage,
            totalPages: Math.ceil(totalCount / perPage),
        };
    }


    async changeUserPassword(userId: string, newPasswordHash: string) {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { password: newPasswordHash },
        })
        return updatedUser
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async toggleUserBlock(userId: string, block: boolean): Promise<void> {
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser) {
            throw new Error("Usuário não encontrado.");
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                blocked: block,
            },
        });
    }

    async deleteUser(userId: string): Promise<boolean> {
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser) {
            throw new Error("Usuário não encontrado.");
        }


        await prisma.proxyUser.deleteMany({ where: { userId } });
        await prisma.purchase.deleteMany({ where: { userId } });
        await prisma.user.delete({ where: { id: userId } });

        return true;
    }

    async findById(userid: string) {
        return prisma.user.findUnique({ where: { id: userid } });
    }

    async findInformationUserById(userId: string) {
        let userData = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                proxyUser: true,
                purchases: true,
            },
        });

        return userData;
    }

    async createUserProxy(data: {
        userId: string;
        username: string;
        password: string;
        subuserId: string;
    }) {
        return prisma.proxyUser.create({
            data: {
                ...data,
            },
        });
    }


}

export default UserRepository;