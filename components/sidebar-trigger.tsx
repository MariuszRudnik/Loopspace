"use client"

import type React from "react"

import { PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebarStore } from "@/lib/store"

export function SidebarTrigger({ className, ...props }: React.ComponentProps<typeof Button>) {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar)

  return (
    <Button variant="ghost" size="icon" className={`h-7 w-7 ${className}`} onClick={toggleSidebar} {...props}>
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}
