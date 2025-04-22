"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/logout-button";
import { Home, BookOpen, Settings, Users } from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    label: "Kursy",
    icon: BookOpen,
    href: "/dashboard/courses",
  },
  {
    label: "Użytkownicy",
    icon: Users,
    href: "/dashboard/users",
  },
  {
    label: "Ustawienia",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/40">
      <div className="flex flex-1 flex-col space-y-1 p-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center rounded-lg px-3 py-2 text-sm font-medium",
              pathname === route.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            <route.icon className="mr-2 h-4 w-4" />
            {route.label}
          </Link>
        ))}
      </div>
      <div className="border-t p-4">
        <LogoutButton />
      </div>
    </div>
  );
}
