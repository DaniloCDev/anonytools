"use client"

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
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
      //  {
      //  title: "Gerenciamento",
      //icon: BarChart3,
      // key: "gerenciamento",
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

interface AppSidebarProps {
  onMenuClick: (item: string) => void
  activeMenu: string
}

export function AppSidebar({ onMenuClick, activeMenu }: AppSidebarProps) {
  const handleLogout = () => {
    window.location.href = "/"
  }
  const { user, loading } = useUser()


  return (
    <Sidebar collapsible="icon" className="border-r border-white/10 z-40 lg:w-80">
      <SidebarHeader className="border-b border-white/10 bg-black/50 lg:bg-gradient-to-r lg:from-gray-900/90 lg:to-black/90">
        <div className="flex items-center gap-2 px-3 py-3 lg:gap-4 lg:px-8 lg:py-8">
          <div className="w-6 h-6 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg lg:rounded-xl flex items-center justify-center lg:shadow-lg lg:shadow-blue-500/25">
            <Zap className="w-4 h-4 lg:w-7 lg:h-7 text-white" />
          </div>
          <div className="lg:flex lg:flex-col">
            <span className="text-lg lg:text-2xl font-bold gradient-text">ProxyBR</span>
            <span className="hidden lg:block text-xs text-gray-400 font-medium">Dashboard Pro</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-black/30 lg:bg-gradient-to-b lg:from-gray-900/50 lg:to-black/50">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wide px-3 py-1 lg:text-sm lg:px-8 lg:py-4 lg:font-semibold lg:text-gray-300">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent className="lg:px-4">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    <Collapsible defaultOpen className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          onClick={() => onMenuClick(item.key)}
                          className="w-full px-3 py-2 hover:bg-white/10 text-sm lg:mx-2 lg:mb-2 lg:px-6 lg:py-4 lg:rounded-xl lg:hover:bg-gradient-to-r lg:hover:from-blue-500/10 lg:hover:to-purple-500/10 lg:hover:border lg:hover:border-blue-500/20 lg:transition-all lg:duration-300 lg:text-base lg:font-medium"
                        >
                          <item.icon className="w-4 h-4 lg:w-6 lg:h-6 lg:text-blue-400" />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto w-3 h-3 lg:w-5 lg:h-5 transition-transform group-data-[state=open]/collapsible:rotate-90 lg:text-gray-400" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="lg:ml-4 lg:border-l lg:border-gray-700/50">
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.key}>
                              <SidebarMenuSubButton
                                onClick={() => onMenuClick(subItem.key)}
                                isActive={activeMenu === subItem.key}
                                className="px-6 py-1.5 text-sm hover:bg-white/10 data-[active=true]:bg-blue-500/20 data-[active=true]:text-blue-300 lg:mx-2 lg:mb-1 lg:px-8 lg:py-3 lg:rounded-lg lg:text-base lg:hover:bg-gradient-to-r lg:hover:from-gray-800/50 lg:hover:to-gray-700/50 lg:data-[active=true]:bg-gradient-to-r lg:data-[active=true]:from-blue-500/20 lg:data-[active=true]:to-purple-500/20 lg:data-[active=true]:border lg:data-[active=true]:border-blue-500/30 lg:data-[active=true]:shadow-lg lg:data-[active=true]:shadow-blue-500/10 lg:transition-all lg:duration-200"
                              >
                                <subItem.icon className="w-3 h-3 lg:w-5 lg:h-5 lg:text-gray-300" />
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      onClick={() => onMenuClick(item.key || item.title.toLowerCase())}
                      isActive={activeMenu === (item.key || item.title.toLowerCase())}
                      className="w-full px-3 py-2 text-sm hover:bg-white/10 data-[active=true]:bg-blue-500/20 data-[active=true]:text-blue-300 lg:mx-2 lg:mb-2 lg:px-6 lg:py-4 lg:rounded-xl lg:hover:bg-gradient-to-r lg:hover:from-blue-500/10 lg:hover:to-purple-500/10 lg:hover:border lg:hover:border-blue-500/20 lg:data-[active=true]:bg-gradient-to-r lg:data-[active=true]:from-blue-500/20 lg:data-[active=true]:to-purple-500/20 lg:data-[active=true]:border lg:data-[active=true]:border-blue-500/30 lg:data-[active=true]:shadow-lg lg:data-[active=true]:shadow-blue-500/10 lg:transition-all lg:duration-300 lg:text-base lg:font-medium"
                    >
                      <item.icon className="w-4 h-4 lg:w-6 lg:h-6 lg:text-blue-400" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Desktop Only - Quick Stats */}
        <div className="hidden lg:block lg:mx-6 lg:mt-8">
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
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 bg-black/50 lg:bg-gradient-to-r lg:from-gray-900/90 lg:to-black/90">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full px-3 py-2 hover:bg-white/10 lg:mx-4 lg:mb-4 lg:px-6 lg:py-4 lg:rounded-xl lg:hover:bg-gradient-to-r lg:hover:from-gray-800/50 lg:hover:to-gray-700/50 lg:transition-all lg:duration-300">
                  <Avatar className="w-5 h-5 lg:w-10 lg:h-10 lg:ring-2 lg:ring-blue-500/30">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs lg:text-sm font-medium">
                      {(user?.name || "JD")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left lg:ml-2">
                    <span className="text-xs lg:text-sm font-medium lg:text-white">
                      {loading ? "Carregando..." : user?.name || "Usuário"}
                    </span>
                    <span className="text-xs text-gray-400 lg:text-gray-300">
                      {loading ? "..." : user?.email || "email@desconhecido.com"}
                    </span>

                  </div>
                  <ChevronUp className="ml-auto w-3 h-3 lg:w-4 lg:h-4 lg:text-gray-400" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-56 glass border-white/10 z-50 lg:w-72 lg:bg-gray-900/95 lg:border-gray-700/50 lg:backdrop-blur-xl"
              >
                <DropdownMenuItem
                  onClick={() => onMenuClick("conta")}
                  className="cursor-pointer lg:p-4 lg:hover:bg-gradient-to-r lg:hover:from-blue-500/10 lg:hover:to-purple-500/10 lg:rounded-lg lg:mx-2 lg:my-1"
                >
                  <User className="w-4 h-4 mr-2 lg:w-5 lg:h-5 lg:text-blue-400" />
                  <span className="lg:text-base lg:font-medium">Minha Conta</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-400 lg:p-4 lg:hover:bg-red-500/10 lg:rounded-lg lg:mx-2 lg:my-1"
                >
                  <LogOut className="w-4 h-4 mr-2 lg:w-5 lg:h-5" />
                  <span className="lg:text-base lg:font-medium">Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
