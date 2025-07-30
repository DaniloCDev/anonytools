"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Home } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  useEffect(() => {
    document.title = "Página não encontrada"

    // Adicionar meta tags para bloquear indexação
    const metaRobots = document.createElement("meta")
    metaRobots.name = "robots"
    metaRobots.content = "noindex, nofollow, noarchive, nosnippet, noimageindex, nocache"
    document.head.appendChild(metaRobots)

    return () => {
      if (document.head.contains(metaRobots)) {
        document.head.removeChild(metaRobots)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">Acesso Negado</CardTitle>
              <CardDescription className="text-slate-400">
                Esta página não existe ou você não tem permissão para acessá-la
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/login">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
