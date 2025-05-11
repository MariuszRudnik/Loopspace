# Plan testów API dla aplikacji Loopspace

## 1. Testy jednostkowe endpointów API

### 1.1 Endpointy autoryzacji

#### `/api/auth/login`
- Test poprawnego logowania użytkownika
- Test niepoprawnych danych logowania
- Test nieprawidłowego formatu danych
- Test braku wymaganych pól
- Test obsługi błędów Supabase
- Test ustawiania cookies po pomyślnym logowaniu
- Test tworzenia profilu użytkownika jeśli nie istnieje

#### `/api/auth/logout`
- Test poprawnego wylogowania użytkownika
- Test czyszczenia cookies sesji
- Test wylogowania niezalogowanego użytkownika

#### `/api/auth/register`
- Test poprawnej rejestracji użytkownika
- Test rejestracji z istniejącym emailem
- Test nieprawidłowego formatu danych
- Test tworzenia profilu użytkownika po rejestracji
- Test walidacji hasła (długość, złożoność)

### 1.2 Endpointy kanałów

#### `/api/channels/list`
- Test pobierania listy kanałów dla zalogowanego użytkownika
- Test filtrowania kanałów
- Test paginacji
- Test sortowania
- Test dostępu niezalogowanego użytkownika

#### `/api/channels/add`
- Test dodawania nowego kanału
- Test walidacji danych wejściowych
- Test obsługi duplikatów
- Test uprawnień użytkownika

#### `/api/channels/delete`
- Test usuwania kanału
- Test usuwania nieistniejącego kanału
- Test uprawnień (tylko właściciel może usunąć)

### 1.3 Endpointy kursów

#### `/api/courses`
- Test pobierania listy kursów
- Test dodawania nowego kursu
- Test filtrowania kursów po kanale
- Test paginacji i sortowania

#### `/api/courses/[courseId]`
- Test pobierania szczegółów pojedynczego kursu
- Test aktualizacji kursu
- Test usuwania kursu
- Test uprawnień dostępu do kursu

### 1.4 Endpointy rozdziałów

#### `/api/chapters/[courseId]`
- Test pobierania rozdziałów dla kursu
- Test dodawania nowego rozdziału
- Test walidacji danych rozdziału
- Test obsługi błędów

#### `/api/chapters/[id]`
- Test aktualizacji rozdziału
- Test usuwania rozdziału
- Test pobierania pojedynczego rozdziału
- Test uprawnień

### 1.5 Endpointy lekcji

#### `/api/chapters/lessons/[chapterId]`
- Test pobierania lekcji dla rozdziału
- Test dodawania nowej lekcji
- Test walidacji danych lekcji

#### `/api/lessons/[id]`
- Test aktualizacji lekcji
- Test usuwania lekcji
- Test pobierania pojedynczej lekcji

### 1.6 Endpointy czatu AI

#### `/api/chat`
- Test wysyłania wiadomości do API OpenRouter
- Test weryfikacji zalogowanego użytkownika
- Test obsługi błędów odpowiedzi
- Test limitów użycia

## 2. Testy integracyjne

### 2.1 Przepływ autoryzacji
- Test pełnego procesu rejestracji -> logowania -> wylogowania
- Test utrzymania sesji między zapytaniami

### 2.2 Przepływ tworzenia treści
- Test tworzenia kanał -> kurs -> rozdział -> lekcja
- Test poprawności relacji między obiektami

### 2.3 Przepływ aktualizacji treści
- Test aktualizacji kursu i propagacji zmian
- Test aktualizacji rozdziału i wpływu na lekcje

## 3. Testowanie obsługi błędów

### 3.1 Błędy walidacji
- Testy dla różnych przypadków niepoprawnych danych
- Testy przekroczenia limitów (np. długość tytułów)

### 3.2 Błędy autoryzacji
- Testy dostępu do chronionych zasobów
- Testy wygasłych tokenów
- Testy nieprawidłowych uprawnień

### 3.3 Błędy bazy danych
- Testy obsługi błędów połączenia z Supabase
- Testy duplikacji kluczy
- Testy naruszenia integralności referencyjnej

## 4. Testy uwierzytelniania i autoryzacji

### 4.1 Testy cookies i tokenów
- Test poprawnego zarządzania tokenami uwierzytelniającymi
- Test wygasania tokenów

### 4.2 Testy uprawnień
- Test rozróżnienia uprawnień użytkownika vs właściciela 
- Test dostępu do zasobów innych użytkowników

## 5. Testy wydajnościowe

### 5.1 Testy odpowiedzi API
- Test czasu odpowiedzi dla różnych endpointów
- Test zachowania pod obciążeniem

### 5.2 Testy paginacji i dużych zbiorów danych
- Test poprawnej obsługi paginacji
- Test wydajności filtrowania i sortowania

## 6. Konfiguracja testów

### 6.1 Mock Supabase
```typescript
// Przykład mockowania klienta Supabase
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn()
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}));
```

### 6.2 Mock Next.js API
```typescript
// Przykład mockowania Next.js API
vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server');
  return {
    ...actual,
    NextResponse: {
      json: vi.fn((data, options) => ({ 
        data, 
        ...options,
        cookies: {
          set: vi.fn(),
          get: vi.fn(),
          delete: vi.fn()
        }
      }))
    }
  };
});
```

### 6.3 Konfiguracja testów API
```typescript
// Przykład konfiguracji testów API
describe('API tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // Testy endpointów...
});
```
