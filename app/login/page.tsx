"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset błędu przed nową próbą logowania

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Jeśli logowanie się powiodło, przekieruj na stronę dashboard
        router.push("/dashboard");
      } else {
        // Jeśli logowanie się nie powiodło, wyświetl komunikat o błędzie
        const data = await response.json();
        setError(data.error?.message || "Nieprawidłowy login lub hasło");
      }
    } catch (err) {
      console.error("Błąd logowania:", err);
      setError("Wystąpił błąd podczas logowania. Spróbuj ponownie później.");
    }
  };

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Logowanie</CardTitle>
          <CardDescription>Wprowadź swoje dane, aby zalogować się do konta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
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
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full">
                Zaloguj się
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">{/* Usunięto opcję rejestracji */}</CardFooter>
      </Card>
    </div>
  );
}
