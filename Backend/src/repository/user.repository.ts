import { UseRegisterDTO } from "../dtos";
import { prisma } from "../prisma/client";
import { Prisma, User } from "@prisma/client"
import { subMonths, startOfMonth } from "date-fns"

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

    async createLogsActives(email: string, action: string, status: string, message: string, ip: string): Promise<void> {
        await prisma.activityLog.create({
            data: {
                actionType: action,
                status: status,
                userEmail: email,
                ip: ip,
                message: message,
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

        // Remove dependências
        await prisma.proxyUser.deleteMany({ where: { userId } });
        await prisma.purchase.deleteMany({ where: { userId } });
        // Agora pode deletar o usuário com segurança
        await prisma.user.delete({ where: { id: userId } });

        return true;
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
        let userData = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                proxyUser: true,
                purchases: true,
            },
        });

        return userData;
    }

    async searchUsers(query?: string) {
        const where: Prisma.UserWhereInput = query && query.trim() !== "" ? {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
                {
                    proxyUser: {
                        is: {
                            OR: [
                                { username: { contains: query, mode: "insensitive" } },
                                { password: { contains: query, mode: "insensitive" } },
                            ],
                        },
                    },
                },
            ],
        } : {}

        const users = await prisma.user.findMany({
            where,
            include: {
                proxyUser: true,
                purchases: { where: { status: "PAID" } },
            },
            take: 20,
        })

        const mappedUsers = users.map(user => {
            const gbsPurchased = user.purchases.reduce((acc, p) => acc + p.gbAmount, 0);

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                plan: "Básico",
                status: user.blocked ? "blocked" : "active",
                gbsPurchased,
                gbsUsed: 0,
                referrals: 0,
                joinDate: user.createdAt.toISOString(),
                lastLogin: null,
            };
        });

        return mappedUsers
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
                    host: "proxy.nox24proxy.com.br",
                    port: "823",
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

    async getSubuserIdByUserId(userId: string) {
        const proxyUser = await prisma.proxyUser.findFirst({
            where: { userId },
            select: {
                subuserId: true,
            },
        });

        return proxyUser;
    }

    async resetPasswordProxy(userId: string, newPassword: string) {
        await prisma.proxyUser.update({
            where: { userId },
            data: {
                password: newPassword,
            },
        });
    }

    async getCooldown(userId: string) {
        return prisma.userCooldown.findUnique({ where: { userId } });
    }

    async setCooldown(userId: string, attempts: number, cooldownUntil: Date) {
        return prisma.userCooldown.upsert({
            where: { userId },
            update: { attempts, cooldownUntil },
            create: {
                userId,
                attempts,
                cooldownUntil,
            },
        });
    }

    async changeUserPassword(userId: string, newPasswordHash: string) {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { password: newPasswordHash },
        })
        return updatedUser
    }

    async clearCooldown(userId: string) {
        return prisma.userCooldown.deleteMany({ where: { userId } });
    }

    async tryIncrementCooldown(userId: string): Promise<{ allowed: boolean, waitSeconds?: number }> {
        const existing = await prisma.userCooldown.findUnique({ where: { userId } });
        const now = new Date();

        const attempts = (existing?.attempts || 0) + 1;

        let cooldownSeconds = 0;
        if (attempts === 5) cooldownSeconds = 30;
        else if (attempts === 6) cooldownSeconds = 60;
        else if (attempts === 7) cooldownSeconds = 120;
        else if (attempts >= 8) cooldownSeconds = 86400; // 24h

        if (existing?.cooldownUntil && existing.cooldownUntil > now) {
            const wait = Math.ceil((existing.cooldownUntil.getTime() - now.getTime()) / 1000);
            return { allowed: false, waitSeconds: wait };
        }

        const cooldownUntil = cooldownSeconds > 0 ? new Date(now.getTime() + cooldownSeconds * 1000) : null;

        if (existing) {
            await prisma.userCooldown.update({
                where: { userId },
                data: {
                    attempts,
                    cooldownUntil,
                },
            });
        } else {
            await prisma.userCooldown.create({
                data: {
                    userId,
                    attempts,
                    cooldownUntil,
                },
            });
        }

        return { allowed: true };
    }


    async markPurchaseAsPaid(purchaseId: number): Promise<void> {
        await prisma.purchase.update({
            where: { id: purchaseId },
            data: { status: "PAID" },
        });
    }


    async getDashboardStats() {
        const totalUsers = await prisma.user.count()

        const activeClients = await prisma.user.count({
            where: {
                proxyUser: {
                    is: {}, // Checa se existe proxyUser relacionado
                },
            },
        })

        const totalGbSoldResult = await prisma.purchase.aggregate({
            where: { status: "PAID" },
            _sum: { gbAmount: true }
        })

        const monthlyRevenueResult = await prisma.purchase.aggregate({
            where: { status: "PAID" },
            _sum: { totalPrice: true }
        })

        const startDate = startOfMonth(subMonths(new Date(), 5))

        const purchases = await prisma.purchase.findMany({
            where: {
                createdAt: { gte: startDate },
                status: "PAID"
            },
            select: {
                createdAt: true,
                gbAmount: true,
                totalPrice: true
            }
        })

        const users = await prisma.user.findMany({
            where: { createdAt: { gte: startDate } },
            select: { createdAt: true }
        })

        // Agrupamento por mês
        const monthlyMap = new Map<string, { gbs: number; novos: number; total: number }>()
        for (let i = 0; i < 6; i++) {
            const date = subMonths(new Date(), 5 - i)
            const key = date.toLocaleString("pt-BR", { month: "short" })
            monthlyMap.set(key, { gbs: 0, novos: 0, total: 0 })
        }

        for (const p of purchases) {
            const key = p.createdAt.toLocaleString("pt-BR", { month: "short" })
            const data = monthlyMap.get(key)
            if (data) data.gbs += p.gbAmount
        }

        for (const u of users) {
            const key = u.createdAt.toLocaleString("pt-BR", { month: "short" })
            const data = monthlyMap.get(key)
            if (data) data.novos += 1
        }

        let total = 0
        const userGrowthData = Array.from(monthlyMap.entries()).map(([month, data]) => {
            total += data.novos
            return { month, novos: data.novos, total }
        })

        const salesData = Array.from(monthlyMap.entries()).map(([month, data]) => ({
            month,
            gbs: data.gbs
        }))

        // Novo cálculo: distribuição por quantidade de GB comprada
        const allPaidPurchases = await prisma.purchase.findMany({
            where: { status: "PAID" },
            select: { gbAmount: true }
        })

        const gbCounts: Record<number, number> = {}
        let gbTotal = 0

        for (const { gbAmount } of allPaidPurchases) {
            const key = Math.round(gbAmount)
            gbCounts[key] = (gbCounts[key] || 0) + 1
            gbTotal += 1
        }

        const planDistribution = Object.entries(gbCounts).map(([gb, count]) => ({
            name: `${gb} GB`,
            value: Number(((count / gbTotal) * 100).toFixed(1))
        }))

        return {
            totalUsers,
            activeClients,
            totalGbSold: totalGbSoldResult._sum.gbAmount ?? 0,
            monthlyRevenue: monthlyRevenueResult._sum.totalPrice ?? 0,
            salesData,
            userGrowthData,
            planDistribution
        }
    }

    async createCoupon(data: {
        code: string
        discountPct: number
        onlyOnce?: boolean
        minGb?: number
        expiresAt?: Date
    }) {
        const coupon = await prisma.coupon.create({
            data: {
                code: data.code,
                discountPct: data.discountPct,
                onlyOnce: data.onlyOnce ?? false,
                minGb: data.minGb,
                expiresAt: data.expiresAt,
                isActive: true,
            },
        })
        return coupon
    }

    async deactivateCoupon(code: string) {
        const updatedCoupon = await prisma.coupon.updateMany({
            where: { code },
            data: { isActive: false }
        })
        return updatedCoupon
    }

    async listCoupons() {
        const coupons = await prisma.coupon.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        })
        return coupons
    }

}

export default UserRepository;