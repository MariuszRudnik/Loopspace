# Plan wdrożenia usługi OpenRouter

## 1. Opis usługi

Usługa OpenRouter integruje się z API OpenRouter, aby umożliwić funkcjonalność czatu zasilanego przez AI w aplikacji. Pozwala użytkownikom inicjować i wchodzić w interakcję z interfejsem czatu opartym na modelu językowym (LLM). Usługa obsługuje komunikaty systemowe, dane wejściowe użytkownika oraz ustrukturyzowane odpowiedzi, zapewniając jednocześnie solidną obsługę błędów i bezpieczeństwo.

---

## 2. Opis konstruktora

Konstruktor inicjalizuje usługę OpenRouter z następującymi parametrami:
- **Klucz API**: Wymagany do uwierzytelniania żądań do API OpenRouter.
- **Bazowy URL**: Punkt końcowy dla API OpenRouter.
- **Domyślny model**: Domyślny model LLM używany do interakcji w czacie.
- **Domyślne parametry**: Opcjonalne parametry do dostosowania zachowania modelu.

---

## 3. Publiczne metody i pola

### `initializeChat(sessionId: string): Promise<void>`
- **Opis**: Inicjalizuje nową sesję czatu z unikalnym identyfikatorem sesji.
- **Parametry**: `sessionId` - Unikalny identyfikator sesji czatu.
- **Zwraca**: Obietnicę, która zostaje rozwiązana po pomyślnym zainicjowaniu sesji.

### `sendMessage(sessionId: string, userMessage: string): Promise<string>`
- **Opis**: Wysyła wiadomość użytkownika do API OpenRouter i pobiera odpowiedź modelu.
- **Parametry**:
  - `sessionId`: Unikalny identyfikator sesji czatu.
  - `userMessage`: Wiadomość wprowadzona przez użytkownika.
- **Zwraca**: Obietnicę, która zostaje rozwiązana z odpowiedzią modelu.

### `setModel(modelName: string): void`
- **Opis**: Aktualizuje model używany do interakcji w czacie.
- **Parametry**: `modelName` - Nazwa modelu LLM do użycia.

### `setParameters(parameters: Record<string, any>): void`
- **Opis**: Aktualizuje parametry dla modelu LLM.
- **Parametry**: `parameters` - Obiekt klucz-wartość z parametrami modelu.

---

## 4. Prywatne metody i pola

### `_buildSystemMessage(): string`
- **Opis**: Tworzy komunikat systemowy, który kieruje zachowaniem modelu LLM.
- **Zwraca**: Ciąg znaków reprezentujący komunikat systemowy.

### `_formatResponse(response: any): string`
- **Opis**: Formatuje surową odpowiedź z API OpenRouter na przyjazny dla użytkownika format.
- **Parametry**: `response` - Surowy obiekt odpowiedzi z API.
- **Zwraca**: Sformatowany ciąg znaków.

### `_handleError(error: any): void`
- **Opis**: Obsługuje błędy podczas interakcji z API.
- **Parametry**: `error` - Obiekt błędu.
- **Zwraca**: Loguje błąd i rzuca przyjazny dla użytkownika komunikat.

---

## 5. Obsługa błędów

### Potencjalne scenariusze błędów
1. **Nieprawidłowy klucz API**: Występuje, gdy podany klucz API jest nieprawidłowy lub wygasł.
2. **Problemy z siecią**: Występują, gdy brak połączenia z internetem lub serwer API jest niedostępny.
3. **Nieprawidłowa nazwa modelu**: Występuje, gdy podana nazwa modelu nie jest obsługiwana przez OpenRouter.
4. **Nieprawidłowe dane wejściowe użytkownika**: Występują, gdy dane wejściowe użytkownika nie spełniają oczekiwanego formatu.
5. **Limity API**: Występują, gdy użycie API przekracza dozwolony limit.

### Rozwiązania
1. Walidacja klucza API podczas inicjalizacji i dostarczanie jasnych komunikatów o błędach.
2. Implementacja logiki ponawiania z eksponencjalnym opóźnieniem dla problemów z siecią.
3. Walidacja nazwy modelu przed wysłaniem żądań.
4. Czyszczenie i walidacja danych wejściowych użytkownika przed wysłaniem ich do API.
5. Monitorowanie użycia API i implementacja mechanizmów ograniczania szybkości.

---

## 6. Kwestie bezpieczeństwa

1. **Zarządzanie kluczem API**: Przechowywanie klucza API w sposób bezpieczny za pomocą zmiennych środowiskowych lub menedżera sekretów.
2. **Walidacja danych wejściowych**: Czyszczenie wszystkich danych wejściowych użytkownika, aby zapobiec atakom typu injection.
3. **Ograniczanie szybkości**: Implementacja ograniczania szybkości, aby zapobiec nadużyciom usługi.
4. **Logowanie błędów**: Unikanie logowania wrażliwych informacji w komunikatach o błędach.

---

## 7. Plan wdrożenia krok po kroku

### Krok 1: Konfiguracja środowiska
1. Uzyskaj klucz API z OpenRouter.
2. Dodaj klucz API i bazowy URL do zmiennych środowiskowych.

### Krok 2: Implementacja usługi
1. Utwórz nowy plik usługi (np. `OpenRouterService.ts`).
2. Zaimplementuj konstruktor i metody publiczne.
3. Dodaj metody prywatne do tworzenia komunikatów systemowych, formatowania odpowiedzi i obsługi błędów.

### Krok 3: Konfiguracja komunikatów systemowych i użytkownika
1. Zdefiniuj szablon komunikatu systemowego w `_buildSystemMessage()`, aby kierować zachowaniem LLM.
   - Przykład: `"Jesteś asystentem AI. Odpowiadaj zwięźle i pomocnie."`
2. Przekazuj wiadomości użytkownika bezpośrednio do metody `sendMessage()`.

### Krok 4: Implementacja formatowania odpowiedzi
1. Użyj parametru `response_format`, aby żądać ustrukturyzowanych odpowiedzi JSON.
   - Przykład:
     ```json
     {
       "type": "json_schema",
       "json_schema": {
         "name": "chat_response",
         "strict": true,
         "schema": {
           "type": "object",
           "properties": {
             "message": { "type": "string" },
             "timestamp": { "type": "string", "format": "date-time" }
           },
           "required": ["message", "timestamp"]
         }
       }
     }
     ```
2. Parsuj i formatuj odpowiedź w `_formatResponse()`.

### Krok 5: Testowanie usługi
1. Napisz testy jednostkowe dla wszystkich metod publicznych.
2. Symuluj odpowiedzi API, aby przetestować obsługę błędów.

### Krok 6: Wdrożenie usługi
1. Wdróż usługę w środowisku produkcyjnym.
2. Monitoruj logi pod kątem błędów i problemów z wydajnością.

### Krok 7: Monitorowanie i utrzymanie
1. Regularnie aktualizuj usługę, aby obsługiwała nowe funkcje API OpenRouter.
2. Monitoruj użycie API i dostosowuj limity szybkości w razie potrzeby.
3. Okresowo rotuj klucze API dla bezpieczeństwa.

---

Ten plan wdrożenia zapewnia solidną, bezpieczną i skalowalną integrację usługi OpenRouter z Twoją aplikacją.