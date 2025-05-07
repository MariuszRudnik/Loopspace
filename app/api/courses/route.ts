import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { randomUUID } from 'crypto'; // dodano import

// Schemat walidacji danych wejściowych
const courseSchema = z.object({
  title: z.string().min(3).max(255, { message: "Tytuł musi mieć od 3 do 255 znaków" }),
  description: z.string().max(2000, { message: "Opis nie może przekraczać 2000 znaków" }).optional(),
  thumbnail_url: z.string().url({ message: "Nieprawidłowy format URL" }).optional(),
  is_public: z.boolean().default(false).optional(),
  channelId: z.string().uuid({ message: "channelId musi być poprawnym UUID" })
});

export async function POST(req: NextRequest) {
  try {
    // 1. Pobranie tokenu sesji
    const authToken = req.cookies.get('supabase-auth-token')?.value;
    if (!authToken) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Użytkownik niezalogowany' } },
        { status: 401 }
      );
    }

    // 2. Dekodowanie JWT i pobranie userId
    const tokenPayload = JSON.parse(
      Buffer.from(authToken.split('.')[1], 'base64').toString('utf8')
    );
    const userId = tokenPayload.sub;

    // 3. Inicjalizacja klienta Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    // 4. Parsowanie i walidacja danych wejściowych
    const requestBody = await req.json();
    const validationResult = courseSchema.safeParse(requestBody);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Nieprawidłowe dane wejściowe',
            details: validationResult.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const { title, description, thumbnail_url, is_public, channelId } = validationResult.data;

    // 5. Sprawdzenie, czy użytkownik ma dostęp do kanału
    const { data: channel, error: channelError } = await supabase
      .from('channels')
      .select('id, created_by')
      .eq('id', channelId)
      .maybeSingle();

    if (channelError) {
      console.error('Błąd podczas sprawdzania kanału:', channelError);
      throw channelError;
    }

    if (!channel) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Kanał nie istnieje' } },
        { status: 404 }
      );
    }

    // 6. Sprawdzenie, czy użytkownik jest właścicielem kanału
    if (channel.created_by !== userId) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Nie masz uprawnień do dodawania kursów do tego kanału' } },
        { status: 403 }
      );
    }

    // 7. Dodanie nowego kursu do tabeli
    const newCourseId = randomUUID(); // generowanie UUID

    const { data: newCourse, error: insertError } = await supabase
      .from('courses')
      .insert([
        {
          id: newCourseId, // przekazujemy id
          title,
          description,
          thumbnail_url,
          is_public: is_public ?? false,
          channel_id: channelId,
          created_by: userId,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Błąd podczas dodawania kursu:', insertError);
      throw insertError;
    }

    // 8. Zwrócenie dodanego kursu
    return NextResponse.json(newCourse, { status: 201 });

  } catch (error) {
    console.error('Błąd podczas tworzenia kursu:', error);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Wystąpił błąd serwera' } },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    // Parsowanie query params
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 100);
    const is_public = searchParams.get('is_public');
    const channelId = searchParams.get('channelId');

    let query = supabase
      .from('courses')
      .select('*', { count: 'exact' })
      .range((page - 1) * limit, page * limit - 1);

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }
    if (typeof is_public === 'string') {
      query = query.eq('is_public', is_public === 'true');
    }
    if (channelId) {
      query = query.eq('channel_id', channelId);
    }

    const { data, count, error } = await query;

    if (error) {
      console.error('Błąd pobierania kursów:', error);
      return NextResponse.json(
        { error: { code: 'SERVER_ERROR', message: 'Błąd pobierania kursów' } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      meta: {
        total: count ?? 0,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('Błąd podczas pobierania kursów:', error);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Wystąpił błąd serwera' } },
      { status: 500 }
    );
  }
}
