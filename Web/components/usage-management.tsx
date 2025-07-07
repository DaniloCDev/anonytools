"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, TrendingDown, Calendar } from "lucide-react"

export function UsageManagement() {
  const usageData = [
    { date: "2024-01-10", usage: 2.1, percentage: 85 },
    { date: "2024-01-09", usage: 1.8, percentage: 72 },
    { date: "2024-01-08", usage: 3.2, percentage: 95 },
    { date: "2024-01-07", usage: 1.5, percentage: 60 },
    { date: "2024-01-06", usage: 2.8, percentage: 88 },
  ]

  const monthlyStats = {
    totalUsed: 15.4,
    totalAvailable: 50,
    averageDaily: 2.2,
    peakDay: 3.2,
    trend: "up",
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          <span className="gradient-text">Gerenciar Usos</span>
        </h1>
        <p className="text-gray-400">Monitore e analise o consumo dos seus proxies</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {/* Stats Cards */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Uso Total</p>
                  <p className="text-2xl font-bold">{monthlyStats.totalUsed}GB</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Disponível</p>
                  <p className="text-2xl font-bold">{monthlyStats.totalAvailable}GB</p>
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
                  <p className="text-sm text-gray-400">Média Diária</p>
                  <p className="text-2xl font-bold">{monthlyStats.averageDaily}GB</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pico do Mês</p>
                  <p className="text-2xl font-bold">{monthlyStats.peakDay}GB</p>
                </div>
                {monthlyStats.trend === "up" ? (
                  <TrendingUp className="w-8 h-8 text-green-400" />
                ) : (
                  <TrendingDown className="w-8 h-8 text-red-400" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Progress */}
        <div className="lg:col-span-2">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle>Uso Mensal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Progresso do mês</span>
                  <span className="text-sm font-medium">
                    {monthlyStats.totalUsed}GB / {monthlyStats.totalAvailable}GB
                  </span>
                </div>
                <Progress value={(monthlyStats.totalUsed / monthlyStats.totalAvailable) * 100} className="h-3" />
                <p className="text-sm text-gray-400 mt-1">
                  {(monthlyStats.totalAvailable - monthlyStats.totalUsed).toFixed(1)}GB restantes
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Uso Normal</Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  {((monthlyStats.totalUsed / monthlyStats.totalAvailable) * 100).toFixed(0)}% Usado
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Usage */}
        <div className="lg:col-span-2">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle>Uso Diário (Últimos 5 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {usageData.map((day, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{day.date}</span>
                      <span className="font-medium">{day.usage}GB</span>
                    </div>
                    <Progress value={day.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Tips */}
        <div className="lg:col-span-4">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle>Dicas de Otimização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 glass rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-400">Monitore Picos</h4>
                  <p className="text-sm text-gray-400">
                    Identifique horários de maior uso para otimizar suas aplicações
                  </p>
                </div>
                <div className="p-4 glass rounded-lg">
                  <h4 className="font-semibold mb-2 text-green-400">Cache Inteligente</h4>
                  <p className="text-sm text-gray-400">Implemente cache para reduzir requisições desnecessárias</p>
                </div>
                <div className="p-4 glass rounded-lg">
                  <h4 className="font-semibold mb-2 text-purple-400">Rotação Eficiente</h4>
                  <p className="text-sm text-gray-400">Configure rotação de IPs para distribuir melhor o tráfego</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
