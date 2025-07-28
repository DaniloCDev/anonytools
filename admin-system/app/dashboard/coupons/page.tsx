"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  Ticket,
  CalendarIcon,
  Copy,
  Users,
  Percent,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"


export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)


  type NewCouponType = {
    code: string
    description: string
    discountPct: number
    onlyOnce: boolean
    minGb: number
    maxUses: number
    expiresAt: Date | null
  }

  interface Coupon {
    id: string;
    code: string;
    discountPct: number;
    onlyOnce: boolean;
    minGb: number | null;
    isActive: boolean;
    createdAt: string;
    expiresAt: string | null;
    description?: string;
    maxUses?: number;
    currentUses?: number;
    type?: "percentage"
  }



  const [newCoupon, setNewCoupon] = useState<NewCouponType>({
    code: "",
    description: "",
    discountPct: 0,
    onlyOnce: false,
    minGb: 0,
    maxUses: 0,
    expiresAt: null
  })




  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])


  useEffect(() => {
    async function fetchCoupons() {
      try {
        const res = await fetch("/api/allcoupons", {
          credentials: "include"
        })
        if (!res.ok) throw new Error("Erro ao buscar cupons")
        const data = await res.json()
        setCoupons(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchCoupons()
  }, [])

  const filteredCoupons = coupons.filter(coupon => {
    const searchLower = debouncedSearchTerm.toLowerCase()
    return (
      coupon.code.toLowerCase().includes(searchLower) ||
      (coupon.description?.toLowerCase().includes(searchLower))
    ) && (statusFilter === "all" || (statusFilter === "active" ? coupon.isActive : !coupon.isActive))
  })

  const currentCoupons = filteredCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Lógica de paginação
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleCouponClick = async (coupon: Coupon) => {
    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(coupon.code)}`, {
        credentials: 'include'
      })
      if (!res.ok) throw new Error('Erro ao buscar detalhes do cupom')
      const fullCoupon = await res.json()
      setSelectedCoupon(fullCoupon)
      setEditMode(false)
      setIsModalOpen(true)
    } catch (error) {
      console.error(error)
      // Pode avisar o usuário do erro aqui
    }
  }

  const handleCreateCoupon = async () => {
    const couponData = {
      code: newCoupon.code.toUpperCase(),
      description: newCoupon.description,
      discountPct: Number(newCoupon.discountPct),
      onlyOnce: newCoupon.onlyOnce,
      minGb: Number(newCoupon.minGb),
      maxUses: Number(newCoupon.maxUses),
      expiresAt: newCoupon.expiresAt ? newCoupon.expiresAt.toISOString() : null,
    }

    try {
      const res = await fetch("/api/coupons/createCoupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(couponData),
        credentials: "include"
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Erro ao criar cupom")
      }

      const createdCoupon = await res.json()
      setCoupons((prev) => [createdCoupon, ...prev])
      setIsCreateModalOpen(false)
      setNewCoupon({
        code: "",
        description: "",
        discountPct: 0,
        onlyOnce: false,
        minGb: 0,
        maxUses: 0,
        expiresAt: null,
      })
    } catch (error) {
      console.error("Erro criando cupom:", error)
      // Aqui pode mostrar toast, alerta, etc
    }
  }



  const handleToggleStatus = (couponId: string) => {
    setCoupons(coupons.map((coupon) => (coupon.id === couponId ? { ...coupon, isActive: !coupon.isActive } : coupon)))
    if (selectedCoupon?.id === couponId) {
      setSelectedCoupon({ ...selectedCoupon, isActive: !selectedCoupon.isActive })
    }
  }

  const handleDeleteCoupon = (couponId: string) => {
    setCoupons(coupons.filter((coupon) => coupon.id !== couponId))
    setIsModalOpen(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getCouponStatus = (coupon: any) => {
    const isExpired = new Date(coupon.expiresAt) < new Date()
    const isMaxUsed = coupon.currentUses >= coupon.maxUses

    if (!coupon.isActive) return { label: "Inativo", color: "bg-gray-600" }
    if (isExpired) return { label: "Expirado", color: "bg-red-600" }
    if (isMaxUsed) return { label: "Esgotado", color: "bg-orange-600" }
    return { label: "Ativo", color: "bg-green-600" }
  }

  return (

    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gerenciamento de Cupons</h1>
          <p className="text-slate-400">Crie e gerencie cupons de desconto</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Criar Cupom
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total de Cupons</CardTitle>
            <Ticket className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{coupons.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Cupons Ativos</CardTitle>
            <Ticket className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{coupons.filter((c) => c.isActive).length}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total de Usos</CardTitle>
            <Users className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{coupons.reduce((acc, c) => acc + 10, 0)}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Taxa de Uso</CardTitle>
            <Percent className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {Math.round(
                (coupons.reduce((acc, c) => acc + 10, 0) / coupons.reduce((acc, c) => acc + 10, 0)) *
                100,
              )}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar por código ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="percentage">Porcentagem</SelectItem>
                <SelectItem value="fixed">Valor Fixo</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações de Paginação */}
      {filteredCoupons.length > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>
            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredCoupons.length)} de {filteredCoupons.length} cupons
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              ))}
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

      {/* Lista de Cupons */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentCoupons.map((coupon) => {
          const status = getCouponStatus(coupon)
          const currentUses = coupon.currentUses ?? 0
          const maxUses = coupon.maxUses ?? 0
          const expiresAt = coupon.expiresAt ? new Date(coupon.expiresAt) : null
          return (
            <Card
              key={coupon.id}
              className="bg-slate-800 border-slate-700 cursor-pointer hover:bg-slate-750 transition-colors"
              onClick={() => handleCouponClick(coupon)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-purple-400" />
                    <CardTitle className="text-lg text-white">{coupon.code}</CardTitle>
                  </div>
                  <Badge className={status.color}>{status.label}</Badge>
                </div>
                <CardDescription className="text-slate-400">{coupon.description || "Sem descrição"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Desconto:</span>
                    <span className="text-white font-medium">
                      {coupon.discountPct}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Usos:</span>
                    <span className="text-white font-medium">
                      {currentUses}/{maxUses}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Expira em:</span>
                    <span className="text-white font-medium">
                      {expiresAt ? format(expiresAt, "dd/MM/yyyy", { locale: ptBR }) : "Sem expiração"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2 mt-3">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: maxUses > 0 ? `${(currentUses / maxUses) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Modal de Criação de Cupom */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Criar Novo Cupom
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Preencha as informações para criar um novo cupom de desconto
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Código do Cupom *</Label>
                <Input
                  value={newCoupon.code}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })
                  }
                  placeholder="Ex: WELCOME50"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Uso único *</Label>
                <input
                  type="checkbox"
                  checked={newCoupon.onlyOnce}
                  onChange={(e) => setNewCoupon({ ...newCoupon, onlyOnce: e.target.checked })}
                />
              </div>
            </div>

            <div>
              <Label className="text-slate-300">Descrição *</Label>
              <Textarea
                value={newCoupon.description}
                onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                placeholder="Descreva o cupom..."
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-slate-300">Valor do Desconto (%) *</Label>
                <Input
                  type="number"
                  value={newCoupon.discountPct}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, discountPct: Number(e.target.value) })
                  }
                  placeholder="50"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Máximo de Usos *</Label>
                <Input
                  type="number"
                  value={newCoupon.maxUses}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, maxUses: Number(e.target.value) })
                  }
                  placeholder="100"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Compra Mínima (GB)</Label>
                <Input
                  type="number"
                  value={newCoupon.minGb}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, minGb: Number(e.target.value) })
                  }
                  placeholder="0"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div>
              <Calendar
                mode="single"
                selected={newCoupon.expiresAt ?? undefined} // null vira undefined
                onSelect={(date) => setNewCoupon({ ...newCoupon, expiresAt: date ?? null })}
                initialFocus
                className="text-white bg-slate-800"
              />

            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => setIsCreateModalOpen(false)}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateCoupon}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={
                  !newCoupon.code ||
                  !newCoupon.description ||
                  !newCoupon.discountPct ||
                  !newCoupon.maxUses
                }
              >
                Criar Cupom
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      {/* Modal de Detalhes do Cupom */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Detalhes do Cupom
            </DialogTitle>
            <DialogDescription className="text-slate-400">Visualize e gerencie informações do cupom</DialogDescription>
          </DialogHeader>

          {selectedCoupon && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                <TabsTrigger value="details" className="text-slate-300 data-[state=active]:text-white">
                  Detalhes
                </TabsTrigger>
                <TabsTrigger value="usage" className="text-slate-300 data-[state=active]:text-white">
                  Estatísticas
                </TabsTrigger>
                <TabsTrigger value="actions" className="text-slate-300 data-[state=active]:text-white">
                  Ações
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Código</Label>
                    <div className="flex gap-2">
                      <Input
                        value={selectedCoupon.code}
                        disabled
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(selectedCoupon.code)}
                        className="border-slate-600 text-slate-300 hover:text-white"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-300">Tipo</Label>
                    <Input
                      value={selectedCoupon.type === "percentage" ? "Porcentagem" : "Valor Fixo"}
                      disabled
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Desconto</Label>
                    <Input
                      value={
                        selectedCoupon.type === "percentage"
                          ? `${selectedCoupon.discountPct}%`
                          : `${selectedCoupon.discountPct} GB` // ajuste para o campo correto do valor fixo
                      }
                      disabled
                      className="bg-slate-700 border-slate-600 text-white"
                    />

                  </div>
                  <div>
                    <Label className="text-slate-300">Compra Mínima</Label>
                    <Input
                      value={`${selectedCoupon.minGb ?? 0} GB`}
                      disabled
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Data de Criação</Label>
                    <Input
                      value={format(new Date(selectedCoupon.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      disabled
                      className="bg-slate-700 border-slate-600 text-white"
                    />

                  </div>
                  <div>
                    <Label className="text-slate-300">Data de Expiração</Label>
                    <Input
                      value={
                        selectedCoupon.expiresAt
                          ? format(new Date(selectedCoupon.expiresAt), "dd/MM/yyyy", { locale: ptBR })
                          : "Sem expiração"
                      }
                      disabled
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300">Descrição</Label>
                  <Textarea
                    value={selectedCoupon.description}
                    disabled
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </TabsContent>

              <TabsContent value="usage" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-300">Usos Atuais</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{selectedCoupon.currentUses}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-300">Máximo de Usos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{selectedCoupon.maxUses}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-300">Usos Restantes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-400">
                        {selectedCoupon.maxUses - selectedCoupon.currentUses}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-300">Taxa de Uso</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-400">
                        {Math.round((selectedCoupon.currentUses / selectedCoupon.maxUses) * 100)}%
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full bg-slate-700 rounded-lg p-4">
                  <div className="flex justify-between text-sm text-slate-300 mb-2">
                    <span>Progresso de Uso</span>
                    <span>{Math.round((selectedCoupon.currentUses / selectedCoupon.maxUses) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${(selectedCoupon.currentUses / selectedCoupon.maxUses) * 100}%` }}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                <Alert className="border-yellow-500 bg-yellow-500/10">
                  <AlertDescription className="text-yellow-400">
                    As ações abaixo podem afetar usuários que possuem este cupom.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleToggleStatus(selectedCoupon.id)}
                    variant="outline"
                    className={`border-slate-600 ${selectedCoupon.isActive
                      ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      : "text-green-400 hover:text-green-300 hover:bg-green-500/10"
                      }`}
                  >
                    {selectedCoupon.isActive ? "Desativar Cupom" : "Ativar Cupom"}
                  </Button>

                  <Button
                    onClick={() => handleDeleteCoupon(selectedCoupon.id)}
                    variant="outline"
                    className="border-red-500 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir Cupom
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Copiar Código do Cupom</Label>
                  <div className="flex gap-2">
                    <Input value={selectedCoupon.code} disabled className="bg-slate-700 border-slate-600 text-white" />
                    <Button
                      onClick={() => copyToClipboard(selectedCoupon.code)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
