
import UserRepository from "../repository/user.repository";
import { createPixPayment } from "../external/mercadopago/createPixPayment"
import serializeBigIntAndDate from "../utils/serializeBigInt";

class PurchaseService {
    constructor(private userRepository: UserRepository) { }

    async createPurchaseService(userId: string, gbAmount: number, totalPrice: number, couponCode?: string) {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new Error("Usuário não encontrado.");

        let coupon;
        if (couponCode) {
            coupon = await this.userRepository.getCuponCode(couponCode);
            if (!coupon || !coupon.isActive || (coupon.expiresAt && coupon.expiresAt < new Date())) {
                throw new Error("Cupom inválido ou expirado.");
            }
            if (coupon.minGb && gbAmount < coupon.minGb) {
                throw new Error(`Cupom só é válido para compras acima de ${coupon.minGb}GB.`);
            }
            if (coupon.onlyOnce) {
                const alreadyUsed = await this.userRepository.couponUsage(userId, coupon.id);
                if (alreadyUsed) throw new Error("Você já usou esse cupom.");
            }
            totalPrice = totalPrice * (1 - coupon.discountPct / 100);
        }

        const cooldownCheck = await this.userRepository.tryIncrementCooldown(userId);
        if (!cooldownCheck.allowed) {
            throw new Error(`Aguarde ${cooldownCheck.waitSeconds} segundos antes de gerar um novo código PIX.`);
        }

        let payment;
        try {
            payment = await createPixPayment({
                amount: totalPrice,
                description: `Compra de ${gbAmount}GB de tráfego`,
                payerEmail: user.email,
            });
        } catch (err) {
            throw new Error("Erro ao gerar pagamento Pix. Tente novamente.");
        }

        const purchase = await this.userRepository.createPurchase({
            userId,
            gbAmount,
            totalPrice,
            paymentId: payment.paymentId,
        });

        if (couponCode) {
            await this.userRepository.registerUseCoupon(userId, coupon!.id);
        }
        return {
            ...payment,
            status: 'PENDING',
            purchaseId: purchase.id,
        };
    }

    async purchaseHistory(userId: string) {
        const user = await this.userRepository.findById(userId)
        if (!user) throw new Error("Usuário não encontrado.")

        const purchases = await this.userRepository.getUserPurchases(userId)

        console.log(purchases)
        return serializeBigIntAndDate(purchases)
    }

    async getCouponIsValid(couponCode: string) {
        const coupon = await this.userRepository.getCuponCode(couponCode);
        console.log(coupon)
        if (!coupon || !coupon.isActive) {
            throw new Error("Cupom inválido ou expirado.");
        }
        if (coupon.expiresAt && coupon.expiresAt < new Date()) {
            throw new Error("Cupom expirado.");
        }
        return coupon
    }
    

    async createCouponService(data: {
        code: string,
        discountPct: number,
        onlyOnce?: boolean,
        minGb?: number,
        expiresAt?: Date
    }) {
        const coupon = await this.userRepository.getCuponCode(data.code);
        if (coupon) {
            throw new Error("Ja existe um cupom com este codigo.");
        }

        let creatingCode = await this.userRepository.createCoupon(data)
        return creatingCode;
    }

    async ListAllCoupons() {
        const coupons = await this.userRepository.listCoupons();
        return coupons;
    }

}


export default PurchaseService;