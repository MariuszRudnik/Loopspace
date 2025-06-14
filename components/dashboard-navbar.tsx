"use client"

import Link from "next/link"
import { Bell, User } from "lucide-react"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/sidebar-trigger"
import { useSidebarStore } from "@/lib/store"
import {useMutation} from "@tanstack/react-query";
import {useRouter} from "next/navigation";

export default function DashboardNavbar() {
  const router = useRouter()
  const setIsMobile = useSidebarStore((state) => state.setIsMobile)
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [setIsMobile])

  const { mutate: logout, isPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ważne dla ciasteczek
      })

      if (!response.ok) {
        throw new Error("Błąd podczas wylogowywania")
      }

      return response.json()
    },
    onSuccess: () => {
      // Po udanym wylogowaniu przekieruj na stronę główną/logowania
      router.push("/login")
    },
    onError: (error) => {
      console.error("Błąd wylogowania:", error)
      // Tutaj możesz dodać wyświetlenie powiadomienia o błędzie
    }
  })

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <SidebarTrigger />
        <Link href="/dashboard" className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Loopspace</h1>
        </Link>
      </div>
      <div className="hidden md:block">
        <Link href="/dashboard" className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Loopspace</h1>
        </Link>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" aria-label="Powiadomienia">
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Profil użytkownika">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Moje konto</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/dashboard/profile" className="flex w-full">
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button className="flex w-full" onClick={()=> logout()}>
                Wyloguj się
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
