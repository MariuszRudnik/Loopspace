import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function DELETE(request: NextRequest) {
  try {
    // Pobranie tokenu sesji
    const authToken = request.cookies.get('supabase-auth-token')?.value;
    if (!authToken) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Użytkownik niezalogowany' } },
        { status: 401 }
      );
    }

    // Dekodowanie tokenu JWT w celu pobrania userId
    const tokenPayload = JSON.parse(
      Buffer.from(authToken.split('.')[1], 'base64').toString('utf8')
    );
    const userId = tokenPayload.sub;

    // Parsowanie danych z żądania
    const { channelId } = await request.json();
    if (!channelId || typeof channelId !== 'string') {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'channelId jest wymagany' } },
        { status: 400 }
      );
    }

    // Inicjalizacja klienta Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Pobranie kanału do weryfikacji właściciela
    const { data: channel, error: selectError } = await supabase
      .from('channels')
      .select('id, created_by')
      .eq('id', channelId)
      .maybeSingle();

    if (selectError) {
      throw selectError;
    }

    if (!channel) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Kanał nie znaleziony' } },
        { status: 404 }
      );
    }

    // Sprawdzenie, czy kanał należy do aktualnego użytkownika
    if (channel.created_by !== userId) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Nie masz uprawnień do usunięcia tego kanału' } },
        { status: 403 }
      );
    }

    // Usunięcie kanału
    const { error: deleteError } = await supabase
      .from('channels')
      .delete()
      .eq('id', channelId);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ message: 'Kanał usunięty pomyślnie' }, { status: 200 });
  } catch (error: any) {
    console.error('Błąd podczas usuwania kanału:', error);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Wystąpił błąd serwera' } },
      { status: 500 }
    );
  }
}
