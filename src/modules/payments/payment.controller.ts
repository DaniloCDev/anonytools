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

  ListAllCoupons = async (req: Request, res: Response): Promise<void> => {

    try {

      const coupons = await this.paymentService.ListAllCoupons()

      res.status(201).json(coupons)
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }

}
