"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Globe,
  Settings,
  HelpCircle,
  LogOut,
  User,
  ChevronUp,
  Zap,
  ChevronRight,
  BarChart3,
  ShoppingCart,
  Shield,
} from "lucide-react"
import { useUser } from "@/contexts/UserContext"

const menuItems = [
  {
    title: "Proxys",
    icon: Globe,
    key: "proxys",
    subItems: [
      {
        title: "Dashboard",
        icon: Shield,
        key: "proxys",
      },
      //   {
      //   title: "Gerenciamento",
      // icon: BarChart3,
      //key: "gerenciamento",
      //},
      {
        title: "Compras",
        icon: ShoppingCart,
        key: "compras",
      },
    ],
  },
  {
    title: "Configurações",
    icon: Settings,
    key: "configurações",
  },
  {
    title: "Suporte",
    icon: HelpCircle,
    key: "suporte",
  },
]

interface DashboardSidebarProps {
  onMenuClick: (item: string) => void
  activeMenu: string
  className?: string
}


export function DashboardSidebar({ onMenuClick, activeMenu, className = "" }: DashboardSidebarProps) {
  const handleLogout = async () => {

    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    //clearAllCookies()
    window.location.href = "/";
  };
  const { user, loading } = useUser()

  return (
    <div
      className={`bg-gradient-to-b from-gray-900/50 to-black/50 border-r border-white/10 flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-gray-900/90 to-black/90 p-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-r from-black to-gray-800 rounded-lg flex items-center justify-center">
            <img
              src="/logo_nox24proxy.svg"
              alt="Logo"
              className="w-20 h-20"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold gradient-text">Nox24Proxy</span>
            <span className="text-xs text-gray-400 font-medium">Dashboard Nox24</span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-300 px-4 py-2 uppercase tracking-wide">Menu Principal</h3>
        </div>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.subItems ? (
                <Collapsible defaultOpen className="group/collapsible">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => onMenuClick(item.key)}
                      className="w-full justify-start px-6 py-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:border hover:border-blue-500/20 transition-all duration-300 text-base font-medium"
                    >
                      <item.icon className="w-6 h-6 text-blue-400 mr-3" />
                      <span className="flex-1 text-left">{item.title}</span>
                      <ChevronRight className="w-5 h-5 text-gray-400 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="ml-4 border-l border-gray-700/50 pl-4 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Button
                          key={subItem.key}
                          variant="ghost"
                          onClick={() => onMenuClick(subItem.key)}
                          className={`w-full justify-start px-8 py-3 rounded-lg text-base hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 transition-all duration-200 ${activeMenu === subItem.key
                            ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 shadow-lg shadow-blue-500/10 text-blue-300"
                            : ""
                            }`}
                        >
                          <subItem.icon className="w-5 h-5 text-gray-300 mr-3" />
                          <span>{subItem.title}</span>
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => onMenuClick(item.key || item.title.toLowerCase())}
                  className={`w-full justify-start px-6 py-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:border hover:border-blue-500/20 transition-all duration-300 text-base font-medium ${activeMenu === (item.key || item.title.toLowerCase())
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 shadow-lg shadow-blue-500/10 text-blue-300"
                    : ""
                    }`}
                >
                  <item.icon className="w-6 h-6 text-blue-400 mr-3" />
                  <span>{item.title}</span>
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Quick Stats 
        <div className="mt-8">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4 backdrop-blur-sm">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Status do Sistema</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Uptime</span>
                <span className="text-xs font-medium text-green-400">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Conexões</span>
                <span className="text-xs font-medium text-blue-400">47 hoje</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
        */}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 bg-gradient-to-r from-gray-900/90 to-black/90 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start px-6 py-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 transition-all duration-300"
            >
              <Avatar className="w-10 h-10 ring-2 ring-blue-500/30 mr-3">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs lg:text-sm font-medium">
                  {(user?.name || "JD")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col items-start text-left flex-1">
                <span className="text-sm font-medium text-white">
                  {loading ? "Carregando..." : user?.name || "Usuário"}
                </span>
                <span className="text-xs text-gray-300">
                  {loading ? "..." : user?.email || "email@desconhecido.com"}
                </span>
              </div>
              <ChevronUp className="w-4 h-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" className="w-72 bg-gray-900/95 border-gray-700/50 backdrop-blur-xl">
            <DropdownMenuItem
              onClick={() => onMenuClick("conta")}
              className="cursor-pointer p-4 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 rounded-lg mx-2 my-1"
            >
              <User className="w-5 h-5 text-blue-400 mr-3" />
              <span className="text-base font-medium">Minha Conta</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-400 p-4 hover:bg-red-500/10 rounded-lg mx-2 my-1"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="text-base font-medium">Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
