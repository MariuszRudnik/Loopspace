"use client";

import { useState } from "react";
import { useMutation, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const queryClient = new QueryClient();

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: async ({
      email,
      password,
      username,
    }: {
      email: string;
      password: string;
      username: string;
    }) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          displayName: username,
        }),
      });
      const data = await res.json();
      return { status: res.status, data };
    },
    onSuccess: (result) => {
      if (result.status === 201) {
        setSuccess("Rejestracja zakończona sukcesem! Możesz się teraz zalogować.");
        setError(null);
        router.push("/dashboard");
      } else {
        setError(result.data.error?.message || "Błąd rejestracji.");
        setSuccess(null);
      }
    },
    onError: () => {
      setError("Wystąpił błąd sieci.");
      setSuccess(null);
    },
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !username || !password || !repeatPassword) {
      setError("Wszystkie pola są wymagane.");
      return;
    }
    if (password !== repeatPassword) {
      setError("Hasła muszą być identyczne.");
      return;
    }
    registerMutation.mutate({ email, password, username });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <button
          type="button"
          className="w-full mb-2 bg-gray-200 text-black py-2 rounded hover:bg-gray-300"
          onClick={() => router.push("/login")}
        >
          Przejdź do logowania
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Rejestracja</h2>
        <input
          type="text"
          placeholder="Nazwa użytkownika"
          className="w-full border p-2 rounded"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          className="w-full border p-2 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Powtórz hasło"
          className="w-full border p-2 rounded"
          value={repeatPassword}
          onChange={e => setRepeatPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-900"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Rejestruję..." : "Zarejestruj się"}
        </button>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <RegisterForm />
    </QueryClientProvider>
  );
}

