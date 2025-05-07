import { createClient } from '@supabase/supabase-js';

// Pobierz zmienne środowiskowe
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Sprawdź, czy zmienne środowiskowe są dostępne
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Brakujące zmienne środowiskowe Supabase. Sprawdź konfigurację .env.local');
}

// Utwórz i wyeksportuj klienta Supabase
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
