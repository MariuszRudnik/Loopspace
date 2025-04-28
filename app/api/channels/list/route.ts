import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    // Pobranie tokenu sesji
    const authToken = req.cookies.get('supabase-auth-token')?.value;

    if (!authToken) {
      return NextResponse.json(
          { error: { code: 'UNAUTHORIZED', message: 'Użytkownik niezalogowany' } },
          { status: 401 }
      );
    }

    // Dekodowanie tokenu JWT i pobranie userId
    const tokenPayload = JSON.parse(
        Buffer.from(authToken.split('.')[1], 'base64').toString('utf8')
    );
    const userId = tokenPayload.sub;

    // Inicjalizacja klienta Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parsowanie danych z żądania
    const requestBody = await req.json();
    const { name, description } = requestBody;

    // Walidacja wymaganych pól
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
          { error: { code: 'INVALID_INPUT', message: 'Pole "name" jest wymagane i musi być tekstem' } },
          { status: 400 }
      );
    }

    // Dodanie kanału
    const { data: newChannel, error } = await supabase
        .from('channels')
        .insert([
          {
            name,
            description,
            created_by: userId,
          },
        ])
        .select()
        .single(); // zwraca tylko jeden nowo dodany rekord

    if (error) {
      throw error;
    }

    return NextResponse.json(newChannel, { status: 201 });
  } catch (error) {
    console.error('Błąd podczas dodawania kanału:', error);
    return NextResponse.json(
        { error: { code: 'SERVER_ERROR', message: 'Wystąpił błąd serwera' } },
        { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Pobranie tokenu sesji
    const authToken = req.cookies.get('supabase-auth-token')?.value;
    if (!authToken) {
      return NextResponse.json(
          { error: { code: 'UNAUTHORIZED', message: 'Użytkownik niezalogowany' } },
          { status: 401 }
      );
    }

    // Dekodowanie tokenu JWT i pobranie userId
    const tokenPayload = JSON.parse(
        Buffer.from(authToken.split('.')[1], 'base64').toString('utf8')
    );
    const userId = tokenPayload.sub;
    
    // Inicjalizacja klienta Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Pobranie kanałów danego użytkownika
    const { data: channels, error } = await supabase
      .from('channels')
      .select('*')
      .eq('created_by', userId);

    if (error) {
      throw error;
    }

    return NextResponse.json(channels, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas pobierania kanałów:', error);
    return NextResponse.json(
        { error: { code: 'SERVER_ERROR', message: 'Wystąpił błąd serwera' } },
        { status: 500 }
    );
  }
}
