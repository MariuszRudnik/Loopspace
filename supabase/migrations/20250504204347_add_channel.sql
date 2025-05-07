BEGIN;

-- 1. Tworzenie tabeli "chapters"
CREATE TABLE chapters (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
                          title TEXT NOT NULL,
                          order_number INT NOT NULL,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Dodanie kolumny "chapter_id" do "lessons"
ALTER TABLE lessons ADD COLUMN chapter_id UUID;

-- 3. Tworzenie domyślnych rozdziałów dla istniejących kursów
CREATE TEMP TABLE temp_course_chapter_map AS
SELECT
    id AS course_id,
    gen_random_uuid() AS chapter_id
FROM courses;

INSERT INTO chapters (id, course_id, title, order_number)
SELECT
    chapter_id,
    course_id,
    'Domyślny rozdział',
    1
FROM temp_course_chapter_map;

-- 4. Przypisanie lekcji do domyślnych rozdziałów na podstawie starego course_id
UPDATE lessons
SET chapter_id = temp.chapter_id
    FROM temp_course_chapter_map temp
WHERE lessons.course_id = temp.course_id;

-- 5. Usunięcie kolumny course_id z "lessons"
ALTER TABLE lessons DROP COLUMN course_id;

-- 6. Ustawienie NOT NULL i klucza obcego na "chapter_id"
ALTER TABLE lessons
    ALTER COLUMN chapter_id SET NOT NULL,
ADD CONSTRAINT fk_lessons_chapter FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE;

-- 7. Dodanie unikalnych indeksów (opcjonalne, ale zalecane)
CREATE UNIQUE INDEX idx_chapters_course_order ON chapters(course_id, order_number);
CREATE UNIQUE INDEX idx_lessons_chapter_order ON lessons(chapter_id, order_number);

COMMIT;
