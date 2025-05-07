import { NextRequest, NextResponse } from 'next/server';

// Nagłówki CORS - pozwalają na dostęp z innych domen
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// Obsługa zapytań preflight CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Główna funkcja obsługująca wylogowanie użytkownika
export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json(
      { message: 'Wylogowano pomyślnie', success: true },
      { status: 200, headers: corsHeaders }
    );

    // Lista wszystkich ciasteczek związanych z autoryzacją Supabase
    const authCookies = [
      'sb-access-token',
      'sb-refresh-token',
      'sb:token',
      'supabase-auth-token',
      'supabase-auth-refresh-token',
      '__session',
      'sb-provider-token'
    ];

    // Usunięcie wszystkich ciasteczek autoryzacyjnych
    authCookies.forEach(cookieName => {
      // Ustawienie daty wygaśnięcia w przeszłości powoduje usunięcie ciasteczka
      response.cookies.set({
        name: cookieName,
        value: '',
        expires: new Date(0),
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax'
      });
    });

    return response;
  } catch (error) {
    console.error('Błąd podczas wylogowywania:', error);
    return NextResponse.json(
      { message: 'Wystąpił błąd podczas wylogowywania', success: false },
      { status: 500, headers: corsHeaders }
    );
  }
}
