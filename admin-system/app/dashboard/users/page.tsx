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
import {
  Search,
  Filter,
  Plus,
  Edit,
  Lock,
  Unlock,
  Trash2,
  DollarSign,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// Expandir os dados simulados dos usuários para demonstrar paginação
const usersData = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    status: "active",
    gbsPurchased: 150,
    gbsUsed: 89,
    referrals: 3,
    joinDate: "2024-01-15",
    lastLogin: "2024-01-20",
    plan: "Pro",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@email.com",
    status: "active",
    gbsPurchased: 300,
    gbsUsed: 245,
    referrals: 7,
    joinDate: "2024-01-10",
    lastLogin: "2024-01-19",
    plan: "Premium",
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro@email.com",
    status: "blocked",
    gbsPurchased: 50,
    gbsUsed: 50,
    referrals: 0,
    joinDate: "2024-01-18",
    lastLogin: "2024-01-18",
    plan: "Básico",
  },
  {
    id: 4,
    name: "Ana Oliveira",
    email: "ana@email.com",
    status: "active",
    gbsPurchased: 200,
    gbsUsed: 156,
    referrals: 12,
    joinDate: "2024-01-05",
    lastLogin: "2024-01-20",
    plan: "Pro",
  },
  {
    id: 5,
    name: "Carlos Mendes",
    email: "carlos@email.com",
    status: "active",
    gbsPurchased: 100,
    gbsUsed: 45,
    referrals: 2,
    joinDate: "2024-01-12",
    lastLogin: "2024-01-19",
    plan: "Básico",
  },
  {
    id: 6,
    name: "Lucia Ferreira",
    email: "lucia@email.com",
    status: "active",
    gbsPurchased: 250,
    gbsUsed: 180,
    referrals: 8,
    joinDate: "2024-01-08",
    lastLogin: "2024-01-20",
    plan: "Premium",
  },
  {
    id: 7,
    name: "Roberto Lima",
    email: "roberto@email.com",
    status: "blocked",
    gbsPurchased: 75,
    gbsUsed: 75,
    referrals: 1,
    joinDate: "2024-01-16",
    lastLogin: "2024-01-17",
    plan: "Básico",
  },
  {
    id: 8,
    name: "Fernanda Rocha",
    email: "fernanda@email.com",
    status: "active",
    gbsPurchased: 180,
    gbsUsed: 120,
    referrals: 5,
    joinDate: "2024-01-11",
    lastLogin: "2024-01-20",
    plan: "Pro",
  },
  {
    id: 9,
    name: "Marcos Alves",
    email: "marcos@email.com",
    status: "active",
    gbsPurchased: 320,
    gbsUsed: 280,
    referrals: 15,
    joinDate: "2024-01-03",
    lastLogin: "2024-01-19",
    plan: "Premium",
  },
  {
    id: 10,
    name: "Patricia Souza",
    email: "patricia@email.com",
    status: "active",
    gbsPurchased: 90,
    gbsUsed: 60,
    referrals: 3,
    joinDate: "2024-01-14",
    lastLogin: "2024-01-20",
    plan: "Básico",
  },
  {
    id: 11,
    name: "Ricardo Gomes",
    email: "ricardo@email.com",
    status: "blocked",
    gbsPurchased: 40,
    gbsUsed: 40,
    referrals: 0,
    joinDate: "2024-01-17",
    lastLogin: "2024-01-17",
    plan: "Básico",
  },
  {
    id: 12,
    name: "Juliana Castro",
    email: "juliana@email.com",
    status: "active",
    gbsPurchased: 220,
    gbsUsed: 150,
    referrals: 9,
    joinDate: "2024-01-06",
    lastLogin: "2024-01-20",
    plan: "Pro",
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState(usersData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  // Debounce para busca em tempo real
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1) // Reset para primeira página ao buscar
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Lógica de paginação
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleUserClick = (user: any) => {
    setSelectedUser(user)
    setEditMode(false)
    setIsModalOpen(true)
  }

  const handleStatusChange = (userId: number, newStatus: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))
    if (selectedUser?.id === userId) {
      setSelectedUser({ ...selectedUser, status: newStatus })
    }
  }

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId))
    setIsModalOpen(false)
  }

  const handleAddBalance = (userId: number, amount: number) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, gbsPurchased: user.gbsPurchased + amount } : user)))
    if (selectedUser?.id === userId) {
      setSelectedUser({ ...selectedUser, gbsPurchased: selectedUser.gbsPurchased + amount })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gerenciamento de Usuários</h1>
          <p className="text-slate-400">Gerencie todos os usuários do sistema</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Usuário
        </Button>
      </div>

      {/* Filtros e Busca */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar por e-mail ou nome..."
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
                <SelectItem value="blocked">Bloqueados</SelectItem>
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
      {filteredUsers.length > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>
            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredUsers.length)} de {filteredUsers.length} usuários
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

      {/* Lista de Usuários */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Usuários ({filteredUsers.length})</CardTitle>
          <CardDescription className="text-slate-400">Clique em um usuário para ver detalhes e ações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserClick(user)}
                className="flex items-center justify-between p-4 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{user.name}</h3>
                    <p className="text-sm text-slate-400">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-white">
                      {user.gbsUsed}/{user.gbsPurchased} GB
                    </p>
                    <p className="text-xs text-slate-400">{user.plan}</p>
                  </div>
                  <Badge
                    variant={user.status === "active" ? "default" : "destructive"}
                    className={user.status === "active" ? "bg-green-600" : "bg-red-600"}
                  >
                    {user.status === "active" ? "Ativo" : "Bloqueado"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes do Usuário */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Detalhes do Usuário
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Visualize e gerencie informações do usuário
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                <TabsTrigger value="details" className="text-slate-300 data-[state=active]:text-white">
                  Detalhes
                </TabsTrigger>
                <TabsTrigger value="usage" className="text-slate-300 data-[state=active]:text-white">
                  Uso de Dados
                </TabsTrigger>
                <TabsTrigger value="actions" className="text-slate-300 data-[state=active]:text-white">
                  Ações
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Nome</Label>
                    <Input
                      value={selectedUser.name}
                      disabled={!editMode}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">E-mail</Label>
                    <Input
                      value={selectedUser.email}
                      disabled={!editMode}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Plano</Label>
                    <Input
                      value={selectedUser.plan}
                      disabled={!editMode}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Status</Label>
                    <Badge
                      variant={selectedUser.status === "active" ? "default" : "destructive"}
                      className={`${selectedUser.status === "active" ? "bg-green-600" : "bg-red-600"} w-fit`}
                    >
                      {selectedUser.status === "active" ? "Ativo" : "Bloqueado"}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-slate-300">Data de Cadastro</Label>
                    <Input
                      value={new Date(selectedUser.joinDate).toLocaleDateString("pt-BR")}
                      disabled
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Último Login</Label>
                    <Input
                      value={new Date(selectedUser.lastLogin).toLocaleDateString("pt-BR")}
                      disabled
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setEditMode(!editMode)}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {editMode ? "Cancelar" : "Editar"}
                  </Button>
                  {editMode && <Button className="bg-purple-600 hover:bg-purple-700">Salvar Alterações</Button>}
                </div>
              </TabsContent>

              <TabsContent value="usage" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-300">GBs Comprados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{selectedUser.gbsPurchased} GB</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-300">GBs Utilizados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{selectedUser.gbsUsed} GB</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-300">GBs Restantes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-400">
                        {selectedUser.gbsPurchased - selectedUser.gbsUsed} GB
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-300">Indicações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-400">{selectedUser.referrals}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full bg-slate-700 rounded-lg p-4">
                  <div className="flex justify-between text-sm text-slate-300 mb-2">
                    <span>Uso de Dados</span>
                    <span>{Math.round((selectedUser.gbsUsed / selectedUser.gbsPurchased) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${(selectedUser.gbsUsed / selectedUser.gbsPurchased) * 100}%` }}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                <Alert className="border-yellow-500 bg-yellow-500/10">
                  <AlertDescription className="text-yellow-400">
                    As ações abaixo são irreversíveis. Proceda com cuidado.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() =>
                      handleStatusChange(selectedUser.id, selectedUser.status === "active" ? "blocked" : "active")
                    }
                    variant="outline"
                    className={`border-slate-600 ${
                      selectedUser.status === "active"
                        ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        : "text-green-400 hover:text-green-300 hover:bg-green-500/10"
                    }`}
                  >
                    {selectedUser.status === "active" ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Bloquear Usuário
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4 mr-2" />
                        Desbloquear Usuário
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleDeleteUser(selectedUser.id)}
                    variant="outline"
                    className="border-red-500 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir Usuário
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Adicionar Saldo (GB)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Quantidade em GB"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button
                      onClick={() => handleAddBalance(selectedUser.id, 50)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Adicionar
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
