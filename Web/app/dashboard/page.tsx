"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { AddBalanceModal } from "@/components/add-balance-modal"
import { AccountSettings } from "@/components/account-settings"
import { UsageManagement } from "@/components/usage-management"
import { PurchaseHistory } from "@/components/purchase-history"
import { useToast } from "@/components/toast-provider"
import { Copy, Plus, Activity, Shield, Clock, Eye, EyeOff, RefreshCw, HelpCircle } from "lucide-react"
import { useUser } from "@/contexts/UserContext";

type UserBalance = {
  balance: number;
  balance_format: string;
  balance_total: number;
  balance_total_format: string;
  balance_used: number;
  balance_used_format: string;
  threads_used: number;
};

export function useUserBalance() {
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [loadingBalance, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/user/get-balance")
      .then(res => res.json())
      .then(data => {
        setBalance(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { balance, loadingBalance };
}

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("proxys")
  const [showCredentials, setShowCredentials] = useState(false)
  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false)
  const [timeoutReached, setTimeoutReached] = useState(false);
  const { addToast } = useToast()
  const { balance, loadingBalance } = useUserBalance();


  const { user, loading } = useUser();
  const userPlan = user?.plan;

  useEffect(() => {
    const timer = setTimeout(() => setTimeoutReached(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !userPlan) {
    if (timeoutReached) {

      return (
        <div className="flex justify-center items-center h-screen text-white text-xl">
          <img src="/error.gif" alt="Carregando..." className="w-20 h-20 mb-4" />
          Erro ao carregar . Tente novamente.
        </div>
      )
    }

    return (
      // return (
      //<div className="flex justify-center items-center h-screen text-white text-xl flex-col">
      //<img src="/loading.gif" alt="Carregando..." className="w-20 h-20 mb-4" />
      //Carregando informações do plano...
      //</div>
      // );
      <div className="flex justify-center items-center h-screen text-white text-xl">
        <img src="/loading.gif" alt="Carregando..." className="w-20 h-20 mb-4" />
        Carregando informações...
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    addToast({
      type: "success",
      title: "Copiado!",
      message: "Texto copiado para a área de transferência",
      duration: 2000,
    })
  }

  const renderContent = () => {
    switch (activeMenu) {
      case "proxys":
        return (
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold">
                <span className="gradient-text">Dashboard</span> Proxys
              </h1>
              <p className="text-gray-400 text-lg lg:text-xl">Visão geral dos seus proxies e credenciais</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
              {/* Main Content */}
              <div className="xl:col-span-8 space-y-6 lg:space-y-8">
                {/* Plan Overview */}
                <Card className="glass border-white/10">
                  <CardHeader className="pb-4 lg:pb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="space-y-1">
                        <CardTitle className="text-xl lg:text-2xl">Uso do Plano</CardTitle>
                        <p className="text-gray-400 lg:text-lg">Plano válido enquanto houver saldo disponível</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 w-fit px-4 py-2 text-sm lg:text-base">
                        <Activity className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                        Ativo
                      </Badge>
                    </div>
                  </CardHeader>


                  <CardContent className="space-y-6">
                    {!loadingBalance && balance && (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400 lg:text-lg">Uso de dados</span>
                          <span className="font-medium lg:text-lg">
                            {balance.balance_used_format} / {balance.balance_total_format}
                          </span>
                        </div>
                        <div className="relative w-full h-3 lg:h-4 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
                            style={{ width: `${(balance.balance_used / balance.balance_total) * 100}%` }}
                          />
                        </div>
                        <p className="text-gray-400 lg:text-lg">
                          {((balance.balance_total - balance.balance_used) / 1_073_741_824).toFixed(2)}GB restantes
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={() => setShowAddBalanceModal(true)}
                      className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 text-base lg:text-lg"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Adicionar Saldo
                    </Button>
                  </CardContent>
                </Card>

                {/* Proxy Credentials */}
                <Card className="glass border-white/10">
                  <CardHeader className="pb-4 lg:pb-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
                        <Shield className="w-6 h-6 lg:w-7 lg:h-7" />
                        Credenciais do Proxy
                      </CardTitle>
                      <Button variant="ghost" size="lg" onClick={() => setShowCredentials(!showCredentials)}>
                        {showCredentials ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                      <div className="space-y-3">
                        <label className="text-sm text-gray-400 uppercase tracking-wide font-medium">Host</label>
                        <div className="flex items-center gap-3">
                          <code className="flex-1 p-3 lg:p-4 glass rounded-lg text-sm lg:text-base font-mono">
                            {userPlan.credentials.host}
                          </code>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => copyToClipboard(userPlan.credentials.host)}
                            className="w-10 h-10 lg:w-12 lg:h-12"
                          >
                            <Copy className="w-4 h-4 lg:w-5 lg:h-5" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm text-gray-400 uppercase tracking-wide font-medium">Porta</label>
                        <div className="flex items-center gap-3">
                          <code className="flex-1 p-3 lg:p-4 glass rounded-lg text-sm lg:text-base font-mono">
                            {userPlan.credentials.port}
                          </code>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => copyToClipboard(userPlan.credentials.port)}
                            className="w-10 h-10 lg:w-12 lg:h-12"
                          >
                            <Copy className="w-4 h-4 lg:w-5 lg:h-5" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm text-gray-400 uppercase tracking-wide font-medium">Usuário</label>
                        <div className="flex items-center gap-3">
                          <code className="flex-1 p-3 lg:p-4 glass rounded-lg text-sm lg:text-base font-mono">
                            {showCredentials ? userPlan.credentials.username : "••••••••••••••••"}
                          </code>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => copyToClipboard(userPlan.credentials.username)}
                            className="w-10 h-10 lg:w-12 lg:h-12"
                          >
                            <Copy className="w-4 h-4 lg:w-5 lg:h-5" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm text-gray-400 uppercase tracking-wide font-medium">Senha</label>
                        <div className="flex items-center gap-3">
                          <code className="flex-1 p-3 lg:p-4 glass rounded-lg text-sm lg:text-base font-mono">
                            {showCredentials ? userPlan.credentials.password : "••••••••••••••••"}
                          </code>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => copyToClipboard(userPlan.credentials.password)}
                            className="w-10 h-10 lg:w-12 lg:h-12"
                          >
                            <Copy className="w-4 h-4 lg:w-5 lg:h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {/**                     <Button
                     // onClick={""}
                      variant="outline"
                      className="w-full lg:w-auto glass glass-hover border-white/20 bg-transparent px-6 py-3 text-base"
                    >
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Gerar Nova Senha
                    </Button>
*/}

                    <div className="p-4 lg:p-6 glass rounded-lg">
                      <p className="text-sm text-gray-400 mb-3 uppercase tracking-wide font-medium">
                        Configuração rápida:
                      </p>
                      <code className="text-sm lg:text-base text-green-400 break-all block font-mono leading-relaxed">
                        curl -x {userPlan.credentials.host}:{userPlan.credentials.port} -U{" "}
                        {userPlan.credentials.username}:{userPlan.credentials.password} https://httpbin.org/ip
                      </code>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity *
                <Card className="glass border-white/10">
                  <CardHeader className="pb-4 lg:pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
                      <Clock className="w-6 h-6 lg:w-7 lg:h-7" />
                      Atividade Recente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-4 lg:p-6 glass rounded-lg">
                          <div className="space-y-1">
                            <p className="font-medium lg:text-lg">{activity.action}</p>
                            <p className="text-sm lg:text-base text-gray-400">{activity.date}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="text-sm lg:text-base">{activity.ip}</p>
                            <p className="text-sm lg:text-base text-blue-400 font-medium">{activity.data}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                */}
              </div>

              {/* Sidebar */}
              <div className="xl:col-span-4 space-y-6">
                {/* Quick Stats
                <Card className="glass border-white/10">
                  <CardHeader className="pb-4 lg:pb-6">
                    <CardTitle className="text-xl lg:text-2xl">Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 lg:space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 lg:text-lg">Conexões hoje</span>
                      <span className="font-bold text-blue-400 text-xl lg:text-2xl">47</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 lg:text-lg">Uptime</span>
                      <span className="font-bold text-green-400 text-xl lg:text-2xl">99.9%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 lg:text-lg">Velocidade média</span>
                      <span className="font-bold text-lg lg:text-xl">125 Mbps</span>
                    </div>
                  </CardContent>
                </Card>
                 */}


                {/* Support */}
                <Card className="glass border-white/10">
                  <CardHeader className="pb-4 lg:pb-6">
                    <CardTitle className="text-xl lg:text-2xl">Precisa de Ajuda?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 lg:space-y-6">
                    <p className="text-gray-400 lg:text-lg">Nossa equipe está disponível 24/7 para ajudar você</p>
                    <Button className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 py-3 text-base lg:text-lg">
                      Contatar Suporte
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )

      case "gerenciamento":
        return <UsageManagement />

      case "compras":
        return <PurchaseHistory />

      case "configurações":
        return (
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold">Configurações</h1>
              <p className="text-gray-400 text-lg lg:text-xl">Gerencie as configurações da sua conta</p>
            </div>
            <Card className="glass border-white/10 p-8 lg:p-12">
              <div className="text-center">
                <p className="text-gray-400 text-lg lg:text-xl">Configurações em desenvolvimento...</p>
              </div>
            </Card>
          </div>
        )

      case "suporte":
        return (
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold">Suporte</h1>
              <p className="text-gray-400 text-lg lg:text-xl">Entre em contato conosco</p>
            </div>
            <Card className="glass border-white/10 p-8 lg:p-12">
              <div className="text-center space-y-6 lg:space-y-8">
                <HelpCircle className="w-20 h-20 lg:w-24 lg:h-24 mx-auto text-blue-400" />
                <h3 className="text-2xl lg:text-3xl font-semibold">Como podemos ajudar?</h3>
                <p className="text-gray-400 text-lg lg:text-xl">Nossa equipe está disponível 24/7</p>
                <Button className="bg-gradient-to-r from-green-500 to-blue-600 px-8 py-4 text-lg">Abrir Ticket</Button>
              </div>
            </Card>
          </div>
        )

      case "conta":
        return <AccountSettings />

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 fixed left-0 top-0 h-screen">
          <DashboardSidebar onMenuClick={setActiveMenu} activeMenu={activeMenu} className="h-full" />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-80">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-black/50 backdrop-blur-sm">
            <MobileSidebar onMenuClick={setActiveMenu} activeMenu={activeMenu} />
            <h2 className="font-semibold text-lg capitalize">
              {activeMenu === "proxys" && "Dashboard"}
              {activeMenu === "gerenciamento" && "Gerenciamento"}
              {activeMenu === "compras" && "Compras"}
              {activeMenu === "configurações" && "Configurações"}
              {activeMenu === "suporte" && "Suporte"}
              {activeMenu === "conta" && "Minha Conta"}
            </h2>
            <div className="w-10" /> {/* Spacer */}
          </div>

          {/* Content */}
          <div className="p-4 lg:p-8 xl:p-12 max-w-[1600px] mx-auto w-full overflow-y-auto scrollbar-hide h-full lg:h-screen">
            {renderContent()}
          </div>
        </div>
      </div>

      <AddBalanceModal isOpen={showAddBalanceModal} onClose={() => setShowAddBalanceModal(false)} />
    </div>
  )

}
