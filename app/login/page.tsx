"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Funkcja sprawdzająca czy użytkownik ma aktywną sesję
async function checkUserSession(): Promise<boolean> {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include", // ważne! żeby wysłać ciasteczka
  });

  return response.ok;
}

// Funkcja wykonująca żądanie logowania
async function loginUser(credentials: { email: string; password: string }) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // też ważne, jeśli backend ustawia cookie
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error?.message || "Nieprawidłowy login lub hasło");
  }

  return response.json();
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Sprawdzenie sesji przy załadowaniu komponentu
  useEffect(() => {
    const verifySession = async () => {
      try {
        const sessionExists = await checkUserSession();
        if (sessionExists) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Błąd sprawdzania sesji:", error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    verifySession();
  }, [router]);

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Wystąpił nieoczekiwany błąd.");
      }
    },
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    login({ email, password });
  };

  // Opcjonalnie: możesz wyświetlić loader podczas sprawdzania sesji
  if (isCheckingSession) {
    return (
        <div className="flex h-screen items-center justify-center">
          <p>Ładowanie...</p>
        </div>
    );
  }

  return (
      <div className="container flex h-screen items-center justify-center">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Logowanie</CardTitle>
            <CardDescription>Wprowadź swoje dane, aby zalogować się do konta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                      id="email"
                      type="email"
                      placeholder="nazwa@przykład.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Hasło</Label>
                    <Link href="#" className="text-sm text-muted-foreground underline">
                      Zapomniałeś hasła?
                    </Link>
                  </div>
                  <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                  />
                </div>
                {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Logowanie..." : "Zaloguj się"}
                </Button>
                <div className="text-center mt-2">
                  <Link href="/register" className="text-sm text-blue-600 underline">
                    Nie masz konta? Zarejestruj się
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">{/* Opcjonalna rejestracja */}</CardFooter>
        </Card>
      </div>
  );
}
