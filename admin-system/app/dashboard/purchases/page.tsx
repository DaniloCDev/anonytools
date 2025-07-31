"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ShoppingCart,
  DollarSign,
  CreditCard,
  TrendingUp,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

type PurchaseWithUser = {
  id: number
  userId: string
  gbAmount: number
  totalPrice: number
  status: "PENDING" | "PAID" | "CANCELED" | "FAILED"
  mpPaymentId: string | null
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseWithUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [refreshingId, setRefreshingId] = useState<number | null>(null)


  useEffect(() => {
    const fetchPurchases = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/user/purchasesAdm", {
          credentials: "include",
        })
        const data = await res.json()
        setPurchases(data)
      } catch (err) {
        console.error("Erro ao buscar compras:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPurchases()
  }, [])


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

const filteredPurchases = purchases.filter((purchase) => {
  if (!debouncedSearchTerm) {
    return true; 
  }

  const matchesSearch =
    purchase.user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    purchase.user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    purchase.id.toString().includes(debouncedSearchTerm) ||
    purchase.mpPaymentId?.toString().includes(debouncedSearchTerm); 

  return matchesSearch;
});


  const displayPurchases = debouncedSearchTerm ? filteredPurchases : filteredPurchases.slice(0, 30)

  const totalPages = Math.ceil(displayPurchases.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPurchases = displayPurchases.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRefreshStatus = async (purchaseId: number) => {
    setRefreshingId(purchaseId)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setPurchases((prev) =>
      prev.map((purchase) =>
        purchase.id === purchaseId
          ? { ...purchase, status: purchase.status === "PENDING" ? "PAID" : purchase.status }
          : purchase,
      ),
    )

    setRefreshingId(null)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PAID: { label: "Pago", className: "bg-green-600 hover:bg-green-700" },
      PENDING: { label: "Pendente", className: "bg-yellow-600 hover:bg-yellow-700" },
      FAILED: { label: "Falhou", className: "bg-red-600 hover:bg-red-700" },
      CANCELED: { label: "Cancelado", className: "bg-gray-600 hover:bg-gray-700" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.FAILED

    return <Badge className={config.className}>{config.label}</Badge>
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Calcular estatísticas
  const totalRevenue = purchases.filter((p) => p.status === "PAID").reduce((acc, p) => acc + p.totalPrice, 0)
  const totalPurchases = purchases.length
  const paidPurchases = purchases.filter((p) => p.status === "PAID").length
  const pendingPurchases = purchases.filter((p) => p.status === "PENDING").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gerenciamento de Compras</h1>
          <p className="text-slate-400">Visualize e gerencie todas as transações</p>
        </div>
        <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Exportar Compras
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total de Compras</CardTitle>
            <ShoppingCart className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalPurchases}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Compras Pagas</CardTitle>
            <CreditCard className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{paidPurchases}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Pendentes</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{pendingPurchases}</div>
          </CardContent>
        </Card>
      </div>

      {/* Campo de Busca */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Buscar por e-mail ou nome"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white"
            />
          </div>
          {!searchTerm && (
            <p className="text-sm text-slate-400 mt-2">
              Mostrando as últimas 30 compras. Use a busca para filtrar resultados específicos.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Informações de Paginação */}
      {displayPurchases.length > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>
            Mostrando {startIndex + 1} a {Math.min(endIndex, displayPurchases.length)} de {displayPurchases.length}{" "}
            compras
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-slate-600 text-slate-300 hover:text-white bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page
                if (totalPages <= 5) {
                  page = i + 1
                } else if (currentPage <= 3) {
                  page = i + 1
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i
                } else {
                  page = currentPage - 2 + i
                }

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={
                      currentPage === page
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "border-slate-600 text-slate-300 hover:text-white bg-transparent"
                    }
                  >
                    {page}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-slate-600 text-slate-300 hover:text-white bg-transparent"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Tabela de Compras */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Compras ({displayPurchases.length})</CardTitle>
          <CardDescription className="text-slate-400">
            {searchTerm ? "Resultados da busca" : "Últimas 30 compras realizadas"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full bg-slate-700" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px] bg-slate-700" />
                    <Skeleton className="h-4 w-[200px] bg-slate-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : currentPurchases.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma compra encontrada</p>
              {searchTerm && <p className="text-sm mt-2">Tente buscar por outro termo</p>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">ID</TableHead>
                    <TableHead className="text-slate-300">Nome do Usuário</TableHead>
                    <TableHead className="text-slate-300">E-mail</TableHead>
                    <TableHead className="text-slate-300">GB Comprados</TableHead>
                    <TableHead className="text-slate-300">Valor Total</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">ID Mercado Pago</TableHead>
                    <TableHead className="text-slate-300">Data da Compra</TableHead>
                    <TableHead className="text-slate-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPurchases.map((purchase) => (
                    <TableRow key={purchase.id} className="border-slate-700 hover:bg-slate-750">
                      <TableCell className="text-white font-medium">#{purchase.id}</TableCell>
                      <TableCell className="text-white">{purchase.user.name}</TableCell>
                      <TableCell className="text-slate-300">{purchase.user.email}</TableCell>
                      <TableCell className="text-white">{purchase.gbAmount} GB</TableCell>
                      <TableCell className="text-white font-medium">{formatCurrency(purchase.totalPrice)}</TableCell>
                      <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                      <TableCell className="text-slate-300 font-mono text-sm">{purchase.mpPaymentId}</TableCell>
                      <TableCell className="text-slate-300">
                        {format(new Date(purchase.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRefreshStatus(purchase.id)}
                          disabled={refreshingId === purchase.id}
                          className="border-slate-600 text-slate-300 hover:text-white bg-transparent"
                        >
                          <RefreshCw className={`w-4 h-4 ${refreshingId === purchase.id ? "animate-spin" : ""}`} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
