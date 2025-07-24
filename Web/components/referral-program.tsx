"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/toast-provider"
import { Users, Gift, Share2, Copy, Trophy, Star, Zap, Crown, ArrowRight, CheckCircle, Sparkles } from "lucide-react"

export function ReferralProgram() {
  const { addToast } = useToast()
  const [referralCode] = useState("PROXYBR-JD2024")
  const [referralLink] = useState(`https://proxybr.com/ref/${referralCode}`)

  // Mock data - em produção viria de uma API
  const [stats, setStats] = useState({
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarned: 156.8,
    pendingReward: 45.5,
    nextRewardAt: 15,
    currentLevel: "Bronze",
    nextLevel: "Silver",
  })

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    addToast({
      type: "success",
      title: "Link copiado!",
      message: "Compartilhe com seus amigos e ganhe recompensas",
      duration: 3000,
    })
  }

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "Nox24proxy - Melhores Proxies do Brasil",
        text: "Ganhe 20% de desconto nos melhores proxies brasileiros!",
        url: referralLink,
      })
    } else {
      copyReferralLink()
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Bronze":
        return <Trophy className="w-5 h-5 text-orange-400" />
      case "Silver":
        return <Star className="w-5 h-5 text-gray-300" />
      case "Gold":
        return <Crown className="w-5 h-5 text-yellow-400" />
      default:
        return <Trophy className="w-5 h-5 text-orange-400" />
    }
  }

  const recentReferrals = [
    { name: "Carlos M.", date: "2024-01-15", reward: 15.9, status: "active" },
    { name: "Ana S.", date: "2024-01-12", reward: 12.5, status: "pending" },
    { name: "Pedro L.", date: "2024-01-10", reward: 18.3, status: "active" },
  ]

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold">
          <span className="gradient-text">Indique e Ganhe</span>
        </h1>
        <p className="text-gray-400 text-lg lg:text-xl">Compartilhe com amigos e ganhe recompensas incríveis</p>
      </div>

      {/* Hero Card */}
      <Card className="glass border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-2xl" />

        <CardContent className="relative p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Programa Ativo
                </Badge>
              </div>

              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Ganhe <span className="gradient-text">R$ 15</span> por indicação
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Seus amigos ganham <strong className="text-blue-400">20% de desconto</strong> na primeira compra e
                  você recebe <strong className="text-green-400">R$ 15 em créditos</strong> quando eles se tornarem
                  clientes ativos.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Sem limite de indicações</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Pagamento automático</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Bônus por nível</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Share Card */}
              <Card className="glass border-white/10 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-blue-400" />
                    Seu Link de Indicação
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 glass rounded-lg">
                      <code className="flex-1 text-sm font-mono text-blue-300 break-all">{referralLink}</code>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={copyReferralLink}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar Link
                      </Button>
                      <Button
                        onClick={shareReferralLink}
                        variant="outline"
                        className="glass glass-hover border-white/20 bg-transparent"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Level Progress */}
              <Card className="glass border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getLevelIcon(stats.currentLevel)}
                      <span className="font-semibold">Nível {stats.currentLevel}</span>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {stats.totalReferrals}/{stats.nextRewardAt} indicações
                    </Badge>
                  </div>

                  <Progress value={(stats.totalReferrals / stats.nextRewardAt) * 100} className="h-3 mb-2" />

                  <p className="text-sm text-gray-400">
                    {stats.nextRewardAt - stats.totalReferrals} indicações para o nível {stats.nextLevel}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="glass border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-green-400" />
              <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl lg:text-3xl font-bold">{stats.totalReferrals}</p>
            <p className="text-sm text-gray-400">Total de Indicações</p>
          </CardContent>
        </Card>

        <Card className="glass border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-8 h-8 text-blue-400" />
              <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl lg:text-3xl font-bold">{stats.activeReferrals}</p>
            <p className="text-sm text-gray-400">Indicações Ativas</p>
          </CardContent>
        </Card>

        <Card className="glass border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-purple-400" />
              <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-green-400">
              R$ {stats.totalEarned.toFixed(2).replace(".", ",")}
            </p>
            <p className="text-sm text-gray-400">Total Ganho</p>
          </CardContent>
        </Card>

        <Card className="glass border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-2">
              <Gift className="w-8 h-8 text-yellow-400" />
              <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-yellow-400">
              R$ {stats.pendingReward.toFixed(2).replace(".", ",")}
            </p>
            <p className="text-sm text-gray-400">Pendente</p>
          </CardContent>
        </Card>
      </div>

      {/* How it Works & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* How it Works */}
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
              <Sparkles className="w-6 h-6 text-purple-400" />
              Como Funciona
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Compartilhe seu link</h4>
                  <p className="text-sm text-gray-400">Envie seu link personalizado para amigos e conhecidos</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Eles se cadastram</h4>
                  <p className="text-sm text-gray-400">Seus amigos ganham 20% de desconto na primeira compra</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Você ganha R$ 15</h4>
                  <p className="text-sm text-gray-400">Receba créditos automaticamente quando eles comprarem</p>
                </div>
              </div>
            </div>

            <div className="p-4 glass rounded-lg border border-green-500/20 bg-green-500/5">
              <p className="text-sm text-green-300 font-medium">
                💡 Dica: Quanto mais você indica, maior seu nível e maiores as recompensas!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
              <Users className="w-6 h-6 text-blue-400" />
              Indicações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReferrals.map((referral, index) => (
                <div key={index} className="flex items-center justify-between p-4 glass rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {referral.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{referral.name}</p>
                      <p className="text-sm text-gray-400">{referral.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">+R$ {referral.reward.toFixed(2).replace(".", ",")}</p>
                    <Badge
                      className={
                        referral.status === "active"
                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                      }
                    >
                      {referral.status === "active" ? "Pago" : "Pendente"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4 glass glass-hover border-white/20 bg-transparent">
              Ver Todas as Indicações
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Levels & Rewards */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
            <Crown className="w-6 h-6 text-yellow-400" />
            Níveis e Recompensas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 glass rounded-xl border border-orange-500/20 bg-orange-500/5">
              <Trophy className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Bronze</h3>
              <p className="text-gray-400 mb-4">0-14 indicações</p>
              <div className="space-y-2 text-sm">
                <p>• R$ 15 por indicação</p>
                <p>• Suporte prioritário</p>
              </div>
            </div>

            <div className="text-center p-6 glass rounded-xl border border-gray-300/20 bg-gray-300/5">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Silver</h3>
              <p className="text-gray-400 mb-4">15-49 indicações</p>
              <div className="space-y-2 text-sm">
                <p>• R$ 20 por indicação</p>
                <p>• Bônus de R$ 100</p>
                <p>• Acesso antecipado</p>
              </div>
            </div>

            <div className="text-center p-6 glass rounded-xl border border-yellow-400/20 bg-yellow-400/5">
              <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Gold</h3>
              <p className="text-gray-400 mb-4">50+ indicações</p>
              <div className="space-y-2 text-sm">
                <p>• R$ 25 por indicação</p>
                <p>• Bônus de R$ 500</p>
                <p>• Conta premium vitalícia</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
