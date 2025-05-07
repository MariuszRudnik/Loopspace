
# Plan bazy danych

...existing content...

## Polityki bezpieczeństwa (RLS)
- **`profiles`**:
  - Publiczny dostęp do profili.
  - Edycja własnego profilu.
- **`courses`**:
  - Publiczny dostęp do kursów (`is_public = true`).
  - Zarządzanie własnymi kursami (`auth.uid() = created_by`).
  - Administratorzy mogą zarządzać wszystkimi kursami.
- **`admin_users`**:
  - Tylko administratorzy mogą zarządzać i widzieć innych administratorów.
- **`lessons`**:
  - Publiczny dostęp do lekcji z publicznych kursów.
  - Twórcy kursów mogą zarządzać lekcjami swoich kursów.
  - Administratorzy mogą zarządzać wszystkimi lekcjami.
- **`enrollments`**:
  - Użytkownicy mogą przeglądać swoje zapisy na kursy.
  - Użytkownicy mogą zapisywać się i wypisywać z kursów.
  - Twórcy kursów mogą przeglądać zapisy na swoje kursy.
  - Administratorzy mogą zarządzać wszystkimi zapisami.
- **`progress`**:
  - Użytkownicy mogą przeglądać i aktualizować swoje postępy.
  - Twórcy kursów mogą przeglądać postępy w swoich kursach.
  - Administratorzy mogą przeglądać wszystkie postępy.
- **`comments`**:
  - Użytkownicy mogą przeglądać komentarze do dostępnych lekcji.
  - Użytkownicy mogą zarządzać własnymi komentarzami.
  - Twórcy kursów mogą moderować komentarze w swoich kursach.
  - Administratorzy mogą zarządzać wszystkimi komentarzami.
...existing content...
