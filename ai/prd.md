# Dokument Wymagań Projektowych (PRD) – Loopspace (MVP)

---

## Wprowadzenie

Aplikacja **Loopspace** to platforma open-source umożliwiająca tworzenie przestrzeni do dzielenia się wiedzą, prowadzenia kursów wideo oraz organizowania społeczności. Głównym celem jest dostarczenie darmowego rozwiązania, które można zainstalować na własnym serwerze, eliminując koszty subskrypcji związane z komercyjnymi platformami, takimi jak Circle.so.

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

1. **Zarządzanie użytkownikami:**
   - Administrator może dodawać użytkowników i ręcznie nadawać im hasła.
   - Użytkownicy mogą resetować swoje hasła za pomocą dedykowanej strony.

2. **Tworzenie kursów i materiałów edukacyjnych:**
   - Możliwość dodawania materiałów wideo (format MP4) z własnego serwera.
   - Możliwość dodawania artykułów i linków do zewnętrznych zasobów.
   - Funkcje odtwarzania wideo: zatrzymywanie, cofanie, wznawianie oraz zapisywanie czasu odtwarzania.

3. **Komentarze:**
   - Użytkownicy mogą komentować materiały edukacyjne w ramach społeczności.

### Funkcjonalności wykluczone z MVP

- Historia aktywności użytkownika.
- Chatbot wspierający naukę.
- Tworzenie zakładek i notatek w materiałach.
- Zaawansowane opcje personalizacji platformy.

---

## Kryteria sukcesu

- Aplikacja dostępna jako projekt open-source.
- Zainteresowanie społeczności open-source, zarówno użytkowników, jak i programistów.
- Możliwość instalacji i użytkowania aplikacji na własnym serwerze bez dodatkowych kosztów.

---

## Ograniczenia projektowe

- **Technologie:** React, Next.js, TypeScript.
- **Baza danych:** Do ustalenia (np. PostgreSQL, MongoDB).
- **Hosting:** Aplikacja musi działać na serwerach z systemem Linux.
- **Wideo:** Obsługa plików MP4 z własnego serwera, bez zaawansowanych funkcji transkodowania.

---

## Historie użytkownika

1. **Administrator:**
   - Dodaje użytkowników i przypisuje im hasła.
   - Tworzy kursy i dodaje materiały edukacyjne (wideo, artykuły, linki).

2. **Użytkownik:**
   - Loguje się do aplikacji i przegląda dostępne kursy.
   - Odtwarza materiały wideo z możliwością zatrzymywania, cofania i zapisywania czasu.
   - Komentuje materiały edukacyjne.
   - Resetuje hasło za pomocą dedykowanej strony.

---

## Wymagania funkcjonalne

1. **Zarządzanie użytkownikami:**
   - Formularz dodawania użytkowników przez administratora.
   - Strona resetowania hasła dla użytkowników.

2. **Materiały edukacyjne:**
   - Obsługa przesyłania plików wideo (MP4) na serwer.
   - Interfejs do dodawania artykułów i linków.

3. **Komentarze:**
   - Sekcja komentarzy pod każdym materiałem edukacyjnym.

4. **Odtwarzacz wideo:**
   - Funkcje: odtwarzanie, zatrzymywanie, cofanie, wznawianie, zapisywanie czasu.

---

## Wymagania niefunkcjonalne

- **Wydajność:** Aplikacja powinna obsługiwać do 100 jednoczesnych użytkowników w MVP.
- **Bezpieczeństwo:** Hasła użytkowników muszą być przechowywane w formie zaszyfrowanej.
- **Dostępność:** Aplikacja powinna działać na popularnych przeglądarkach (Chrome, Firefox, Edge).

---

## Roadmapa rozwoju

1. **Etap 1:** Implementacja podstawowych funkcji MVP (zarządzanie użytkownikami, dodawanie materiałów, odtwarzacz wideo, komentarze).
2. **Etap 2:** Testy funkcjonalne i użyteczności.
3. **Etap 3:** Publikacja projektu na GitHub jako open-source.

---

## Dokumentacja

- Instrukcja instalacji aplikacji na własnym serwerze.
- Dokumentacja API (jeśli dotyczy).
- Przewodnik dla administratorów i użytkowników.