"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { DashboardSidebar } from "./dashboard-sidebar"

interface MobileSidebarProps {
  onMenuClick: (item: string) => void
  activeMenu: string
}

export function MobileSidebar({ onMenuClick, activeMenu }: MobileSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-80 bg-black border-white/10">
        <DashboardSidebar onMenuClick={onMenuClick} activeMenu={activeMenu} className="h-full" />
      </SheetContent>
    </Sheet>
  )
}
