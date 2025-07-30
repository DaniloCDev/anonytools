import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema Interno - Acesso Restrito",
  description: "Sistema administrativo interno - Acesso restrito",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
  other: {
    "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex, nocache",
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        {/* Meta tags para bloquear indexação */}
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex, nocache" />
        <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex, nocache" />
        <meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet, noimageindex, nocache" />
        <meta name="slurp" content="noindex, nofollow, noarchive, nosnippet, noimageindex, nocache" />
        <meta name="duckduckbot" content="noindex, nofollow, noarchive, nosnippet, noimageindex, nocache" />

        {/* Headers de segurança */}
        <meta httpEquiv="X-Robots-Tag" content="noindex, nofollow, noarchive, nosnippet, noimageindex, nocache" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate, private" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />

        {/* Prevenir cache */}
        <meta name="cache-control" content="no-cache, no-store, must-revalidate, private" />
        <meta name="pragma" content="no-cache" />
        <meta name="expires" content="0" />

        {/* Bloquear ferramentas de SEO */}
        <meta name="pinterest" content="nopin" />
        <meta name="format-detection" content="telephone=no" />

        {/* Prevenir que apareça em resultados de busca */}
        <meta name="referrer" content="no-referrer" />
        <meta name="author" content="" />
        <meta name="generator" content="" />

        {/* Canonical para evitar duplicação */}
        <link rel="canonical" href="#" />

        {/* Prevenir pré-carregamento */}
        <meta httpEquiv="x-dns-prefetch-control" content="off" />
      </head>
      <body className={`${inter.className} dark bg-slate-900 text-slate-50`}>{children}</body>
    </html>
  )
}
