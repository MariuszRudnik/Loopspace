"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { supabase, checkSession, checkSupabaseConfig } from "@/lib/supabaseClient";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [configError, setConfigError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Sprawdź konfigurację Supabase i sesję użytkownika podczas ładowania strony
  useEffect(() => {
    const initialize = async () => {
      try {
        // Sprawdź poprawność konfiguracji Supabase
        const isConfigValid = checkSupabaseConfig();
        if (!isConfigValid) {
          console.error("Nieprawidłowa konfiguracja Supabase. Sprawdź plik .env.local");
          setConfigError(true);
          setIsLoading(false);
          return;
        }

        // Sprawdź sesję użytkownika
        console.log("Sprawdzanie sesji użytkownika...");
        const { data, error } = await supabase.auth.getSession();
        
        // Zapisz informacje debugowania
        setDebugInfo(JSON.stringify(data, null, 2));
        
        if (data.session) {
          console.log("Sesja znaleziona, przekierowywanie do dashboardu");
          router.push("/dashboard");
        } else {
          console.log("Brak sesji, pokazywanie formularza logowania");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Błąd podczas inicjalizacji:", error);
        setErrorMessage("Wystąpił błąd podczas inicjalizacji aplikacji");
        setIsLoading(false);
      }
    };
    
    initialize();
  }, [router]);

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      console.log("Próba logowania dla:", data.email);
      
      try {
        // Korzystamy z API route zamiast bezpośrednio Supabase
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Błąd logowania');
        }

        const authData = await response.json();
        console.log("Odpowiedź logowania:", authData);

        // Po zalogowaniu sprawdź sesję ponownie
        await checkSession();
        
        return authData;
      } catch (error: any) {
        console.error("Błąd podczas wywołania API:", error);
        throw new Error(error.message || 'Nieznany błąd podczas logowania');
      }
    },
    onSuccess: (data) => {
      console.log("Logowanie zakończone sukcesem, przekierowywanie...");
      
      // Krótkie opóźnienie przed przekierowaniem, aby sesja miała czas na zapisanie
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    },
    onError: (error: any) => {
      console.error("Błąd logowania:", error);
      
      // Specjalna obsługa błędu połączenia
      if (error.message?.includes('Failed to fetch')) {
        setErrorMessage('Problem z połączeniem do serwera uwierzytelniania. Sprawdź konfigurację Supabase.');
      } else {
        setErrorMessage(error.message || 'Wystąpił problem z logowaniem. Spróbuj ponownie.');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setErrorMessage(null);
    loginMutation.mutate({ email, password });
  };

  // Wyświetl wskaźnik ładowania podczas sprawdzania sesji
  if (isLoading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <p>Ładowanie...</p>
      </div>
    );
  }

  // Wyświetl komunikat o błędzie konfiguracji
  if (configError) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-red-600">Błąd konfiguracji</CardTitle>
            <CardDescription>Nieprawidłowa konfiguracja połączenia z Supabase</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Uwaga!</AlertTitle>
              <AlertDescription>
                <p>
                  Wykryto błąd konfiguracji Supabase. W pliku .env.local znajdują się nieprawidłowe dane:
                </p>
                <ul className="list-disc pl-5 mt-2">
                  <li><strong>NEXT_PUBLIC_SUPABASE_URL</strong> - zawiera przykładowy URL zamiast faktycznego URL projektu</li>
                  <li><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong> - może zawierać przykładowy klucz zamiast faktycznego klucza</li>
                </ul>
                <p className="mt-2 font-semibold">
                  Sprawdź plik .env.local i zamień przykładowe wartości na faktyczne dane z projektu Supabase.
                </p>
                <p className="mt-2">
                  Poprawny format URL: <code className="bg-gray-200 px-1 rounded">https://[twój-id-projektu].supabase.co</code>
                </p>
                <p className="mt-2">
                  Te wartości znajdziesz w panelu zarządzania Supabase, w zakładce Project Settings &gt; API.
                </p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
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
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="nazwa@przykład.com" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Hasło</Label>
                  <Link href="#" className="text-sm text-muted-foreground underline">
                    Zapomniałeś hasła?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Logowanie..." : "Zaloguj się"}
              </Button>
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              
              {/* Debug info - usuń w środowisku produkcyjnym */}
              {debugInfo && (
                <div className="mt-4 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                  <p className="font-bold">Informacje debugowania:</p>
                  <pre>{debugInfo}</pre>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

