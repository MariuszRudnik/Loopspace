"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

async function logoutUser() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Problem z wylogowaniem");
  }

  return response.json();
}

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      router.push("/login");
      router.refresh();
    },
  });

  return (
    <Button 
      variant="ghost" 
      onClick={() => logout()} 
      disabled={isPending}
      className={`w-full justify-start ${className}`}
    >
      {isPending ? "Wylogowywanie..." : "Wyloguj się"}
    </Button>
  );
}
