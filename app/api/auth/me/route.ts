import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Pobranie ciasteczka sesji
    const authToken = req.cookies.get('supabase-auth-token')?.value;

    if (!authToken) {
      // Brak ciasteczka - użytkownik niezalogowany
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Użytkownik niezalogowany' } },
        { status: 401 }
      );
    }

    // Użytkownik zalogowany
    return NextResponse.json(
      { message: 'Użytkownik zalogowany' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Błąd podczas sprawdzania sesji:', error);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Wystąpił błąd serwera' } },
      { status: 500 }
    );
  }
}
