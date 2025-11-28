import { Request, Response } from "express";
import PurchaseService from "./payment.service";
import { ZodError } from "zod";
import { PaymentOrchestrator } from "./payment.orchestrator";
import ProxyUserService from "../proxy/user.proxy.services";

export class PurchaseController {
  /**
   *
   */
  constructor(
    private paymentOrchestrator: PaymentOrchestrator,
    private paymentService : PurchaseService
  ) {
  }

  /**
 * @swagger
 * /payment/webhook/mercadopago:
 *   post:
 *     summary: Webhook do Mercado Pago
 *     tags: [Payments]
 *     description: Recebe notificações do Mercado Pago quando um pagamento muda de status.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               type: payment
 *               data:
 *                 id: "1234567890"
 *     responses:
 *       200:
 *         description: Evento recebido e processado.
 *       500:
 *         description: Erro ao processar webhook.
 */
  mercadoPagoWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
      const type = req.body.type;
      const id = req.body.data?.id;
      const ip: string = req.ip || "";

      if (type !== "payment" || !id) {
        res.status(200).send("Evento ignorado");
        return;
      }
      await this.paymentOrchestrator.mercadoPagoWebhook(id, ip)

      res.status(200).send("Pagamento confirmado e saldo adicionado");
    } catch (error) {
      console.error("Erro no webhook Mercado Pago:", error);
      res.status(500).json({ message: "Erro ao processar webhook" });
    }
  };

  /**
 * @swagger
 * /payment/check-payment-status:
 *   post:
 *     summary: Verifica o status de um pagamento no Mercado Pago
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentId:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: Status do pagamento retornado.
 *       400:
 *         description: paymentId ausente ou inválido.
 *       500:
 *         description: Erro ao consultar status.
 */
  checkPaymentStatus = async (req: Request, res: Response): Promise<void> => {
    const ip: string = req.ip || "";

    try {
      const { paymentId } = req.body;
      if (!paymentId) {
        res.status(400).json({ message: "paymentId é obrigatório" });
        return;
      }

      let purchase = await this.paymentOrchestrator.checkPaymentStatus(paymentId, ip)
      if (purchase?.status === "PAID") {
         res.status(200).json({ status: purchase?.status === "PAID" || purchase.status === "approved" ? "paid" : "pending" });
         return
        }
      res.status(200).json({ status: purchase?.status === "PENDING"  });
    } catch (error) {
      console.error("Erro ao verificar status do pagamento:", error);
      res.status(500).json({ message: "Erro ao verificar status do pagamento" });
    }
  };

  /**
 * @swagger
 * /payment/createPurchase:
 *   post:
 *     summary: Cria uma compra de GB e inicia pagamento via Mercado Pago
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gbAmount:
 *                 type: number
 *                 example: 5
 *               couponCode:
 *                 type: string
 *                 example: "DESCONTO10"
 *     responses:
 *       200:
 *         description: Compra criada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Usuário não autenticado.
 */
  createPurchase = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    const { gbAmount, couponCode } = req.body;
    const ip: string = req.ip || "";
    try {

      if (!userId) {
        res.status(401).json({ message: "Usuário não está logado" });
        return;
      }
      if (typeof gbAmount !== 'number' || gbAmount <= 0) {
        res.status(400).json({ message: "Quantidade de GB inválida" });
        return;
      }

      const gbPackages = [
        { gb: 1, price: 9.19 },
        { gb: 3, price: 26.99 },
        { gb: 5, price: 47.42 },
        { gb: 10, price: 77.9 },
        { gb: 20, price: 151.9 },
        { gb: 50, price: 372.00 },
      ];
      const selected = gbPackages.find(p => p.gb === gbAmount);
      if (!selected) {
        res.status(400).json({ message: "Pacote inválido" });
        return;
      }
      const purchase = await this.paymentService.createPurchaseService(userId, selected?.gb, selected?.price, ip, couponCode);
      //   console.log(purchase)

      res.status(200).json(purchase);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: (error as Error).message });

    }
  };

  /**
 * @swagger
 * /payment/purchasesAdm:
 *   get:
 *     summary: Busca compras com filtro (Admin)
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: q
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         example: "email@gmail.com"
 *     responses:
 *       200:
 *         description: Compras encontradas.
 *       400:
 *         description: Erro ao buscar compras.
 */
  findPurchases = async (req: Request, res: Response): Promise<void> => {

    const userId = req.userId;
    let query = String(req.query.q || "");

    try {
      const user = await this.paymentService.searchPuchases(userId, query);
      res.status(201).json(user);
    } catch (error) {
      console.log(error)
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Erro de validação", errors: error.format() });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  };

  /**
 * @swagger
 * /payment/purchases:
 *   get:
 *     summary: Lista o histórico de compras do usuário autenticado
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Histórico retornado.
 *       400:
 *         description: Erro ao consultar histórico.
 */
  purchaseHistory = async (req: Request, res: Response): Promise<void> => {

    const userId = req.userId;
    try {
      const user = await this.paymentService.purchaseHistory(userId);
      //  console.log(userId)
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Erro de validação", errors: error.format() });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  };

  /**
 * @swagger
 * /coupons/validate:
 *   get:
 *     summary: Valida um cupom pelo código
 *     tags: [Coupons]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         example: "DESCONTO10"
 *     responses:
 *       200:
 *         description: Cupom válido.
 *       400:
 *         description: Código não informado ou cupom inválido.
 */
  GetCouponWithCode = async (req: Request, res: Response): Promise<void> => {
    const couponCode = req.query.code as string;
    if (!couponCode) {
      res.status(400).json({ message: 'Código do cupom é obrigatório' });
      return;
    }

    try {
      const coupon = await this.paymentService.getCouponIsValid(couponCode);
      res.status(200).json(coupon);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  };

  /**
 * @swagger
 * /coupons/createCoupon:
 *   post:
 *     summary: Cria um novo cupom de desconto
 *     tags: [Coupons]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               discountPct:
 *                 type: number
 *               onlyOnce:
 *                 type: boolean
 *               minGb:
 *                 type: number
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *             example:
 *               code: "DESCONTO20"
 *               discountPct: 20
 *               onlyOnce: true
 *               minGb: 5
 *               expiresAt: "2025-12-31T00:00:00Z"
 *     responses:
 *       201:
 *         description: Cupom criado com sucesso.
 *       400:
 *         description: Dados inválidos ou cupom já existente.
 */
  CreateCoupon = async (req: Request, res: Response): Promise<void> => {
    const { code, discountPct, onlyOnce, minGb, expiresAt } = req.body
    const ip: string = req.ip || "";
    console.log(code, discountPct, onlyOnce, minGb, expiresAt)
    if (!code || discountPct === undefined) {
      res.status(400).json({ message: "Código e desconto (%) são obrigatórios" })
      return
    }

    try {
      const coupon = await this.paymentService.createCouponService({
        code,
        discountPct,
        onlyOnce,
        minGb,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      }, ip)

      res.status(201).json(coupon)
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }

  /**
 * @swagger
 * /allcoupons:
 *   get:
 *     summary: Lista todos os cupons cadastrados
 *     tags: [Coupons]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de cupons retornada.
 *       400:
 *         description: Erro ao buscar cupons.
 */
  ListAllCoupons = async (req: Request, res: Response): Promise<void> => {

    try {
      const coupons = await this.paymentService.ListAllCoupons()

      res.status(201).json(coupons)
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }

}
