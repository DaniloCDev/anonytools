"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/toast-provider"
import { Zap, Globe, Shield, CheckCircle } from "lucide-react"

const products = [
  {
    id: "1",
    name: "Proxy Brasil 5GB",
    description: "IP rotativo residencial com acesso a todo Brasil",
    gb: 5,
    price: 29.9,
    type: "residential",
  },
  {
    id: "2",
    name: "Proxy Brasil 10GB",
    description: "Intermediário para uso moderado",
    gb: 10,
    price: 49.9,
    type: "residential",
  },
  {
    id: "3",
    name: "Proxy Brasil 25GB",
    description: "Ideal para empresas e uso intensivo",
    gb: 25,
    price: 99.9,
    type: "residential",
  },
  {
    id: "4",
    name: "Proxy Brasil 50GB",
    description: "Máxima performance para grandes projetos",
    gb: 50,
    price: 179.9,
    type: "residential",
  },
  {
    id: "5",
    name: "Proxy Datacenter 100GB",
    description: "Alta velocidade para automação e scraping",
    gb: 100,
    price: 149.9,
    type: "datacenter",
  },
  {
    id: "6",
    name: "Proxy Premium Unlimited",
    description: "Uso ilimitado com IPs premium",
    gb: 999,
    price: 299.9,
    type: "premium",
  },
]

export default function Produtos() {
  const { addToast } = useToast()

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "residential":
        return <Globe className="w-5 h-5 text-blue-400" />
      case "datacenter":
        return <Zap className="w-5 h-5 text-purple-400" />
      case "premium":
        return <Shield className="w-5 h-5 text-gold-400" />
      default:
        return <Globe className="w-5 h-5 text-blue-400" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "residential":
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Residencial</Badge>
      case "datacenter":
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Datacenter</Badge>
      case "premium":
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Premium</Badge>
      default:
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Residencial</Badge>
    }
  }

  const handleBuyProduct = () => {
    addToast({
      type: "info",
      title: "Faça login para comprar",
      message: "Acesse sua conta para continuar com a compra",
      duration: 4000,
    })
  }

  return (
    <div className="min-h-screen py-20 scrollbar-hide">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Escolha seu <span className="gradient-text">pacote ideal</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Proxies brasileiros de alta qualidade para todas as suas necessidades
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="glass glass-hover border-white/10 relative overflow-hidden group">
              {product.type === "premium" && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-500 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  {getTypeIcon(product.type)}
                  {getTypeBadge(product.type)}
                </div>
                <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
                <p className="text-gray-400">{product.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Tráfego:</span>
                  <span className="font-semibold">{product.gb === 999 ? "Ilimitado" : `${product.gb}GB`}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>IPs rotativos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Suporte 24/7</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Setup instantâneo</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold">R$ {product.price.toFixed(2).replace(".", ",")}</span>
                    <span className="text-gray-400">/mês</span>
                  </div>

                  <Button
                    onClick={handleBuyProduct}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 group-hover:glow transition-all duration-300"
                  >
                    Comprar Agora
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
