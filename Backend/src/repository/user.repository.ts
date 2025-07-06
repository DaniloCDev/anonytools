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
            user: {
                name: proxyData?.user.name,
                email: proxyData?.user.email,
            },
            proxyCredentials: {
                username: proxyData?.username,
                password: proxyData?.password,
                host: "proxy.proxybr.com",
                port: 8080,
            },
            plan: {
                name: lastPaidPurchase?.plan.name,
                gbAmount: lastPaidPurchase?.plan.gbAmount,
                totalPrice: lastPaidPurchase?.totalPrice,
                expiresAt: "2024-02-15", // <- simulado, pois não tem isso no schema
            },
            usage: {
                used: 3.2,  // <- vindo da infra externa
                remaining: 10 - 3.2,
            },
            recentActivity: [
                {
                    date: "2024-01-10",
                    ip: "191.123.45.67",
                    dataUsed: 0.5,
                },
                {
                    date: "2024-01-09",
                    ip: "-",
                    dataUsed: 10,
                },
                {
                    date: "2024-01-08",
                    ip: "191.234.56.78",
                    dataUsed: 1.2,
                },
            ],
        };
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