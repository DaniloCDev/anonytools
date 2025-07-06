import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Globe, Users, ArrowRight, CheckCircle } from "lucide-react"

export default function Home() {
  return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30">
              🚀 Novidade: Proxies com 99.9% de uptime
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Tenha acesso aos <span className="gradient-text">melhores proxies</span> do Brasil
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              IPs residenciais rotativos com cobertura nacional. Velocidade premium, suporte 24/7 e configuração em
              segundos.
            </p>

            <div className="flex justify-center mb-12">
              <Link href="/produtos">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 glow text-lg px-8 py-4"
                >
                  Ver Pacotes
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Setup em 30 segundos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Suporte 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Por que escolher a <span className="gradient-text">ProxyBR</span>?
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Tecnologia de ponta para suas necessidades de proxy
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="glass glass-hover border-white/10 p-6">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">100% Seguro</h3>
                  <p className="text-gray-400">Criptografia de ponta e IPs residenciais verificados</p>
                </CardContent>
              </Card>

              <Card className="glass glass-hover border-white/10 p-6">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ultra Rápido</h3>
                  <p className="text-gray-400">Velocidades de até 1Gbps com latência mínima</p>
                </CardContent>
              </Card>

              <Card className="glass glass-hover border-white/10 p-6">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Cobertura Nacional</h3>
                  <p className="text-gray-400">IPs de todas as regiões do Brasil</p>
                </CardContent>
              </Card>

              <Card className="glass glass-hover border-white/10 p-6">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Suporte Premium</h3>
                  <p className="text-gray-400">Equipe especializada disponível 24/7</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-900/10 to-purple-900/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">10M+</div>
                <div className="text-gray-400">IPs Disponíveis</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">99.9%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">5000+</div>
                <div className="text-gray-400">Clientes Ativos</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">24/7</div>
                <div className="text-gray-400">Suporte</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Pronto para começar?</h2>
            <p className="text-xl text-gray-300 mb-8">Junte-se a milhares de desenvolvedores que confiam na ProxyBR</p>
            <Link href="/produtos">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 glow text-lg px-8 py-4"
              >
                Começar Agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
  )
}
