"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

    useEffect(() => {
    // Limpar título da página
    document.title = "Sistema Interno"

    // Adicionar meta tags adicionais
    const metaRobots = document.createElement("meta")
    metaRobots.name = "robots"
    metaRobots.content = "noindex, nofollow, noarchive, nosnippet, noimageindex, nocache"
    document.head.appendChild(metaRobots)

    const metaDescription = document.createElement("meta")
    metaDescription.name = "description"
    metaDescription.content = "Sistema interno - Acesso restrito"
    document.head.appendChild(metaDescription)

    // Remover meta tags ao sair da página
    return () => {
      document.head.removeChild(metaRobots)
      document.head.removeChild(metaDescription)
    }
  }, [])
  
  useEffect(() => {
    const token = localStorage.getItem("admin-token")
    if (token) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Redirecionando...</div>
    </div>
  )
}
