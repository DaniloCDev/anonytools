import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { CartProvider } from "@/components/cart-provider"
import { ToastProvider } from "@/components/toast-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ProxyBR - Os Melhores Proxies do Brasil",
  description: "Proxies residenciais brasileiros de alta qualidade com IP rotativo. Acesso ilimitado e suporte 24/7.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <ToastProvider>
          <CartProvider>
            <Navbar />
            <main className="pt-16">{children}</main>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
