import PurchaseService from "./payment.service";
import { addToBalance } from "../proxy/dataimpulse/addTrafficInToBalance";
import { createLog } from "../logs/logsCreate";
import PaymentRepository from "./payment.repository";

export class PaymentOrchestrator {

    /**
     *
     */
    constructor(
        private paymentService: PurchaseService,
        private addBalance: typeof addToBalance,
        private paymentRepo: PaymentRepository
    ) {
    }

    async checkPaymentStatus(paymentId: string, ip: string) {
        try {
            let dataPayment = await this.paymentService.checkPaymentStatusService(paymentId)
            if (!dataPayment) throw new Error("Without paymentData from paymentID: " + paymentId)

            await addToBalance(Number(dataPayment?.user.proxyUser?.userId), dataPayment?.gbAmount)
            await createLog({ email: dataPayment.user.email, action: "Pagamento confirmado", status: "Sucesso", message: `Pagamento confirmado e recarga realizada . ${paymentId}`, ip: ip })

            await this.paymentRepo.clearCooldown(dataPayment.user.id)

            return dataPayment
        } catch (error) {

        }

    }

    async mercadoPagoWebhook(id: string, ip: string) {
        try {
            let idUser = await this.paymentService.paymentWebhookService(id);
            if (!idUser) {
                throw new Error("Erro interno: SubuserId ausente in the orchestrator. Contate o suporte.");
            }
            await this.addBalance(Number(idUser?.user.proxyUser?.subuserId), idUser.gbAmount);
            await createLog({
                email: idUser.user.email,
                action: "Request do mercado pago",
                status: "Sucesso",
                message: "Confirmação do pagamento.",
                ip: ip
            });

        } catch (error) {

        }
    }

}