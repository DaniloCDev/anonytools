import { UseRegisterDTO } from "../dtos";
import { prisma } from "../prisma/client";

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

    async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    }

    async findById(userid: string) {
        return prisma.user.findUnique({ where: { id: userid } });
    }

    async findProxyUserByUserId(userId: string) {
        return prisma.proxyUser.findFirst({
            where: { userId },
        });
    }

    async findInformationUserById(userId: string) {
        return prisma.proxyUser.findFirst({
            where: { userId },
            select: {
                id: true,
                userId: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }


    async getDashboardData(userId: string) {
        const dataUser = await prisma.user.findFirst({
            where: { id: userId }
        });
        const proxyData = await prisma.proxyUser.findFirst({
            where: { userId },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });


        const lastPaidPurchase = await prisma.purchase.findFirst({
            where: {
                userId,
                status: 'PAID',
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                plan: true,
            },
        });

        return {
            name: dataUser?.name,
            email: dataUser?.email,
            plan: {
                name: lastPaidPurchase?.plan.name,
                totalGb: lastPaidPurchase?.plan.gbAmount,
                usedGb: 3.2,
                remainingGb: (lastPaidPurchase?.plan.gbAmount || 0) - 3.2,
                status: lastPaidPurchase?.status || "active",
                expiresAt: "2024-02-15",
                credentials: {
                    host: "proxy.proxybr.com",
                    port: "8080",
                    username: proxyData?.username,
                    password: proxyData?.password,
                },
            },
        }

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