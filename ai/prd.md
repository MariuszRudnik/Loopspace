# Dokument Wymagań Projektowych (PRD) – Loopspace (MVP)

---

## Wprowadzenie

Aplikacja **Loopspace** to platforma open-source umożliwiająca tworzenie przestrzeni do dzielenia się wiedzą, prowadzenia kursów wideo oraz organizowania społeczności. Głównym celem jest dostarczenie darmowego rozwiązania, które można zainstalować na własnym serwerze, eliminując koszty subskrypcji związane z komercyjnymi platformami, takimi jak Circle.so.

**Wersja MVP zawiera jedynie prostego chatbota do rozmowy, możliwość rejestracji administratora oraz możliwość dodawania kanałów, kursów i poszczególnych lekcji. Pozostałe funkcje opisane w tym dokumencie będą rozwijane w przyszłości.**

---

## Główny problem

Obecne platformy, takie jak Circle.so, są kosztowne i wymagają comiesięcznych opłat subskrypcyjnych, co stanowi barierę dla młodych firm, edukatorów i niezależnych twórców. Loopspace rozwiązuje ten problem, oferując darmowe, elastyczne i łatwe w dostosowaniu rozwiązanie open-source.

---

## Grupa docelowa

- Małe firmy i startupy, które chcą tworzyć bazy wiedzy i prowadzić szkolenia dla pracowników.
- Nauczyciele i edukatorzy, którzy chcą prowadzić kursy online.
- Niezależni twórcy i pasjonaci, którzy chcą organizować społeczności wokół swoich treści.

---

## Zakres MVP

### Funkcjonalności MVP

1. **Chatbot do rozmowy:**
   - Prosty chatbot AI wspierający użytkownika w rozmowie.

2. **Rejestracja administratora:**
   - Możliwość rejestracji konta administratora.

3. **Kanały, kursy i lekcje:**
   - Możliwość dodawania kanałów tematycznych.
   - Możliwość tworzenia kursów w ramach kanałów.
   - Możliwość dodawania poszczególnych lekcji do kursów.

4. **Baza danych:**
   - Supabase jako główna baza danych i backend.

### Funkcjonalności wykluczone z MVP

- Historia aktywności użytkownika.
- Zaawansowany chatbot wspierający naukę i generowanie quizów.
- Tworzenie zakładek i notatek w materiałach.
- Zaawansowane opcje personalizacji platformy.
- Komentarze pod materiałami.
- Odtwarzacz wideo z zaawansowanymi funkcjami.
- Resetowanie haseł i zarządzanie użytkownikami przez administratora.
- Testy pokrywające 100% funkcjonalności (testy będą rozwijane w przyszłości).

---

## Kryteria sukcesu

- Aplikacja dostępna jako projekt open-source.
- Zainteresowanie społeczności open-source, zarówno użytkowników, jak i programistów.
- Możliwość instalacji i użytkowania aplikacji na własnym serwerze bez dodatkowych kosztów.

---

## Ograniczenia projektowe

- **Technologie:** React, Next.js, TypeScript.
- **Baza danych:** Supabase.
- **Hosting:** Aplikacja musi działać na serwerach z systemem Linux.
- **Wideo:** Obsługa plików MP4 i odtwarzacz wideo będą dodane w przyszłości.

---

## Historie użytkownika

1. **Administrator:**
   - Może się zarejestrować.
   - Może tworzyć kanały, kursy i lekcje.

2. **Użytkownik:**
   - Może rozmawiać z chatbotem.
   - Może przeglądać dostępne kanały, kursy i lekcje.

---

## Wymagania funkcjonalne

1. **Chatbot:**
   - Prosty interfejs do rozmowy z AI.

2. **Kanały, kursy i lekcje:**
   - Możliwość tworzenia i przeglądania kanałów, kursów i lekcji.

---

## Wymagania niefunkcjonalne

- **Wydajność:** Aplikacja powinna obsługiwać do 100 jednoczesnych użytkowników w MVP.
- **Bezpieczeństwo:** Hasła użytkowników muszą być przechowywane w formie zaszyfrowanej (jeśli zostanie dodane zarządzanie użytkownikami).
- **Dostępność:** Aplikacja powinna działać na popularnych przeglądarkach (Chrome, Firefox, Edge).
- **Testy:** Pokrycie testami nie jest pełne, ale będzie rozwijane w przyszłości.

---

## Roadmapa rozwoju

1. **Etap 1:** Implementacja podstawowych funkcji MVP (chatbot, kanały, kursy, lekcje).
2. **Etap 2:** Rozwój kolejnych funkcji opisanych w tym dokumencie.
3. **Etap 3:** Testy funkcjonalne i użyteczności.
4. **Etap 4:** Publikacja projektu na GitHub jako open-source.

---

## Dokumentacja

- Instrukcja instalacji aplikacji na własnym serwerze.
- Dokumentacja API (jeśli dotyczy).
- Przewodnik dla administratorów i użytkowników.

