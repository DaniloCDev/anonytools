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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const availableCountries = [
  { code: "ad", name: "Andorra", flag: "🇦🇩" },
  { code: "ae", name: "Emirados Árabes Unidos", flag: "🇦🇪" },
  { code: "af", name: "Afeganistão", flag: "🇦🇫" },
  { code: "ag", name: "Antígua e Barbuda", flag: "🇦🇬" },
  { code: "ai", name: "Anguilla", flag: "🇦🇮" },
  { code: "al", name: "Albânia", flag: "🇦🇱" },
  { code: "am", name: "Armênia", flag: "🇦🇲" },
  { code: "ao", name: "Angola", flag: "🇦🇴" },
  { code: "ar", name: "Argentina", flag: "🇦🇷" },
  { code: "as", name: "Samoa Americana", flag: "🇦🇸" },
  { code: "at", name: "Áustria", flag: "🇦🇹" },
  { code: "au", name: "Austrália", flag: "🇦🇺" },
  { code: "aw", name: "Aruba", flag: "🇦🇼" },
  { code: "az", name: "Azerbaijão", flag: "🇦🇿" },
  { code: "ba", name: "Bósnia e Herzegovina", flag: "🇧🇦" },
  { code: "bb", name: "Barbados", flag: "🇧🇧" },
  { code: "bd", name: "Bangladesh", flag: "🇧🇩" },
  { code: "be", name: "Bélgica", flag: "🇧🇪" },
  { code: "bf", name: "Burquina Faso", flag: "🇧🇫" },
  { code: "bg", name: "Bulgária", flag: "🇧🇬" },
  { code: "bh", name: "Bahrein", flag: "🇧🇭" },
  { code: "bi", name: "Burundi", flag: "🇧🇮" },
  { code: "bj", name: "Benim", flag: "🇧🇯" },
  { code: "bm", name: "Bermudas", flag: "🇧🇲" },
  { code: "bn", name: "Brunei", flag: "🇧🇳" },
  { code: "bo", name: "Bolívia", flag: "🇧🇴" },
  { code: "bq", name: "Caribe Neerlandês", flag: "🇧🇶" },
  { code: "br", name: "Brasil", flag: "🇧🇷" },
  { code: "bs", name: "Bahamas", flag: "🇧🇸" },
  { code: "bt", name: "Butão", flag: "🇧🇹" },
  { code: "bw", name: "Botsuana", flag: "🇧🇼" },
  { code: "by", name: "Bielorrússia", flag: "🇧🇾" },
  { code: "bz", name: "Belize", flag: "🇧🇿" },
  { code: "ca", name: "Canadá", flag: "🇨🇦" },
  { code: "cd", name: "República Democrática do Congo", flag: "🇨🇩" },
  { code: "cg", name: "República do Congo", flag: "🇨🇬" },
  { code: "ch", name: "Suíça", flag: "🇨🇭" },
  { code: "ci", name: "Costa do Marfim", flag: "🇨🇮" },
  { code: "ck", name: "Ilhas Cook", flag: "🇨🇰" },
  { code: "cl", name: "Chile", flag: "🇨🇱" },
  { code: "cm", name: "Camarões", flag: "🇨🇲" },
  { code: "cn", name: "China", flag: "🇨🇳" },
  { code: "co", name: "Colômbia", flag: "🇨🇴" },
  { code: "cr", name: "Costa Rica", flag: "🇨🇷" },
  { code: "cu", name: "Cuba", flag: "🇨🇺" },
  { code: "cv", name: "Cabo Verde", flag: "🇨🇻" },
  { code: "cw", name: "Curaçao", flag: "🇨🇼" },
  { code: "cy", name: "Chipre", flag: "🇨🇾" },
  { code: "cz", name: "República Tcheca", flag: "🇨🇿" },
  { code: "de", name: "Alemanha", flag: "🇩🇪" },
  { code: "dj", name: "Djibuti", flag: "🇩🇯" },
  { code: "dk", name: "Dinamarca", flag: "🇩🇰" },
  { code: "dm", name: "Dominica", flag: "🇩🇲" },
  { code: "do", name: "República Dominicana", flag: "🇩🇴" },
  { code: "dz", name: "Argélia", flag: "🇩🇿" },
  { code: "ec", name: "Equador", flag: "🇪🇨" },
  { code: "ee", name: "Estônia", flag: "🇪🇪" },
  { code: "eg", name: "Egito", flag: "🇪🇬" },
  { code: "es", name: "Espanha", flag: "🇪🇸" },
  { code: "et", name: "Etiópia", flag: "🇪🇹" },
  { code: "fi", name: "Finlândia", flag: "🇫🇮" },
  { code: "fj", name: "Fiji", flag: "🇫🇯" },
  { code: "fo", name: "Ilhas Faroé", flag: "🇫🇴" },
  { code: "fr", name: "França", flag: "🇫🇷" },
  { code: "ga", name: "Gabão", flag: "🇬🇦" },
  { code: "gb", name: "Reino Unido", flag: "🇬🇧" },
  { code: "gd", name: "Granada", flag: "🇬🇩" },
  { code: "ge", name: "Geórgia", flag: "🇬🇪" },
  { code: "gf", name: "Guiana Francesa", flag: "🇬🇫" },
  { code: "gg", name: "Guernsey", flag: "🇬🇬" },
  { code: "gh", name: "Gana", flag: "🇬🇭" },
  { code: "gi", name: "Gibraltar", flag: "🇬🇮" },
  { code: "gl", name: "Groenlândia", flag: "🇬🇱" },
  { code: "gm", name: "Gâmbia", flag: "🇬🇲" },
  { code: "gn", name: "Guiné", flag: "🇬🇳" },
  { code: "gp", name: "Guadalupe", flag: "🇬🇵" },
  { code: "gq", name: "Guiné Equatorial", flag: "🇬🇶" },
  { code: "gr", name: "Grécia", flag: "🇬🇷" },
  { code: "gt", name: "Guatemala", flag: "🇬🇹" },
  { code: "gu", name: "Guam", flag: "🇬🇺" },
  { code: "gw", name: "Guiné-Bissau", flag: "🇬🇼" },
  { code: "gy", name: "Guiana", flag: "🇬🇾" },
  { code: "hk", name: "Hong Kong", flag: "🇭🇰" },
  { code: "hn", name: "Honduras", flag: "🇭🇳" },
  { code: "hr", name: "Croácia", flag: "🇭🇷" },
  { code: "ht", name: "Haiti", flag: "🇭🇹" },
  { code: "hu", name: "Hungria", flag: "🇭🇺" },
  { code: "id", name: "Indonésia", flag: "🇮🇩" },
  { code: "ie", name: "Irlanda", flag: "🇮🇪" },
  { code: "il", name: "Israel", flag: "🇮🇱" },
  { code: "im", name: "Ilha de Man", flag: "🇮🇲" },
  { code: "in", name: "Índia", flag: "🇮🇳" },
  { code: "iq", name: "Iraque", flag: "🇮🇶" },
  { code: "ir", name: "Irã", flag: "🇮🇷" },
  { code: "is", name: "Islândia", flag: "🇮🇸" },
  { code: "it", name: "Itália", flag: "🇮🇹" },
  { code: "je", name: "Jersey", flag: "🇯🇪" },
  { code: "jm", name: "Jamaica", flag: "🇯🇲" },
  { code: "jo", name: "Jordânia", flag: "🇯🇴" },
  { code: "jp", name: "Japão", flag: "🇯🇵" },
  { code: "ke", name: "Quênia", flag: "🇰🇪" },
  { code: "kg", name: "Quirguistão", flag: "🇰🇬" },
  { code: "kh", name: "Camboja", flag: "🇰🇭" },
  { code: "ki", name: "Kiribati", flag: "🇰🇮" },
  { code: "km", name: "Comores", flag: "🇰🇲" },
  { code: "kn", name: "São Cristóvão e Névis", flag: "🇰🇳" },
  { code: "kp", name: "Coreia do Norte", flag: "🇰🇵" },
  { code: "kr", name: "Coreia do Sul", flag: "🇰🇷" },
  { code: "kw", name: "Kuwait", flag: "🇰🇼" },
  { code: "ky", name: "Ilhas Cayman", flag: "🇰🇾" },
  { code: "kz", name: "Cazaquistão", flag: "🇰🇿" },
  { code: "la", name: "Laos", flag: "🇱🇦" },
  { code: "lb", name: "Líbano", flag: "🇱🇧" },
  { code: "lc", name: "Santa Lúcia", flag: "🇱🇨" },
  { code: "li", name: "Liechtenstein", flag: "🇱🇮" },
  { code: "lk", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "lr", name: "Libéria", flag: "🇱🇷" },
  { code: "ls", name: "Lesoto", flag: "🇱🇸" },
  { code: "lt", name: "Lituânia", flag: "🇱🇹" },
  { code: "lu", name: "Luxemburgo", flag: "🇱🇺" },
  { code: "lv", name: "Letônia", flag: "🇱🇻" },
  { code: "ly", name: "Líbia", flag: "🇱🇾" },
  { code: "ma", name: "Marrocos", flag: "🇲🇦" },
  { code: "mc", name: "Mônaco", flag: "🇲🇨" },
  { code: "md", name: "Moldávia", flag: "🇲🇩" },
  { code: "me", name: "Montenegro", flag: "🇲🇪" },
  { code: "mf", name: "São Martinho", flag: "🇲🇫" },
  { code: "mg", name: "Madagáscar", flag: "🇲🇬" },
  { code: "mk", name: "Macedônia do Norte", flag: "🇲🇰" },
  { code: "ml", name: "Mali", flag: "🇲🇱" },
  { code: "mm", name: "Mianmar (Birmânia)", flag: "🇲🇲" },
  { code: "mn", name: "Mongólia", flag: "🇲🇳" },
  { code: "mo", name: "Macau", flag: "🇲🇴" },
  { code: "mp", name: "Ilhas Marianas do Norte", flag: "🇲🇵" },
  { code: "mq", name: "Martinica", flag: "🇲🇶" },
  { code: "mr", name: "Mauritânia", flag: "🇲🇷" },
  { code: "ms", name: "Montserrat", flag: "🇲🇸" },
  { code: "mt", name: "Malta", flag: "🇲🇹" },
  { code: "mu", name: "Maurício", flag: "🇲🇺" },
  { code: "mv", name: "Maldivas", flag: "🇲🇻" },
  { code: "mw", name: "Malawi", flag: "🇲🇼" },
  { code: "mx", name: "México", flag: "🇲🇽" },
  { code: "my", name: "Malásia", flag: "🇲🇾" },
  { code: "mz", name: "Moçambique", flag: "🇲🇿" },
  { code: "na", name: "Namíbia", flag: "🇳🇦" },
  { code: "nc", name: "Nova Caledônia", flag: "🇳🇨" },
  { code: "ne", name: "Níger", flag: "🇳🇪" },
  { code: "ng", name: "Nigéria", flag: "🇳🇬" },
  { code: "ni", name: "Nicarágua", flag: "🇳🇮" },
  { code: "nl", name: "Países Baixos", flag: "🇳🇱" },
  { code: "no", name: "Noruega", flag: "🇳🇴" },
  { code: "np", name: "Nepal", flag: "🇳🇵" },
  { code: "nr", name: "Nauru", flag: "🇳🇷" },
  { code: "nz", name: "Nova Zelândia", flag: "🇳🇿" },
  { code: "om", name: "Omã", flag: "🇴🇲" },
  { code: "pa", name: "Panamá", flag: "🇵🇦" },
  { code: "pe", name: "Peru", flag: "🇵🇪" },
  { code: "pf", name: "Polinésia Francesa", flag: "🇵🇫" },
  { code: "pg", name: "Papua Nova Guiné", flag: "🇵🇬" },
  { code: "ph", name: "Filipinas", flag: "🇵🇭" },
  { code: "pk", name: "Paquistão", flag: "🇵🇰" },
  { code: "pl", name: "Polônia", flag: "🇵🇱" },
  { code: "pm", name: "São Pedro e Miquelão", flag: "🇵🇲" },
  { code: "pr", name: "Porto Rico", flag: "🇵🇷" },
  { code: "ps", name: "Palestina", flag: "🇵🇸" },
  { code: "pt", name: "Portugal", flag: "🇵🇹" },
  { code: "py", name: "Paraguai", flag: "🇵🇾" },
  { code: "qa", name: "Catar", flag: "🇶🇦" },
  { code: "re", name: "Reunião", flag: "🇷🇪" },
  { code: "ro", name: "Romênia", flag: "🇷🇴" },
  { code: "rs", name: "Sérvia", flag: "🇷🇸" },
  { code: "ru", name: "Rússia", flag: "🇷🇺" },
  { code: "rw", name: "Ruanda", flag: "🇷🇼" },
  { code: "sa", name: "Arábia Saudita", flag: "🇸🇦" },
  { code: "sb", name: "Ilhas Salomão", flag: "🇸🇧" },
  { code: "sc", name: "Seicheles", flag: "🇸🇨" },
  { code: "sd", name: "Sudão", flag: "🇸🇩" },
  { code: "se", name: "Suécia", flag: "🇸🇪" },
  { code: "sg", name: "Singapura", flag: "🇸🇬" },
  { code: "si", name: "Eslovênia", flag: "🇸🇮" },
  { code: "sk", name: "Eslováquia", flag: "🇸🇰" },
  { code: "sl", name: "Serra Leoa", flag: "🇸🇱" },
  { code: "sm", name: "San Marino", flag: "🇸🇲" },
  { code: "sn", name: "Senegal", flag: "🇸🇳" },
  { code: "so", name: "Somália", flag: "🇸🇴" },
  { code: "sr", name: "Suriname", flag: "🇸🇷" },
  { code: "ss", name: "Sudão do Sul", flag: "🇸🇸" },
  { code: "st", name: "São Tomé e Príncipe", flag: "🇸🇹" },
  { code: "sv", name: "El Salvador", flag: "🇸🇻" },
  { code: "sx", name: "Sint Maarten", flag: "🇸🇽" },
  { code: "sy", name: "Síria", flag: "🇸🇾" },
  { code: "sz", name: "Essuatíni", flag: "🇸🇿" },
  { code: "tc", name: "Ilhas Turks e Caicos", flag: "🇹🇨" },
  { code: "td", name: "Chade", flag: "🇹🇩" },
  { code: "tg", name: "Togo", flag: "🇹🇬" },
  { code: "th", name: "Tailândia", flag: "🇹🇭" },
  { code: "tj", name: "Tajiquistão", flag: "🇹🇯" },
  { code: "tl", name: "Timor-Leste", flag: "🇹🇱" },
  { code: "tn", name: "Tunísia", flag: "🇹🇳" },
  { code: "to", name: "Tonga", flag: "🇹🇴" },
  { code: "tr", name: "Turquia", flag: "🇹🇷" },
  { code: "tt", name: "Trinidad e Tobago", flag: "🇹🇹" },
  { code: "tw", name: "Taiwan", flag: "🇹🇼" },
  { code: "tz", name: "Tanzânia", flag: "🇹🇿" },
  { code: "ua", name: "Ucrânia", flag: "🇺🇦" },
  { code: "ug", name: "Uganda", flag: "🇺🇬" },
  { code: "us", name: "Estados Unidos", flag: "🇺🇸" },
  { code: "uy", name: "Uruguai", flag: "🇺🇾" },
  { code: "uz", name: "Uzbequistão", flag: "🇺🇿" },
  { code: "vc", name: "São Vicente e Granadinas", flag: "🇻🇨" },
  { code: "ve", name: "Venezuela", flag: "🇻🇪" },
  { code: "vg", name: "Ilhas Virgens Britânicas", flag: "🇻🇬" },
  { code: "vi", name: "Ilhas Virgens Americanas", flag: "🇻🇮" },
  { code: "vn", name: "Vietnã", flag: "🇻🇳" },
  { code: "vu", name: "Vanuatu", flag: "🇻🇺" },
  { code: "xk", name: "Kosovo", flag: "🇽🇰" },
  { code: "ye", name: "Iémen", flag: "🇾🇪" },
  { code: "za", name: "África do Sul", flag: "🇿🇦" },
  { code: "zm", name: "Zâmbia", flag: "🇿🇲" },
  { code: "zw", name: "Zimbábue", flag: "🇿🇼" },
];


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
        threads: user.plan.threads,
      }));
    }
  }, [user?.plan.threads, user?.plan.credentials, loading]);


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
    selectedCountry: "br", // valor padrão
  });


  const [showPassword, setShowPassword] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)


  const selectedCountryData = availableCountries.find((c) => c.code === proxyConfig.selectedCountry)

  const generateNewPassword = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/user/resetProxyPassword", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Erro ao gerar nova senha");

      const data = await response.json();
      // console.log(data)

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

  const handleCountryChange = (countryCode: string) => {
    setProxyConfig((prev) => ({ ...prev, selectedCountry: countryCode }))
    const country = availableCountries.find((c) => c.code === countryCode)
    addToast({
      type: "success",
      title: "País alterado!",
      message: `${country?.flag} ${country?.name}`,
      duration: 2000,
    })
  }

  // console.log(proxyConfig)
  //     console.log(proxyConfig.threads)
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
          {/* País */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="w-5 h-5" />
                Selecionar País
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label className="text-sm">País do Proxy</Label>
                <Select value={proxyConfig.selectedCountry} onValueChange={handleCountryChange}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{selectedCountryData?.flag}</span>
                        <span>{selectedCountryData?.name}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 border-white/10">
                    {availableCountries.map((country) => (
                      <SelectItem key={country.code} value={country.code} className="cursor-pointer hover:bg-white/10">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{country.flag}</span>
                          <span>{country.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

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
                  <p className="text-gray-400">Para uso geral, mantenha entre 300-400 threads</p>
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
