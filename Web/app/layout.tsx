import type React from "react"
import ClientLayout from "./client-layout"
import { UserProvider } from "@/context/UserContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      <ClientLayout>{children}</ClientLayout>
    </UserProvider>
  )
}

import './globals.css'
