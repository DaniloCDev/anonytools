import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: " Admin - Sistema de Gestão",
  //description: "Sistema administrativo para gerenciamento de proxy e usuários",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <meta name="robots" content="noindex, nofollow"></meta>
      <body className={`${inter.className} dark bg-slate-900 text-slate-50`}>{children}</body>
    </html>
  )
}
