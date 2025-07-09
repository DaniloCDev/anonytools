import { Request, Response } from "express";
import { MercadoPagoConfig, Payment } from "mercadopago";
import UserRepository from "../repository/user.repository";
import { addToBalance } from "../external/dataimpulse/addTrafficInToBalance";

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export class PurchaseController {
  mercadoPagoWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, type } = req.body;

      if (type !== "payment") {
         res.status(200).send("Tipo de evento ignorado");
        return;
      }

      const payment = await new Payment(client).get({ id: String(id) });

      if (!payment || payment.status !== "approved") {
         res.status(200).send("Pagamento ainda não aprovado");
         return
      }

      const userRepository = new UserRepository();
      const purchase = await userRepository.getPurchaseByPaymentId(Number(payment.id));

      if (!purchase) {
         res.status(404).send("Compra não encontrada");
         return;
      }

      if (purchase.status === "PAID") {
         res.status(200).send("Compra já processada");
         return;

      }

      if (!purchase.user.proxyUser?.subuserId) {
        console.error("SubuserId ausente:", purchase.user);
         res.status(400).send("Erro interno: SubuserId ausente. Contate o suporte.");
         return;

      }

      await userRepository.markPurchaseAsPaid(purchase.id);
      await addToBalance(Number(purchase.user.proxyUser.subuserId), purchase.gbAmount);

       res.status(200).send("Pagamento confirmado e saldo adicionado");
    } catch (error) {
      console.error("Erro no webhook Mercado Pago:", error);
       res.status(500).json({ message: "Erro ao processar webhook" });
    }
  };
}
