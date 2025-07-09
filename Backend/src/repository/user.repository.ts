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
        return prisma.user.findUnique({
            where: { id: userId },
            include: {
                proxyUser: true,     // dados do ProxyUser
                purchases: true,     // lista de compras
            },
        });
    }



    async getDashboardData(userId: string) {
        const dataUser = await prisma.user.findFirst({
            where: { id: userId },
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
        });

        return {
            name: dataUser?.name,
            email: dataUser?.email,
            plan: {
                usedGb: 3.2, // você pode substituir isso por uma lógica real se quiser
                remainingGb: (lastPaidPurchase?.gbAmount || 0) - 3.2,
                status: lastPaidPurchase?.status || "active",
                expiresAt: "2024-02-15", // precisa de um campo real para isso, se for relevante
                credentials: {
                    host: "proxy.proxybr.com",
                    port: "8080",
                    username: proxyData?.username,
                    password: proxyData?.password,
                },
            },
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


    async createPurchase(data: { userId: string; gbAmount: number; totalPrice: number, paymentId: number }) {
        console.log(data.paymentId)
        const purchase = await prisma.purchase.create({
            data: {
                userId: data.userId,
                gbAmount: data.gbAmount,
                totalPrice: data.totalPrice,
                mpPaymentId: BigInt(data.paymentId),
                status: "PENDING",
            },
        });
        return purchase;
    }

    async getUserPurchases(userId: string) {
        const purchases = await prisma.purchase.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return purchases;
    }


    async getCuponCode(couponCode: string) {
        let cupomFInd = await prisma.coupon.findUnique({ where: { code: couponCode } })

        return cupomFInd;
    }

    async couponUsage(userId: string, couponId: string) {
        return await prisma.couponUsage.findFirst({
            where: { couponId, userId }
        });
    }

    async registerUseCoupon(userId: string, couponId: string) {
        return await prisma.couponUsage.create({
            data: {
                couponId,
                userId,
            }
        });
    }


    async getPurchaseByPaymentId(mpPaymentId: number) {
        return await prisma.purchase.findFirst({
            where: { mpPaymentId },
            include: {
                user: {
                    include: {
                        proxyUser: true, 
                    },
                },
            },
        });
    }

    async markPurchaseAsPaid(purchaseId: number): Promise<void> {
        await prisma.purchase.update({
            where: { id: purchaseId },
            data: { status: "PAID" },
        });
    }

}

export default UserRepository;