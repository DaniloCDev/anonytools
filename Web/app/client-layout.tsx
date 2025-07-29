// ✅ app/client-layout.tsx
"use client"

import type React from "react"
import { Navbar } from "@/components/navbar"
import { ToastProvider } from "@/components/toast-provider"
import { usePathname } from "next/navigation"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard")

  return (
    
    <ToastProvider>
      {/* Navbar apenas fora do dashboard */}
      {!isDashboard && <Navbar />}
      
      {/* Main content com padding-top apenas quando navbar está presente */}
      <main className={isDashboard ? "" : "pt-16"}>
        {children}
      </main>
    </ToastProvider>
  )
}
