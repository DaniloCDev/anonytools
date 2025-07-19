import type React from "react"
import ClientLayout from "./client-layout"
import { UserProvider } from "@/contexts/UserContext";
import { PurchaseProvider } from "@/contexts/PurchaseContext";
import './globals.css'

export const metadata = {
  title: "Seu título aqui",
  description: "Sua descrição aqui",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-black text-white">
        <UserProvider>
          <PurchaseProvider>
            <ClientLayout>{children}</ClientLayout>
          </PurchaseProvider>
        </UserProvider>
      </body>
    </html>
  )
}