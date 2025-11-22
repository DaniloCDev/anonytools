
import { prisma } from "../../config/prisma/client";
import {  User } from "@prisma/client"

class AuthUserRepository {
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


}

export default AuthUserRepository;