
import UserRepository from "../repository/user.repository";
import { createPixPayment } from "../external/mercadopago/createPixPayment"

class PurchaseService {
    constructor(private userRepository: UserRepository) { }

    async createPurchase(userId: string, gbAmount: number, totalPrice: number) {
        const user = await this.userRepository.findById(userId)
        if (!user) throw new Error("Usuário não encontrado.")

        const payment = await createPixPayment({
            amount: totalPrice,
            description: `Compra de ${gbAmount}GB de tráfego`,
            payerEmail: user.email,
        })

        const purchase = await this.userRepository.createPurchase({
            userId,
            gbAmount,
            totalPrice,
            paymentId: payment.paymentId,
        })

        console.log(payment, purchase)
        return {
            ...payment,
            status: 'PENDING',
            purchaseId: purchase.id,
        }
    }

    async purchaseHistory(userId: string) {
        const user = await this.userRepository.findById(userId)
        if (!user) throw new Error("Usuário não encontrado.")

        const purchases = await this.userRepository.getUserPurchases(userId)

        console.log(purchases)
        return purchases
    }
}
export default PurchaseService;