"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, QrCode, ArrowLeft, CheckCircle } from "lucide-react"

interface AddBalanceModalProps {
  isOpen: boolean
  onClose: () => void
}

const gbPackages = [
  { gb: 5, price: 29.9 },
  { gb: 10, price: 49.9 },
  { gb: 25, price: 99.9 },
  { gb: 50, price: 179.9 },
  { gb: 100, price: 299.9 },
]

export function AddBalanceModal({ isOpen, onClose }: AddBalanceModalProps) {
  const [step, setStep] = useState<"select" | "payment" | "success">("select")
  const [selectedPackage, setSelectedPackage] = useState<(typeof gbPackages)[0] | null>(null)
  const [pixCode] = useState(
    "00020126580014BR.GOV.BCB.PIX013636c4b8c4-4c4c-4c4c-4c4c-4c4c4c4c4c4c5204000053039865802BR5925PROXYBR SERVICOS DIGITAIS6009SAO PAULO62070503***6304ABCD",
  )

  const handleSelectPackage = (pkg: (typeof gbPackages)[0]) => {
    setSelectedPackage(pkg)
    setStep("payment")
  }

  const handleBack = () => {
    if (step === "payment") {
      setStep("select")
    } else if (step === "success") {
      setStep("select")
      onClose()
    }
  }

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode)
    // Simular pagamento após 2 segundos
    setTimeout(() => {
      setStep("success")
    }, 2000)
  }

  const handleClose = () => {
    setStep("select")
    setSelectedPackage(null)
    onClose()
  }

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
                        <p className="text-2xl font-bold text-blue-400">R$ {pkg.price.toFixed(2).replace(".", ",")}</p>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          R$ {(pkg.price / pkg.gb).toFixed(2).replace(".", ",")}/GB
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === "payment" && selectedPackage && (
          <div className="space-y-6">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>{selectedPackage.gb}GB de tráfego</span>
                  <span>R$ {selectedPackage.price.toFixed(2).replace(".", ",")}</span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-400">R$ {selectedPackage.price.toFixed(2).replace(".", ",")}</span>
                </div>
              </CardContent>
            </Card>

            <div className="text-center space-y-4">
              <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center">
                <QrCode className="w-32 h-32 text-black" />
              </div>

              <p className="text-sm text-gray-400">Escaneie o QR Code acima ou copie o código PIX</p>

              <Card className="glass border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-black/30 p-2 rounded break-all">{pixCode}</code>
                    <Button
                      size="icon"
                      onClick={copyPixCode}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 glow"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={copyPixCode}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 glow"
              >
                Copiar Código PIX
              </Button>

              <p className="text-xs text-gray-500">
                O saldo será adicionado automaticamente após a confirmação do pagamento
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

            <Card className="glass border-white/10">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Saldo adicionado:</span>
                  <span className="font-bold text-green-400">+{selectedPackage.gb}GB</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor pago:</span>
                  <span>R$ {selectedPackage.price.toFixed(2).replace(".", ",")}</span>
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
    </Dialog>
  )
}
