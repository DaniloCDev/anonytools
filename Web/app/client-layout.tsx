"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { ToastProvider } from "@/components/toast-provider"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard")

  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <ToastProvider>
          {/* Navbar apenas fora do dashboard */}
          {!isDashboard && <Navbar />}
          {/* Main content com padding-top apenas quando navbar está presente */}
          <main className={isDashboard ? "" : "pt-16"}>{children}</main>
        </ToastProvider>
      </body>
    </html>
  )
}
