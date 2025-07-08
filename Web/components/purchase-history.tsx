"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { History, Download, CheckCircle, Clock, XCircle } from "lucide-react"
import { usePurchaseContext } from "@/contexts/PurchaseContext";

export function PurchaseHistory() {
  const { purchases, isLoading } = usePurchaseContext();

  if (isLoading) {
    return <p>Carregando histórico de compras...</p>;
  }

  const purchasesArray = Array.isArray(purchases) ? purchases : [];

  const totalSpent = purchasesArray
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.totalPrice, 0);

  const totalGB = purchasesArray
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.gbAmount, 0);


  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "PENDING":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "FAILED":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Concluído</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pendente</Badge>;
      case "FAILED":
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Falhou</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          <span className="gradient-text">Histórico de Compras</span>
        </h1>
        <p className="text-gray-400">Visualize todas as suas transações e compras de proxy</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Gasto</p>
                <p className="text-2xl font-bold text-green-400">R$ {totalSpent.toFixed(2).replace(".", ",")}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-green-400"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total GB Comprados</p>
                <p className="text-2xl font-bold text-blue-400">{totalGB}GB</p>
              </div>
              <History className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Transações</p>
                <p className="text-2xl font-bold">{purchases.length}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-purple-400"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase History Table */}
      <Card className="glass border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Histórico de Transações
          </CardTitle>
          <Button variant="outline" className="glass glass-hover border-white/20 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between p-4 glass rounded-lg">
                <div className="flex items-center gap-4">
                  {getStatusIcon(purchase.status)}
                  <div>
                    <h4 className="font-semibold">Compra de {purchase.gbAmount}GB</h4>
                    <p className="text-sm text-gray-400">
                      #{purchase.id} • {new Date(purchase.createdAt).toLocaleDateString("pt-BR")} • Pix
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">R$ {purchase.totalPrice.toFixed(2).replace(".", ",")}</p>
                    <p className="text-sm text-gray-400">{purchase.gbAmount}GB</p>

                  </div>
                  {getStatusBadge(purchase.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle>Resumo Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Janeiro 2024</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Transações:</span>
                  <span>3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total gasto:</span>
                  <span className="text-green-400">R$ 179,70</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">GB adquiridos:</span>
                  <span className="text-blue-400">40GB</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Dezembro 2023</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Transações:</span>
                  <span>2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total gasto:</span>
                  <span className="text-green-400">R$ 49,90</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">GB adquiridos:</span>
                  <span className="text-blue-400">10GB</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
