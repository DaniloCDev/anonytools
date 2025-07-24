"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, QrCode, ArrowLeft, CheckCircle, RefreshCw, Clock } from "lucide-react"
import { useToast } from "@/components/toast-provider"

interface AddBalanceModalProps {
  isOpen: boolean
  onClose: () => void
}

type GbPackage = {
  gb: number;
  price: number;
  finalPrice?: number;
};

const gbPackages: GbPackage[] = [
  { gb: 5, price: 29.9 },
  { gb: 10, price: 49.9 },
  { gb: 25, price: 99.9 },
  { gb: 50, price: 179.9 },
  { gb: 100, price: 299.9 },
];


export function AddBalanceModal({ isOpen, onClose }: AddBalanceModalProps) {
  const [loading, setLoading] = useState(false);
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);

  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  const [step, setStep] = useState<"select" | "payment" | "success">("select");
  const [selectedPackage, setSelectedPackage] = useState<GbPackage | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { addToast } = useToast()
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "checking" | "paid">("pending")
  const [isCheckingPayment, setIsCheckingPayment] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const [paymentId, setPaymentId] = useState<number | null>(null);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Informe um cupom para validar");
      setCouponApplied(false);
      setDiscount(0);
      return;
    }

    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(couponCode)}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();

      if (!res.ok) {
        setCouponError(json.message || "Cupom inválido ou expirado");
        setCouponApplied(false);
        setDiscount(0);
        return;
      }

      setDiscount(json.discountPct);
      setCouponApplied(true);
      setCouponError("");
    } catch (error) {
      console.error(error);
      setCouponError("Erro ao validar cupom");
      setCouponApplied(false);
      setDiscount(0);
    }
  };


  const handleBack = () => {
    if (step === "payment") {
      setStep("select")
      setPaymentStatus("pending")
      setShowPaymentSuccess(false)
    } else if (step === "success") {
      setStep("select")
      onClose()
    }
  }

  const copyPixCode = () => {
    if (!pixCode) {
      addToast({
        type: "error",
        title: "Código PIX não disponível",
        message: "Aguarde o carregamento do QR Code.",
        duration: 3000,
      });
      return;
    }

    navigator.clipboard.writeText(pixCode)
      .then(() => {
        addToast({
          type: "success",
          title: "Código copiado!",
          message: "Cole no app do banco para efetuar o pagamento.",
          duration: 3000,
        });

        setTimeout(() => {
          setStep("success");
        }, 2000);
      })
      .catch((err) => {
        console.error("Erro ao copiar código PIX:", err);
        addToast({
          type: "error",
          title: "Falha ao copiar",
          message: "Tente novamente ou copie manualmente.",
          duration: 3000,
        });
      });
  };

  const checkPaymentStatus = async () => {
    if (!paymentId) return;

    setIsCheckingPayment(true);

    try {
      const res = await fetch("/api/user/checkPaymentStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ paymentId }),
      });

      const data = await res.json();

      if (res.ok && data.status === "paid") {
        setPaymentStatus("paid");
        setShowPaymentSuccess(true);

        setTimeout(() => {
          setStep("success");
        }, 2000);
      } else {
        setPaymentStatus("pending");
      }
    } catch (err) {
      console.error("Erro ao verificar status do pagamento:", err);
      addToast({
        type: "error",
        title: "Erro ao verificar pagamento",
        message: "Tente novamente em instantes.",
        duration: 3000,
      });
    } finally {
      setIsCheckingPayment(false);
    }
  };


  const handleClose = () => {
    setStep("select")
    setSelectedPackage(null)
    setCouponCode("")
    setCouponApplied(false)
    setDiscount(0)
    setCouponError("")
    setPaymentStatus("pending")
    setShowPaymentSuccess(false)
    onClose()
  }

  const handleSelectPackage = async (pkg: (typeof gbPackages)[0]) => {
    try {
      setLoading(true);
      const finalPrice = couponApplied ? pkg.price * (1 - discount / 100) : pkg.price;

      const res = await fetch("/api/user/createPurchase", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gbAmount: pkg.gb, couponCode }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.message || "Tente novamente em instantes.");
        setPixCode(null); // limpa código anterior
        setQrCodeBase64(null); // limpa imagem anterior
        return;
      }


      const data = await res.json();
      setSelectedPackage({ ...pkg, finalPrice });
      setPixCode(data.qrCode);
      setQrCodeBase64(data.qrCodeBase64);
      setPaymentId(data.paymentId); // <--- aqui
      setStep("payment");
    } catch (error) {
      console.error(error);
      addToast({
        type: "error",
        title: "Erro de conexão",
        message: "Verifique sua internet ou tente novamente mais tarde.",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (step === "payment" && paymentStatus !== "paid" && paymentId) {
      const interval = setInterval(() => {
        checkPaymentStatus();
      }, 10000); // a cada 10 segundos

      return () => clearInterval(interval);
    }
  }, [step, paymentStatus, paymentId]);

  return (

    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass border-white/10 max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {step !== "select" && (
              <Button variant="ghost" size="icon" onClick={handleBack} className="w-8 h-8">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <DialogTitle className="gradient-text">
              {step === "select" && "Adicionar Saldo"}
              {step === "payment" && "Pagamento PIX"}
              {step === "success" && "Pagamento Confirmado"}
            </DialogTitle>
          </div>
        </DialogHeader>

        {errorMessage && (
          <div className="bg-red-600 text-white p-3 rounded mb-4 text-center font-semibold">
            {errorMessage}
          </div>
        )}

        {step === "select" && (
          <div className="space-y-4">
            <p className="text-gray-400 text-center">Escolha a quantidade de GB para adicionar</p>

            <div className="space-y-3">
              {gbPackages.map((pkg) => (
                <Card
                  key={pkg.gb}
                  className="glass glass-hover border-white/10 cursor-pointer transition-all duration-300 hover:border-blue-500/30"
                  onClick={() => handleSelectPackage(pkg)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{pkg.gb}GB</h3>
                        <p className="text-sm text-gray-400">Tráfego adicional</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-400">
                          R$ {pkg.price.toFixed(2).replace(".", ",")}
                        </p>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          R$ {(pkg.price / pkg.gb).toFixed(2).replace(".", ",")}/GB
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Campo de cupom de desconto */}
            <Card className="glass border-white/10 mt-6">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <label htmlFor="coupon" className="text-sm font-medium text-gray-300">
                    Cupom de Desconto (Opcional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="coupon"
                      placeholder="Digite seu cupom aqui"
                      className="glass flex-1 px-3 py-2 rounded bg-black/30 text-white border border-white/10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    />
                    <Button
                      variant="outline"
                      onClick={applyCoupon}
                      disabled={!couponCode || couponApplied}
                      className="glass glass-hover border-white/20 bg-transparent px-4"
                    >
                      {couponApplied ? "Aplicado" : "Aplicar"}
                    </Button>
                  </div>
                  {couponApplied && (
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        Cupom "{couponCode}" aplicado! Desconto de {discount}%
                      </span>
                    </div>
                  )}
                  {couponError && <p className="text-red-400 text-sm">{couponError}</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        )}


        {step === "payment" && selectedPackage && (
          <div className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>{selectedPackage.gb}GB de tráfego</span>
                  <span>R$ {selectedPackage.price.toFixed(2).replace(".", ",")}</span>
                </div>
                {couponApplied && selectedPackage.finalPrice && (
                  <div className="flex justify-between text-green-400">
                    <span>
                      Desconto ({couponCode} - {discount}%)
                    </span>
                    <span>
                      -R$ {(selectedPackage.price - selectedPackage.finalPrice).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                )}
                <Separator className="bg-white/10" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-400">
                    R$ {(selectedPackage.finalPrice ?? selectedPackage.price).toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="text-center space-y-4">
              {/* QR Code com status */}
              <div className="relative w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center">
                {qrCodeBase64 ? (
                  <img
                    src={`data:image/png;base64,${qrCodeBase64}`}
                    alt="QR Code"
                    className="w-48 h-48 mx-auto rounded-lg absolute inset-0"
                  />
                ) : (
                  <QrCode className="w-32 h-32 text-black" />
                )}

                {/* Overlay de sucesso */}
                {showPaymentSuccess && (
                  <div className="absolute inset-0 bg-green-500/90 rounded-lg flex items-center justify-center animate-fade-in">
                    <div className="text-center">
                      <CheckCircle className="w-16 h-16 text-white mx-auto mb-2" />
                      <p className="text-white font-bold text-lg">✓ PAGO</p>
                    </div>
                  </div>
                )}

                {/* Indicador de verificação */}
                {isCheckingPayment && (
                  <div className="absolute inset-0 bg-blue-500/90 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <RefreshCw className="w-16 h-16 text-white mx-auto mb-2 animate-spin" />
                      <p className="text-white font-bold">Verificando...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status do pagamento */}
              <div className="flex items-center justify-center gap-2">
                {paymentStatus === "pending" && (
                  <>
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 text-sm">Aguardando pagamento</span>
                  </>
                )}
                {paymentStatus === "paid" && (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">Pagamento confirmado!</span>
                  </>
                )}
              </div>

              <p className="text-sm text-gray-400">Escaneie o QR Code acima ou copie o código PIX</p>

              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-black/30 p-2 rounded break-all">{pixCode}</code>
                    <Button
                      size="icon"
                      onClick={copyPixCode}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button
                  onClick={copyPixCode}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg shadow-green-500/25"
                >
                  Copiar Código PIX
                </Button>

                <Button
                  onClick={checkPaymentStatus}
                  disabled={isCheckingPayment || paymentStatus === "paid"}
                  variant="outline"
                  className="bg-white/5 backdrop-blur-xl border border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  {isCheckingPayment ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : paymentStatus === "paid" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <p className="text-xs text-gray-500">
                {paymentStatus === "pending"
                  ? "Clique no botão de atualizar após efetuar o pagamento"
                  : "O saldo será adicionado automaticamente"}
              </p>
            </div>

          </div>
        )}

        {step === "success" && selectedPackage && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center glow">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2">Pagamento Confirmado!</h3>
              <p className="text-gray-400">{selectedPackage.gb}GB foram adicionados à sua conta</p>
            </div>

            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Saldo adicionado:</span>
                  <span className="font-bold text-green-400">+{selectedPackage.gb}GB</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor pago:</span>
                  <span>
                    R$ {(selectedPackage.finalPrice ?? selectedPackage.price).toFixed(2).replace(".", ",")}
                  </span>
                </div>

              </CardContent>
            </Card>

            <Button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 glow"
            >
              Continuar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog >
  )
}
