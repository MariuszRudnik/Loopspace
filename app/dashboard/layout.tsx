"use client";

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardSidebar from "@/components/dashboard-sidebar"
import DashboardNavbar from "@/components/dashboard-navbar"
import { AIChatBot } from "@/components/ai-chat-bot"
import QueryProvider from "@/components/providers/QueryProvider";

function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const res = await fetch("/api/channels/test", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        router.replace("/login");
      }
    }
    checkSession();
    // eslint-disable-next-line
  }, []);

  return <>{children}</>;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthGuard>
        <div className="flex min-h-screen flex-col">
          <DashboardNavbar />
          <div className="flex flex-1">
            <DashboardSidebar />
            <main className="flex-1 p-6">{children}</main>
          </div>
          <AIChatBot />
        </div>
      </AuthGuard>
    </QueryProvider>
  )
}
