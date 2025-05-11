import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('supabase-auth-token')?.value;

    // Nawet jeśli tokenu nie ma, próbujemy wylogować dla pewności
    // i wyczyścić potencjalne pozostałości ciasteczek.
    const { error } = await supabase.auth.signOut();

    // Definiujemy typ odpowiedzi z opcjonalnym warning
    interface ResponseData {
      message: string;
      warning?: string;
    }
    
    // Usuwanie ciasteczek
    const responseData: ResponseData = { message: 'Wylogowanie zakończone sukcesem' };
    
    if (error) {
      console.warn('Błąd podczas wylogowywania z Supabase:', error.message);
      // Teraz możemy bezpiecznie dodać warning
      responseData.warning = 'Wystąpił błąd podczas wylogowywania z Supabase';
    }
    
    const response = NextResponse.json(responseData, { status: 200 });

    response.cookies.delete('supabase-auth-token');
    response.cookies.delete('supabase-auth-refresh-token');
    response.cookies.delete('authenticated');
    
    // Dodatkowe czyszczenie po stronie next/headers, jeśli jest używane
    cookieStore.delete('supabase-auth-token');
    cookieStore.delete('supabase-auth-refresh-token');
    cookieStore.delete('authenticated');

    return response;
  } catch (err) {
    console.error('Nieoczekiwany błąd podczas wylogowywania:', err);
    const response = NextResponse.json(
      { error: { code: 'LOGOUT_FAILED', message: 'Wystąpił nieoczekiwany błąd podczas wylogowywania' } },
      { status: 500 }
    );
    response.cookies.delete('supabase-auth-token');
    response.cookies.delete('supabase-auth-refresh-token');
    response.cookies.delete('authenticated');
    return response;
  }
}

