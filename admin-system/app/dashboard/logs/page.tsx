"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Search,
  Filter,
  CalendarIcon,
  Download,
  Activity,
  User,
  Shield,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import useLogs from "@/hooks/useLogs"


export default function LogsPage() {
  const { logs, loading, error } = useLogs()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date>()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  // Debounce para busca em tempo real
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1) // Reset para primeira página ao buscar
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (log.admin && log.admin.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
    const matchesType = typeFilter === "all" || log.type === typeFilter
    const matchesDate = !dateFilter || new Date(log.timestamp).toDateString() === dateFilter.toDateString()
    return matchesSearch && matchesType && matchesDate
  })

  // Lógica de paginação
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLogs = filteredLogs.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Activity className="w-4 h-4 text-green-400" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      case "info":
      default:
        return <User className="w-4 h-4 text-blue-400" />
    }
  }

  const getTypeBadge = (type: string) => {
    const variants = {
      success: "bg-green-600",
      warning: "bg-yellow-600",
      error: "bg-red-600",
      info: "bg-blue-600",
    }

    const labels = {
      success: "Sucesso",
      warning: "Aviso",
      error: "Erro",
      info: "Info",
    }

    return <Badge className={variants[type as keyof typeof variants]}>{labels[type as keyof typeof labels]}</Badge>
  }

  if (loading) return <p className="text-white">Carregando logs...</p>
  if (error) return <p className="text-red-500">Erro: {error}</p>


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Logs do Sistema</h1>
          <p className="text-slate-400">Histórico de ações e eventos do sistema</p>
        </div>
        <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Exportar Logs
        </Button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total de Logs</CardTitle>
            <Activity className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{filteredLogs.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Sucessos</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {filteredLogs.filter((log) => log.type === "success").length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Avisos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {filteredLogs.filter((log) => log.type === "warning").length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Erros</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {filteredLogs.filter((log) => log.type === "error").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar por ação, usuário ou admin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="success">Sucesso</SelectItem>
                <SelectItem value="warning">Aviso</SelectItem>
                <SelectItem value="error">Erro</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[200px] justify-start text-left font-normal bg-slate-700 border-slate-600 text-white"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "PPP", { locale: ptBR }) : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                  className="text-white bg-slate-800"
                />
              </PopoverContent>
            </Popover>

            {(dateFilter || typeFilter !== "all" || searchTerm) && (
              <Button
                variant="outline"
                onClick={() => {
                  setDateFilter(undefined)
                  setTypeFilter("all")
                  setSearchTerm("")
                }}
                className="border-slate-600 text-slate-300 hover:text-white"
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informações de Paginação */}
      {filteredLogs.length > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>
            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredLogs.length)} de {filteredLogs.length} logs
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

      {/* Lista de Logs */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Logs de Atividade ({filteredLogs.length})</CardTitle>
          <CardDescription className="text-slate-400">Histórico detalhado de todas as ações do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-4 bg-slate-700 rounded-lg">
                <div className="flex-shrink-0 mt-1">{getTypeIcon(log.type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white truncate">{log.action}</h3>
                    {getTypeBadge(log.type)}
                  </div>

                  <div className="space-y-1 text-sm text-slate-400">
                    <div className="flex items-center gap-4">
                      <span>
                        <User className="w-3 h-3 inline mr-1" />
                        Usuário: {log.user}
                      </span>
                      {log.admin && (
                        <span>
                          <Shield className="w-3 h-3 inline mr-1" />
                          Admin: {log.admin}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-300">{log.details}</p>

                    <div className="flex items-center gap-4 text-xs">
                      <span>{format(new Date(log.timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                      <span>IP: {log.ip}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {currentLogs.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum log encontrado com os filtros aplicados.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
