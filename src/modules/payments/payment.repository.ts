import { prisma } from "../../config/prisma/client";
import { Prisma, User } from "@prisma/client"
import { subMonths, startOfMonth } from "date-fns"


class PaymentRepository {
    async findById(userid: string) {
        return prisma.user.findUnique({ where: { id: userid } });
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

    async findPurchases(q?: string) {
        const where: Prisma.PurchaseWhereInput = q
            ? {
                user: {
                    OR: [
                        { email: { contains: q, mode: "insensitive" } },
                        { name: { contains: q, mode: "insensitive" } },
                    ],
                },
            }
            : {};

        const purchases = await prisma.purchase.findMany({
            where,
            include: {
                user: true,
            },
            orderBy: { createdAt: "desc" },
            take: 30,
        });

        return purchases.map((p) => ({
            ...p,
            mpPaymentId: p.mpPaymentId?.toString() ?? null,
        }));
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

    async registerUseCoupon(userId: string, couponId: string) {
        return await prisma.couponUsage.create({
            data: {
                couponId,
                userId,
            }
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

    async listCoupons() {
        const coupons = await prisma.coupon.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        })
        return coupons
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
}

export default PaymentRepository;