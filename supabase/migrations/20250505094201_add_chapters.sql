-- Dodaj kolumnę is_published do tabeli chapters
ALTER TABLE chapters
    ADD COLUMN is_published BOOLEAN NOT NULL DEFAULT TRUE;

-- Jeśli chcesz też mieć śledzenie zmian
-- (Supabase domyślnie nie dodaje triggerów)
-- dodaj aktualizację updated_at automatycznie:
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_on_chapters ON chapters;

CREATE TRIGGER set_updated_at_on_chapters
    BEFORE UPDATE ON chapters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
