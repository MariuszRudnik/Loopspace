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

    // Dekodowanie tokenu JWT w celu pobrania id użytkownika (pole "sub")
    const tokenPayload = JSON.parse(Buffer.from(authToken.split('.')[1], 'base64').toString('utf8'));
    const userId = tokenPayload.sub;

    // Użytkownik zalogowany - odpowiedź zawiera komunikat i id użytkownika
    return NextResponse.json(
        { message: 'Użytkownik zalogowany', id: userId },
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

