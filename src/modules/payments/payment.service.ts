
import PaymentRepository from "./payment.repository";
import { createPixPayment } from "./mercadopago/createPixPayment"
import serializeBigIntAndDate from "../shared/utils/serializeBigInt";
import { createLog } from "../logs/logsCreate";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { AppError } from "../../core/errors/AppError";

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });


class PurchaseService {
    constructor(private paymentRepository: PaymentRepository) { }

    async createPurchaseService(userId: string, gbAmount: number, totalPrice: number, ip: string, couponCode?: string,) {
        const user = await this.paymentRepository.findById(userId);
        if (!user) {
            await createLog({ action: "criar compra", status: "Erro", message: "Usuário não encontrado..", ip: ip })
            throw new AppError("Usuário não encontrado.", 404);

        }


        let coupon;
        if (couponCode) {
            coupon = await this.paymentRepository.getCuponCode(couponCode);
            if (!coupon || !coupon.isActive || (coupon.expiresAt && coupon.expiresAt < new Date())) {
                await createLog({ email: user.email, action: "aplicação do Cupom", status: "Erro", message: "Cupom inválido ou expirado.", ip: ip })
                throw new AppError("Cupom inválido ou expirado.", 400);

            }
            if (coupon.minGb && gbAmount < coupon.minGb) {
                await createLog({ email: user.email, action: "aplicação do Cupom", status: "Erro", message: "Cupom só é válido para compras acima de ${coupon.minGb}GB.", ip: ip })
                throw new AppError(`Cupom válido apenas para compras acima de ${coupon.minGb}GB.`, 400);
            }
            if (coupon.onlyOnce) {
                const alreadyUsed = await this.paymentRepository.couponUsage(userId, coupon.id);
                await createLog({ email: user.email, action: "aplicação do Cupom", status: "Erro", message: "Você já usou esse cupom.", ip: ip })
                if (alreadyUsed) throw new AppError("Você já utilizou esse cupom anteriormente.", 409);

            }
            totalPrice = parseFloat((totalPrice * (1 - coupon.discountPct / 100)).toFixed(2));

        }

        const cooldownCheck = await this.paymentRepository.tryIncrementCooldown(userId);
        if (!cooldownCheck.allowed) {
            await createLog({ email: user.email, action: "Cooldwon pix qr", status: "Erro", message: "Aguarde ${cooldownCheck.waitSeconds} segundos antes de gerar um novo código PIX.", ip: ip })
            throw new Error(`Aguarde ${cooldownCheck.waitSeconds} segundos antes de gerar um novo código PIX.`);
        }

        let payment;
        console.log({
            amount: totalPrice,
            description: `Compra de ${gbAmount}GB de tráfego`,
            payerEmail: user.email,
        });

        try {
            payment = await createPixPayment({
                amount: totalPrice,
                description: `Compra de ${gbAmount}GB de tráfego`,
                payerEmail: user.email,
            });

        } catch (err) {
            throw new Error("Erro ao gerar pagamento Pix. Tente novamente.");
        }

        const purchase = await this.paymentRepository.createPurchase({
            userId,
            gbAmount,
            totalPrice,
            paymentId: payment.paymentId,
        });

        await createLog({ email: user.email, action: "Criação de compra", status: "Sucesso", message: "Realizada com sucesso", ip: ip })

        if (couponCode) {
            await this.paymentRepository.registerUseCoupon(userId, coupon!.id);
        }
        return {
            ...payment,
            status: 'PENDING',
            purchaseId: purchase.id,
        };
    }

    async purchaseHistory(userId: string) {
        const user = await this.paymentRepository.findById(userId)
        if (!user) throw new Error("Usuário não encontrado.")

        const purchases = await this.paymentRepository.getUserPurchases(userId)

        console.log(purchases)
        return serializeBigIntAndDate(purchases)
    }
    async searchPuchases(user_id: string, query: string) {
        if (!query && user_id) {
            query = "";
        }
        const userloged = await this.paymentRepository.findById(user_id);
        if (!userloged) {
            throw new Error("Usuario adm nâo existe");
        }

        const existing = await this.paymentRepository.findPurchases(query);
        if (!existing) {
            throw new Error("Usuario nâo existe");
        }
        return existing;
    }

    async getCouponIsValid(couponCode: string) {
        const coupon = await this.paymentRepository.getCuponCode(couponCode);
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
    }, ip: string) {
        const coupon = await this.paymentRepository.getCuponCode(data.code);
        if (coupon) {

            await createLog({ action: "Criar Cupom", status: "Erro", message: "Ja existe um cupom com este codigo.", ip: ip })
            throw new Error("Ja existe um cupom com este codigo.");
        }

        let creatingCode = await this.paymentRepository.createCoupon(data)
        return creatingCode;
    }

    async ListAllCoupons() {
        const coupons = await this.paymentRepository.listCoupons();
        return coupons;
    }

    async paymentWebhookService(id: string) {
        try {

            const payment = await new Payment(client).get({ id: String(id) });

            if (!payment || payment.status !== "approved") {
                throw new Error("Pagamento ainda não aprovado")
            }

            const purchase = await this.paymentRepository.getPurchaseByPaymentId(Number(payment.id));

            if (!purchase) {
                throw new Error("Compra não encontrada");
            }
            if (purchase.status === "PAID") {
                throw new Error("Compra já processada");
            }
            if (!purchase.user.proxyUser?.subuserId) {
                console.error("SubuserId ausente:", purchase.user);
                throw new Error("Erro interno: SubuserId ausente. Contate o suporte.");
            }
            await this.paymentRepository.markPurchaseAsPaid(purchase.id);

            return purchase
        } catch (err) {
            console.log(err)
        }
    }

    async checkPaymentStatusService(paymentId: string) {

        const payment = await new Payment(client).get({ id: String(paymentId) });

        if (!payment) {
            throw new Error("Pagamento não encontrado")
        }

        const purchase = await this.paymentRepository.getPurchaseByPaymentId(Number(payment.id));

        if (!purchase) {
            throw new Error("Compra não encontrada");
        }

        if (payment.status === "approved" && purchase.status !== "PAID") {
            if (!purchase.user.proxyUser?.subuserId) {
                console.error("SubuserId ausente:", purchase.user);
                throw new Error("Erro interno: SubuserId ausente. Contate o suporte.");

            }
            await this.paymentRepository.markPurchaseAsPaid(purchase.id);
            return purchase
        }
    }
}

export default PurchaseService;