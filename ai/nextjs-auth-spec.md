
# Specyfikacja Modułu Autoryzacji w Next.js

## 1. Diagram Przepływu Danych

```mermaid
graph TD
    A[UI: Formularze] -->|Dane użytkownika| B[API Routes]
    B -->|Walidacja danych| C[Supabase Auth]
    C -->|Tokeny sesji| D[Cookies (HttpOnly)]
    D -->|Sesja użytkownika| E[Middleware: Chronione Ścieżki]
    E -->|Dostęp do zasobów| F[Strony Chronione]
```

---

## 2. Opis Komponentów i Ich Odpowiedzialności

### Frontend (Next.js)

#### Struktura katalogu `app/`
- **`app/login/page.tsx`**: Strona logowania.
- **`app/register/page.tsx`**: Strona rejestracji.
- **`app/forgot-password/page.tsx`**: Strona odzyskiwania hasła.
- **`app/reset-password/page.tsx`**: Strona resetowania hasła.
- **`app/profile/page.tsx`**: Strona profilu użytkownika (chroniona).

#### Podział na Server i Client Components
- Formularze (logowanie, rejestracja, odzyskiwanie hasła) jako **Client Components** dla obsługi interakcji.
- Chronione strony (np. profil) jako **Server Components** z weryfikacją sesji po stronie serwera.

#### Formularze
- **Biblioteka:** `react-hook-form` do zarządzania formularzami.
- **Walidacja:** `zod` do walidacji danych wejściowych.
- **Obsługa błędów:** Wyświetlanie błędów walidacji i błędów API.

#### Middleware
- **Plik:** `middleware.ts` w katalogu głównym.
- **Funkcjonalność:** Weryfikacja tokenów sesji i przekierowanie na stronę logowania, jeśli użytkownik nie jest zalogowany.

#### Obsługa stanów
- **Ładowanie:** Komponent `LoadingSpinner` dla formularzy i chronionych stron.
- **Błędy:** Komponent `ErrorMessage` do wyświetlania błędów.

#### Integracja z Supabase Auth
- **Custom hooki:** `useAuth` do zarządzania stanem użytkownika i interakcji z Supabase.

---

### Backend (API Routes)

#### Struktura API
- **`/api/auth/register`**: Rejestracja użytkownika.
- **`/api/auth/login`**: Logowanie użytkownika.
- **`/api/auth/logout`**: Wylogowanie użytkownika.
- **`/api/auth/forgot-password`**: Wysłanie linku do resetowania hasła.
- **`/api/auth/reset-password`**: Resetowanie hasła.

#### Schematy walidacji
- **Rejestracja:** `{ email: string, password: string, displayName: string }`
- **Logowanie:** `{ email: string, password: string }`
- **Reset hasła:** `{ token: string, newPassword: string }`

#### Mechanizm sesji
- **Cookies:** HttpOnly, Secure, SameSite ustawione na `Strict`.
- **Tokeny:** Obsługa refresh tokenów przez Supabase.

#### Obsługa błędów
- Standardowe odpowiedzi JSON:
  ```json
  {
    "error": {
      "code": "ERROR_CODE",
      "message": "Opis błędu"
    }
  }
  ```

#### Typy TypeScript
- Generowanie typów dla odpowiedzi API za pomocą `zod`.

---

### System Autentykacji z Supabase

#### Konfiguracja klienta Supabase
- **Plik:** `lib/supabaseClient.ts`.
- **Kod:**
  ```typescript
  import { createClient } from '@supabase/supabase-js';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  export const supabase = createClient(supabaseUrl, supabaseKey);
  ```

#### Przepływy autoryzacji
1. **Rejestracja:**
   - Tworzenie użytkownika w Supabase Auth.
   - Synchronizacja z tabelą `profiles` w bazie danych.

2. **Logowanie:**
   - Weryfikacja danych użytkownika.
   - Ustawienie tokenów sesji w cookies.

3. **Wylogowanie:**
   - Usunięcie tokenów sesji.

4. **Reset hasła:**
   - Wysłanie emaila z linkiem do resetowania hasła.
   - Aktualizacja hasła po weryfikacji tokenu.

#### Synchronizacja z bazą danych
- **Tabela `profiles`:** Automatyczne tworzenie rekordu po rejestracji użytkownika.

#### Mechanizm refresh tokenów
- Automatyczne odświeżanie tokenów za pomocą Supabase Auth.

---

## 3. Scenariusze Bezpieczeństwa

1. **Ochrona danych użytkownika:**
   - Hasła przechowywane w formie zaszyfrowanej (Supabase).
   - Cookies HttpOnly i Secure.

2. **Zapobieganie CSRF:**
   - SameSite ustawione na `Strict`.

3. **Ochrona przed brute force:**
   - Limit prób logowania na IP.

4. **Bezpieczne resetowanie hasła:**
   - Tokeny jednorazowe z ograniczeniem czasowym.

5. **Weryfikacja emaila:**
   - Opcjonalna weryfikacja adresu email po rejestracji.

