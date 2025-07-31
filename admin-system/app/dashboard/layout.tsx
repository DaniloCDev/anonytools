"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  BarChart3,
  Users,
  Settings,
  LogOut,
  Shield,
  Activity,
  FileText,
  Download,
  Ticket,
  ShoppingCart,
} from "lucide-react"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Usuários",
    url: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Compras",
    url: "/dashboard/purchases",
    icon: ShoppingCart,
  },
  {
    title: "Cupons",
    url: "/dashboard/coupons",
    icon: Ticket,
  },
  {
    title: "Logs",
    url: "/dashboard/logs",
    icon: Activity,
  },
  {
    title: "Relatórios",
    url: "/dashboard/reports",
    icon: FileText,
  },
  {
    title: "Configurações",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

function AppSidebar() {
  const router = useRouter()

  const handleLogout = async () => {

    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    //clearAllCookies()
    window.location.href = "/";
  };

  return (
    <Sidebar className="border-r border-slate-700 bg-slate-800">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-white">Proxy Admin</h2>
            <p className="text-xs text-slate-400">Sistema de Gestão</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-700"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-700">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-purple-600 text-white text-xs">AD</AvatarFallback>
                  </Avatar>
                  <span>Administrador</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width] bg-slate-800 border-slate-700">
                <DropdownMenuLabel className="text-slate-200">Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check", {
          credentials: "include",
        })

        if (res.ok) {
       //   router.push("/dashboard")
          setIsAuthenticated(true)
        } else {
          router.push("/login")
        }
      } catch {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Verificando autenticação...</div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-slate-900 flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="border-b border-slate-700 bg-slate-800">
            <div className="flex items-center gap-4 px-6 py-4">
              <SidebarTrigger className="text-slate-400 hover:text-white" />
              <div className="flex-1" />
            </div>
          </header>
          <div className="flex-1 p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}
