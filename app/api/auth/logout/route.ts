import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('sb-access-token')?.value;

    // Nawet jeśli tokenu nie ma, próbujemy wylogować dla pewności
    // i wyczyścić potencjalne pozostałości ciasteczek.
    const { error } = await supabase.auth.signOut();

    // Zmieniony format odpowiedzi zgodny z testami
    const responseData = { success: true };
    
    if (error) {
      console.warn('Błąd podczas wylogowywania z Supabase:', error.message);
      // W przypadku błędu nadal zwracamy success: true, ale logujemy błąd
    }
    
    const response = NextResponse.json(responseData, { status: 200 });

    // Zaktualizowane nazwy ciasteczek
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    response.cookies.delete('authenticated');
    
    // Dodatkowe czyszczenie po stronie next/headers, jeśli jest używane
    cookieStore.delete('sb-access-token');
    cookieStore.delete('sb-refresh-token');
    cookieStore.delete('authenticated');

    return response;
  } catch (err) {
    console.error('Nieoczekiwany błąd podczas wylogowywania:', err);
    const response = NextResponse.json(
      { error: { code: 'LOGOUT_FAILED', message: 'Wystąpił nieoczekiwany błąd podczas wylogowywania' } },
      { status: 500 }
    );
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    response.cookies.delete('authenticated');
    return response;
  }
}
