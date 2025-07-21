"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/toast-provider"
import {
  RefreshCw,
  Zap,
  Shield,
  Globe,
  Activity,
  Copy,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Gauge,
  Network,
  Lock,
  Server,
} from "lucide-react"
import { useUser } from "@/contexts/UserContext";

export function ProxySettings() {
  const { addToast } = useToast()

  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user) {
      setProxyConfig((prev) => ({
        ...prev,
        host: user.plan.credentials.host,
        port: user.plan.credentials.port,
        username: user.plan.credentials.username,
        password: user.plan.credentials.password,
      }));
    }
  }, [user, loading]);

  const [proxyConfig, setProxyConfig] = useState({
    host: "",
    port: "",
    username: "",
    password: "",
    threads: 150,
    autoRotate: true,
    rotateInterval: 300,
    timeout: 30,
    retries: 3,
    useHttps: true,
    enableLogging: true,
  });

  const [showPassword, setShowPassword] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateNewPassword = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/user/resetProxyPassword", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Erro ao gerar nova senha");

      const data = await response.json();
      console.log(data)

      setProxyConfig((prev) => ({
        ...prev,
        password: data,
      }));

      addToast({
        type: "success",
        title: "Nova senha gerada!",
        message: `Senha atualizada: ${data}`,
        duration: 8000,
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao gerar senha",
        message: "Não foi possível gerar uma nova senha. Tente novamente.",
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
  };


  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    addToast({
      type: "success",
      title: "Copiado!",
      message: `${label} copiado para a área de transferência`,
      duration: 2000,
    })
  }

  const saveSettings = async () => {
    try {
      await fetch("/api/user/updateProxyConfig", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(proxyConfig),
      });

      addToast({
        type: "success",
        title: "Configurações salvas!",
        message: "Suas configurações foram aplicadas com sucesso",
        duration: 3000,
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao salvar",
        message: "Tente novamente",
        duration: 3000,
      });
    }
  };

  const resetToDefaults = () => {
    setProxyConfig((prev) => ({
      ...prev,
      threads: 150,
      autoRotate: true,
      rotateInterval: 300,
      timeout: 30,
      retries: 3,
      useHttps: true,
      enableLogging: true,
    }))

    addToast({
      type: "info",
      title: "Configurações restauradas",
      message: "Valores padrão foram aplicados",
      duration: 3000,
    })
  }

  const getThreadsLabel = (value: number) => {
    if (value <= 100) return "Baixa"
    if (value <= 200) return "Média"
    if (value <= 500) return "Alta"
    if (value <= 1000) return "Muito Alta"
    return "Máxima"
  }

  const getThreadsColor = (value: number) => {
    if (value <= 100) return "bg-green-500/20 text-green-300 border-green-500/30"
    if (value <= 200) return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
    if (value <= 500) return "bg-orange-500/20 text-orange-300 border-orange-500/30"
    return "bg-red-500/20 text-red-300 border-red-500/30"
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold">
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Configurações
          </span>{" "}
          do Proxy
        </h1>
        <p className="text-gray-400 text-lg lg:text-xl">Gerencie as configurações avançadas dos seus proxies</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-8 space-y-6 lg:space-y-8">
          {/* Credenciais do Proxy */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
                <Shield className="w-6 h-6 lg:w-7 lg:h-7 text-blue-400" />
                Credenciais do Proxy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="space-y-3">
                  <Label htmlFor="host" className="flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    Host
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="host"
                      value={proxyConfig.host}
                      onChange={(e) => setProxyConfig((prev) => ({ ...prev, host: e.target.value }))}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 font-mono"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copyToClipboard(proxyConfig.host, "Host")}
                      className="w-10 h-10"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="port" className="flex items-center gap-2">
                    <Network className="w-4 h-4" />
                    Porta
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="port"
                      value={proxyConfig.port}
                      onChange={(e) => setProxyConfig((prev) => ({ ...prev, port: e.target.value }))}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 font-mono"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copyToClipboard(proxyConfig.port, "Porta")}
                      className="w-10 h-10"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Usuário
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="username"
                      value={proxyConfig.username}
                      onChange={(e) => setProxyConfig((prev) => ({ ...prev, username: e.target.value }))}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 font-mono"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copyToClipboard(proxyConfig.username, "Usuário")}
                      className="w-10 h-10"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Senha
                  </Label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={proxyConfig.password}
                        onChange={(e) => setProxyConfig((prev) => ({ ...prev, password: e.target.value }))}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 font-mono pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 w-6 h-6"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copyToClipboard(proxyConfig.password, "Senha")}
                      className="w-10 h-10"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={generateNewPassword}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25"
                >
                  <RefreshCw className={`w-5 h-5 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                  {isGenerating ? "Gerando..." : "Gerar Nova Senha"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    copyToClipboard(
                      `${proxyConfig.host}:${proxyConfig.port}:${proxyConfig.username}:${proxyConfig.password}`,
                      "Credenciais completas",
                    )
                  }
                  className="bg-white/5 backdrop-blur-xl border border-white/20 hover:bg-white/10"
                >
                  <Copy className="w-5 h-5 mr-2" />
                  Copiar Tudo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Performance */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
                <Gauge className="w-6 h-6 lg:w-7 lg:h-7 text-purple-400" />
                Performance e Velocidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Threads Configuration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2 text-base font-semibold">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      Threads de Conexão
                    </Label>
                    <p className="text-sm text-gray-400">
                      Controla quantas conexões simultâneas o proxy pode gerenciar
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getThreadsColor(proxyConfig.threads)}>
                      {getThreadsLabel(proxyConfig.threads)}
                    </Badge>
                    <span className="text-2xl font-bold text-blue-400 min-w-[60px] text-right">
                      {proxyConfig.threads}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Slider
                    value={[proxyConfig.threads]}
                    onValueChange={(value) => setProxyConfig((prev) => ({ ...prev, threads: value[0] }))}
                    max={2000}
                    min={10}
                    step={10}
                    className="w-full"
                  />

                  <div className="flex justify-between text-xs text-gray-400">
                    <span>10 (Mínimo)</span>
                    <span>150 (Padrão)</span>
                    <span>2000 (Máximo)</span>
                  </div>

                </div>

                <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-400">Velocidade</p>
                      <p className="font-semibold text-green-400">{Math.round(proxyConfig.threads * 0.8)} Mbps</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Latência</p>
                      <p className="font-semibold text-blue-400">
                        {Math.max(10, 50 - Math.round(proxyConfig.threads / 10))}ms
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">CPU Usage</p>
                      <p className="font-semibold text-yellow-400">{Math.round(proxyConfig.threads / 3)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Estabilidade</p>
                      <p className="font-semibold text-purple-400">
                        {proxyConfig.threads <= 150 ? "Alta" : proxyConfig.threads <= 200 ? "Média" : "Baixa"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/10" />
            </CardContent>
          </Card>

        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">


          {/* Quick Actions */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-xl">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={saveSettings}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg shadow-green-500/25"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações
              </Button>

              <Button
                onClick={resetToDefaults}
                variant="outline"
                className="w-full bg-white/5 backdrop-blur-xl border border-white/20 hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restaurar Padrões
              </Button>
            </CardContent>
          </Card>

          {/* Performance Tips */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-xl">Dicas de Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="font-medium text-blue-300 mb-1">💡 Threads Ideais</p>
                  <p className="text-gray-400">Para uso geral, mantenha entre 100-150 threads</p>
                </div>

                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="font-medium text-green-300 mb-1">⚡ Velocidade</p>
                  <p className="text-gray-400">Rotação automática melhora o anonimato</p>
                </div>

                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <p className="font-medium text-purple-300 mb-1">🔒 Segurança</p>
                  <p className="text-gray-400">HTTPS garante conexões mais seguras</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
