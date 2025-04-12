import type { ReactNode } from "react"

import DashboardSidebar from "@/components/dashboard-sidebar"
import DashboardNavbar from "@/components/dashboard-navbar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNavbar />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
