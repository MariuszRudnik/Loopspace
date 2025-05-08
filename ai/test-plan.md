# Test Plan aplikacji Loopspace

## 1. Cel testów

Celem testów jest zapewnienie, że wszystkie kluczowe funkcjonalności aplikacji Loopspace działają poprawnie, są odporne na błędy oraz spełniają wymagania użytkownika końcowego. Testy obejmują zarówno backend (API), jak i frontend (UI).

---

## 2. Zakres testów

- Rejestracja i logowanie użytkownika
- Zarządzanie kanałami (channels)
- Zarządzanie kursami (courses)
- Zarządzanie rozdziałami (chapters)
- Zarządzanie lekcjami (lessons)
- Integracja z OpenRouter (AI chat)
- Uprawnienia i bezpieczeństwo
- Obsługa błędów i walidacja danych
- Responsywność i UX

---

## 3. Typy testów

- Testy jednostkowe (unit tests)
- Testy integracyjne (integration tests)
- Testy end-to-end (E2E)
- Testy manualne UI
- Testy API w Postmanie
- Testy bezpieczeństwa (security tests)

---

## 4. Scenariusze testowe

### 4.1. Rejestracja i logowanie

- [ ] Użytkownik może się zarejestrować z poprawnym e-mailem i hasłem
- [ ] Użytkownik nie może się zarejestrować z istniejącym e-mailem
- [ ] Użytkownik może się zalogować z poprawnymi danymi
- [ ] Błędne dane logowania zwracają odpowiedni komunikat

### 4.2. Kanały (Channels)

- [ ] Użytkownik może dodać nowy kanał
- [ ] Użytkownik widzi listę swoich kanałów
- [ ] Użytkownik może usunąć własny kanał
- [ ] Użytkownik nie może usunąć kanału, którego nie jest właścicielem

### 4.3. Kursy (Courses)

- [ ] Użytkownik może dodać kurs do kanału
- [ ] Użytkownik widzi listę kursów w kanale
- [ ] Użytkownik może edytować i usuwać własny kurs

### 4.4. Rozdziały (Chapters)

- [ ] Użytkownik może dodać rozdział do kursu
- [ ] Użytkownik widzi listę rozdziałów w kursie (wraz z lekcjami)
- [ ] Użytkownik może edytować i usuwać rozdział

### 4.5. Lekcje (Lessons)

- [ ] Użytkownik może dodać lekcję do rozdziału
- [ ] Użytkownik widzi listę lekcji w rozdziale
- [ ] Użytkownik może edytować i usuwać lekcję

### 4.6. AI Chat (OpenRouter)

- [ ] Użytkownik może otworzyć okno czatu AI
- [ ] Użytkownik może wysłać wiadomość do AI i otrzymać odpowiedź
- [ ] Spinner ładowania pojawia się podczas oczekiwania na odpowiedź AI
- [ ] Obsługa błędów API (np. brak połączenia, nieprawidłowy klucz)

### 4.7. Uprawnienia i bezpieczeństwo

- [ ] Użytkownik nie może edytować/usunąć cudzych kursów, rozdziałów, lekcji
- [ ] API odrzuca nieautoryzowane żądania
- [ ] Klucz API nie jest dostępny po stronie klienta

### 4.8. Walidacja i obsługa błędów

- [ ] Formularze walidują wymagane pola
- [ ] Błędne dane wejściowe zwracają czytelny komunikat
- [ ] Backend waliduje dane i zwraca odpowiednie kody błędów

### 4.9. UX i responsywność

- [ ] Interfejs jest responsywny na różnych urządzeniach
- [ ] Komunikaty o sukcesie i błędach są czytelne
- [ ] Komponenty modali zamykają się poprawnie

### 4.10. Testy API w Postmanie

- [ ] Każdy endpoint API jest testowany w Postmanie pod kątem poprawności odpowiedzi, obsługi błędów i walidacji danych
- [ ] Testy autoryzacji i uprawnień (np. próba usunięcia cudzych danych)
- [ ] Testy graniczne (np. bardzo długie dane, nietypowe znaki)
- [ ] Testy odporności na błędne dane wejściowe

### 4.11. Testy bezpieczeństwa

- [ ] Próba ataku SQL Injection i XSS na endpointy API i formularze
- [ ] Sprawdzenie, czy klucz API nie wycieka do frontendu
- [ ] Testy rate limiting (wielokrotne szybkie żądania)
- [ ] Testy CSRF (jeśli dotyczy)
- [ ] Testy poprawności obsługi sesji i autoryzacji

---

## 5. Narzędzia testowe

- **Unit/integration**: Vitest, React Testing Library, Supertest
- **E2E**: Playwright
- **API**: Postman (kolekcje testów automatycznych i manualnych)
- **Manualne**: checklisty, testy eksploracyjne
- **Bezpieczeństwo**: OWASP ZAP, testy ręczne, narzędzia do analizy ruchu sieciowego

---

## 6. Kryteria akceptacji

- Wszystkie krytyczne scenariusze zakończone sukcesem
- Brak błędów blokujących w produkcji
- Brak wycieków danych wrażliwych
- Poprawna obsługa błędów i walidacji
- Brak podatności bezpieczeństwa na podstawowe ataki

---

## 7. Uwagi końcowe

Plan testów powinien być aktualizowany wraz z rozwojem aplikacji i pojawianiem się nowych funkcjonalności.

