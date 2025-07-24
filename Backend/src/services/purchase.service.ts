
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

        // Tenta incrementar cooldown e bloqueia se necessário
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
            // Em caso de erro, cooldown já incrementado, só lança erro
            throw new Error("Erro ao gerar pagamento Pix. Tente novamente.");
        }

        // Cria a compra no banco
        const purchase = await this.userRepository.createPurchase({
            userId,
            gbAmount,
            totalPrice,
            paymentId: payment.paymentId,
        });

        if (couponCode) {
            await this.userRepository.registerUseCoupon(userId, coupon!.id);
        }

        // **Não limpar cooldown aqui!** Só quando o pagamento for confirmado (exemplo: webhook)

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
        if (!coupon || !coupon.isActive) {
            throw new Error("Cupom inválido ou expirado.");
        }
        if (coupon.expiresAt && coupon.expiresAt < new Date()) {
            throw new Error("Cupom expirado.");
        }
        return {
            code: coupon.code,
            discountPct: coupon.discountPct,
            minGb: coupon.minGb ?? 0,
        };
    }

}


export default PurchaseService;