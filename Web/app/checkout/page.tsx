"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"
import { AuthModal } from "@/components/auth-modal"
import { Trash2, Plus, Minus, PiIcon as Pix } from "lucide-react"

export default function Checkout() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3001/auth/check", {
          credentials: "include",
        })

        setIsLoggedIn(res.ok)
      } catch (error) {
        setIsLoggedIn(false)
      }
    }

    checkAuth()
  }, [])

  const handleFinalizePurchase = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true)
      return
    }
    
    alert("Compra finalizada! Redirecionando para pagamento...")
    clearCart()
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">Carrinho Vazio</h1>
          <p className="text-gray-400 mb-8">Adicione alguns produtos ao seu carrinho para continuar</p>
          <Button asChild>
            <a href="/produtos">Ver Produtos</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Finalizar <span className="gradient-text">Compra</span>
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Itens do carrinho */}
          <div className="space-y-6">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle>Seus Produtos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 glass rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-400">{item.description}</p>
                      <p className="text-lg font-bold text-blue-400">
                        R$ {item.price.toFixed(2).replace(".", ",")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>

                      <span className="w-8 text-center">{item.quantity}</span>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Resumo e pagamento */}
          <div className="space-y-6">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</span>
                    </div>
                  ))}
                </div>

                <Separator className="bg-white/10" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-400">R$ {total.toFixed(2).replace(".", ",")}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle>Pagamento via PIX</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 glass rounded-lg">
                  <Pix className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                  <p className="text-gray-400 mb-2">Pagamento instantâneo via PIX</p>
                  <p className="text-sm">
                    {!isLoggedIn
                      ? "Faça login para continuar com o pagamento"
                      : "Você receberá o QR Code após confirmar o pedido"}
                  </p>
                </div>

                <Button
                  onClick={handleFinalizePurchase}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 glow text-lg py-3"
                >
                  {!isLoggedIn ? "Fazer Login e " : ""}Gerar PIX - R$ {total.toFixed(2).replace(".", ",")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de autenticação */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => {
          setIsLoggedIn(true)
          setShowAuthModal(false)
        }}
      />
    </div>
  )
}
