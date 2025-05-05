-- Dodanie kolumny channel_id do tabeli courses
ALTER TABLE courses
    ADD COLUMN channel_id uuid REFERENCES channels(id);

-- (opcjonalnie) Można dodać indeks dla szybszych zapytań po channel_id
CREATE INDEX idx_courses_channel_id ON courses(channel_id);
