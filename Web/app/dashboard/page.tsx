"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Copy, Plus, Activity, Shield, Clock, Eye, EyeOff, RefreshCw } from "lucide-react"
import { useState } from "react"
import { AddBalanceModal } from "@/components/add-balance-modal"
import { useToast } from "@/components/toast-provider"

export default function Dashboard() {
  const [showCredentials, setShowCredentials] = useState(false)
  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false)
  const { addToast } = useToast()

  // Mock data - em produção viria de uma API
  const [userPlan, setUserPlan] = useState({
    name: "Proxy Brasil 10GB",
    totalGb: 10,
    usedGb: 3.2,
    remainingGb: 6.8,
    status: "active",
    expiresAt: "2024-02-15",
    credentials: {
      host: "proxy.proxybr.com",
      port: "8080",
      username: "user_12345",
      password: "pass_67890",
    },
  })

  const recentActivity = [
    { date: "2024-01-10", action: "Conexão estabelecida", ip: "191.123.45.67", data: "0.5GB" },
    { date: "2024-01-09", action: "Renovação automática", ip: "-", data: "10GB" },
    { date: "2024-01-08", action: "Conexão estabelecida", ip: "191.234.56.78", data: "1.2GB" },
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    addToast({
      type: "success",
      title: "Copiado!",
      message: "Texto copiado para a área de transferência",
      duration: 2000,
    })
  }

  const generateNewPassword = () => {
    // Gerar nova senha aleatória
    const newPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase()

    setUserPlan((prev) => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        password: newPassword,
      },
    }))

    addToast({
      type: "success",
      title: "Nova senha gerada!",
      message: `Sua nova senha é: ${newPassword}`,
      duration: 8000,
    })
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Meu <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-gray-400">Gerencie seus proxies e monitore o uso</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Overview */}
            <Card className="glass border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{userPlan.name}</CardTitle>
                  <p className="text-gray-400">Plano ativo até {userPlan.expiresAt}</p>
                </div>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  <Activity className="w-4 h-4 mr-1" />
                  Ativo
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">Uso de dados</span>
                    <span className="text-sm font-medium">
                      {userPlan.usedGb}GB / {userPlan.totalGb}GB
                    </span>
                  </div>
                  <Progress value={(userPlan.usedGb / userPlan.totalGb) * 100} className="h-2" />
                  <p className="text-sm text-gray-400 mt-1">{userPlan.remainingGb}GB restantes</p>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={() => setShowAddBalanceModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Saldo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Proxy Credentials */}
            <Card className="glass border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Credenciais do Proxy
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowCredentials(!showCredentials)}>
                  {showCredentials ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Host</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 glass rounded text-sm">{userPlan.credentials.host}</code>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyToClipboard(userPlan.credentials.host)}
                        className="w-8 h-8"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Porta</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 glass rounded text-sm">{userPlan.credentials.port}</code>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyToClipboard(userPlan.credentials.port)}
                        className="w-8 h-8"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Usuário</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 glass rounded text-sm">
                        {showCredentials ? userPlan.credentials.username : "••••••••"}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyToClipboard(userPlan.credentials.username)}
                        className="w-8 h-8"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Senha</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 glass rounded text-sm">
                        {showCredentials ? userPlan.credentials.password : "••••••••"}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyToClipboard(userPlan.credentials.password)}
                        className="w-8 h-8"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={generateNewPassword}
                  variant="outline"
                  className="w-full glass glass-hover border-white/20 mt-4"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Gerar Nova Senha
                </Button>

                <div className="p-4 glass rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Configuração rápida:</p>
                  <code className="text-xs text-green-400">
                    curl -x {userPlan.credentials.host}:{userPlan.credentials.port} -U {userPlan.credentials.username}:
                    {userPlan.credentials.password} https://httpbin.org/ip
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 glass rounded-lg">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-400">{activity.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{activity.ip}</p>
                        <p className="text-sm text-blue-400">{activity.data}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Conexões hoje</span>
                  <span className="font-bold text-blue-400">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Uptime</span>
                  <span className="font-bold text-green-400">99.9%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Velocidade média</span>
                  <span className="font-bold">125 Mbps</span>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle>Precisa de Ajuda?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-400">Nossa equipe está disponível 24/7 para ajudar você</p>
                <Button className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                  Contatar Suporte
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <AddBalanceModal isOpen={showAddBalanceModal} onClose={() => setShowAddBalanceModal(false)} />
    </div>
  )
}
