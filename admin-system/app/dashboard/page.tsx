"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, HardDrive, UserCheck, TrendingUp } from "lucide-react"

const salesData = [
  { month: "Jan", gbs: 1200, users: 45 },
  { month: "Fev", gbs: 1900, users: 67 },
  { month: "Mar", gbs: 2100, users: 89 },
  { month: "Abr", gbs: 2800, users: 112 },
  { month: "Mai", gbs: 3200, users: 134 },
  { month: "Jun", gbs: 3800, users: 156 },
]

const consumptionData = [
  { name: "Plano Básico", value: 35, color: "#8b5cf6" },
  { name: "Plano Pro", value: 45, color: "#06b6d4" },
  { name: "Plano Premium", value: 20, color: "#10b981" },
]

const userGrowthData = [
  { month: "Jan", total: 245, novos: 45 },
  { month: "Fev", total: 312, novos: 67 },
  { month: "Mar", total: 401, novos: 89 },
  { month: "Abr", total: 513, novos: 112 },
  { month: "Mai", total: 647, novos: 134 },
  { month: "Jun", total: 803, novos: 156 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400">Visão geral do sistema de proxy</p>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">803</div>
            <p className="text-xs text-green-400">+12.5% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">GBs Vendidos</CardTitle>
            <HardDrive className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3,800 GB</div>
            <p className="text-xs text-green-400">+18.2% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Clientes Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">742</div>
            <p className="text-xs text-green-400">92.4% dos usuários totais</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Receita Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R$ 28,400</div>
            <p className="text-xs text-green-400">+22.1% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">GBs Vendidos por Período</CardTitle>
            <CardDescription className="text-slate-400">Evolução das vendas nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                gbs: {
                  label: "GBs",
                  color: "#8b5cf6",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="gbs" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Crescimento de Usuários</CardTitle>
            <CardDescription className="text-slate-400">Total de usuários e novos cadastros</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                total: {
                  label: "Total",
                  color: "#06b6d4",
                },
                novos: {
                  label: "Novos",
                  color: "#10b981",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="total" stroke="#06b6d4" strokeWidth={3} />
                  <Line type="monotone" dataKey="novos" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-slate-800 border-slate-700 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-white">Consumo Médio por Plano</CardTitle>
            <CardDescription className="text-slate-400">Distribuição de uso por tipo de plano</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Porcentagem",
                },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={consumptionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {consumptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {consumptionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Atividade Recente</CardTitle>
            <CardDescription className="text-slate-400">Últimas ações no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Novo usuário cadastrado", user: "joão@email.com", time: "2 min atrás", type: "success" },
                { action: "Compra de 50GB realizada", user: "maria@email.com", time: "5 min atrás", type: "info" },
                { action: "Usuário bloqueado", user: "spam@email.com", time: "12 min atrás", type: "warning" },
                { action: "Saldo adicionado", user: "cliente@email.com", time: "18 min atrás", type: "success" },
                { action: "Login de administrador", user: "admin@proxy.com", time: "25 min atrás", type: "info" },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "success"
                          ? "bg-green-400"
                          : activity.type === "warning"
                            ? "bg-yellow-400"
                            : "bg-blue-400"
                      }`}
                    />
                    <div>
                      <p className="text-sm text-white">{activity.action}</p>
                      <p className="text-xs text-slate-400">{activity.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
