"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Menu, X, Zap } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { AuthModal } from "@/components/auth-modal"


export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { items } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3001/auth/check", {
        credentials: "include",
      })
      setIsLoggedIn(res.ok)
    } catch {
      setIsLoggedIn(false)
    }
  }

  const handleAccountClick = async () => {
    try {
      const res = await fetch("http://localhost:3001/auth/check", {
        credentials: "include",
      })
      if (res.ok) {
        setIsLoggedIn(true)
        window.location.href = "/dashboard"
      } else {
        setIsLoggedIn(false)
        setShowAuthModal(true)
      }
    } catch {
      setIsLoggedIn(false)
      setShowAuthModal(true)
    }
  }

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">ProxyBR</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-blue-400 transition-colors">
              Início
            </Link>
            {/* in development
            <Link href="/produtos" className="hover:text-blue-400 transition-colors">
              Meus Produtos
            </Link>
            <button onClick={handleBuyClick} className="hover:text-blue-400 transition-colors">
              Comprar
            </button>
            */}
            <button onClick={handleAccountClick} className="hover:text-blue-400 transition-colors">
              Minha Conta
            </button>
            {/* in development
            <Link href="/checkout" className="relative">
              <Button variant="ghost" size="icon" className="glass-hover">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs">{itemCount}</Badge>
                )}
              </Button>
            </Link>
                        */}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden glass border-t border-white/10 mt-2 rounded-lg p-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="hover:text-blue-400 transition-colors">
                Início
              </Link>
              {/* in development
              <Link href="/produtos" className="hover:text-blue-400 transition-colors">
                Meus Produtos
              </Link>
              <button onClick={handleBuyClick} className="hover:text-blue-400 transition-colors">
                Comprar
              </button>
                          */}
              <button onClick={handleAccountClick} className="hover:text-blue-400 transition-colors">
                Minha Conta
              </button>
              {/* in development
            <Link href="/checkout" className="relative">
              <Button variant="ghost" size="icon" className="glass-hover">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs">{itemCount}</Badge>
                )}
              </Button>
            </Link>
                        */}
            </div>
          </div>
        )}
      </div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />

    </nav>
  )
}
