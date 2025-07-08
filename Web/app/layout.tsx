import type React from "react"
import ClientLayout from "./client-layout"
import { UserProvider } from "@/contexts/UserContext";
import { PurchaseProvider } from "@/contexts/PurchaseContext";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      <PurchaseProvider>
        <ClientLayout>{children}</ClientLayout>
      </PurchaseProvider>
    </UserProvider>
  )
}
import './globals.css'
