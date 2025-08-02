"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Zap } from "lucide-react"
import { AuthModal } from "@/components/auth-modal"
import { useToast } from "@/components/toast-provider"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { addToast } = useToast()
  const handleLogin = () => {
    window.location.href = "/dashboard"
  }
  const handleAccountClick = async () => {
    try {
      const res = await fetch("/api/auth/check", {
        credentials: "include",
      })

      if (res.ok) {
        window.location.href = "/dashboard"
      } else {
        setShowAuthModal(true)
      }
    } catch (err) {
      addToast({
        type: "error",
        title: "Erro de conexão",
        message: "Não foi possível verificar sua sessão.",
        duration: 4000,
      })
      setShowAuthModal(true)
    }
  }

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-black to-gray-800 rounded-lg flex items-center justify-center">
              <img
                src="/logo_nox24proxy.svg"
                alt="Logo"
                className="w-20 h-20"
              />

            </div>
            <span className="text-xl font-bold gradient-text">Nox24Proxy</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-blue-400 transition-colors">
              Início
            </Link>
            {/* Desktop Menu */}
            <Link href="/precos" className="hover:text-blue-400 transition-colors">
              Preços
            </Link> 
            <button onClick={handleAccountClick} className="hover:text-blue-400 transition-colors">
              Minha Conta
            </button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden glass border-t border-white/10 mt-2 rounded-lg p-4 absolute top-14 left-4 right-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="hover:text-blue-400 transition-colors">
                Início
              </Link>
              <Link href="/precos" className="hover:text-blue-400 transition-colors">
                Preços
              </Link>
               
              <button onClick={handleAccountClick} className="hover:text-blue-400 transition-colors text-left">
                Minha Conta
              </button>
            </div>
          </div>
        )}
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLoginSuccess={handleLogin} />
    </nav>
  )
}
