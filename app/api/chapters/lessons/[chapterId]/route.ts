import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { randomUUID } from 'crypto';

// Schemat walidacji dla tworzenia nowej lekcji
const lessonSchema = z.object({
  title: z.string().min(3).max(255, { message: "Tytuł musi mieć od 3 do 255 znaków" }),
  content: z.string().max(10000, { message: "Zawartość nie może przekraczać 10000 znaków" }).optional(),
  order_number: z.number().int().positive({ message: "Numer porządkowy musi być liczbą dodatnią" }).optional(),
  is_published: z.boolean().default(true).optional(),
});

/**
 * GET /api/chapters/lessons/[chapterId]
 * Pobiera listę lekcji dla danego rozdziału
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    const { chapterId } = params;
    console.log('GET lekcje dla rozdziału:', chapterId);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    // Parametry paginacji
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 100);

    // Pobranie informacji o rozdziale i powiązanym kursie (do sprawdzenia uprawnień)
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('*, course:course_id (*)')
      .eq('id', chapterId)
      .maybeSingle();

    if (chapterError) throw chapterError;
    if (!chapter) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Rozdział nie istnieje' } },
        { status: 404 }
      );
    }

    // Sprawdzanie uprawnień użytkownika
    const authToken = req.cookies.get('supabase-auth-token')?.value;
    let userId = null;
    if (authToken) {
      const tokenPayload = JSON.parse(Buffer.from(authToken.split('.')[1], 'base64').toString('utf8'));
      userId = tokenPayload.sub;
    }

    // Sprawdzenie, czy użytkownik ma dostęp do kursu
    if (!chapter.course.is_public && chapter.course.created_by !== userId) {
      // Tutaj można dodać sprawdzanie, czy użytkownik jest zapisany na kurs
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', chapter.course_id)
        .eq('user_id', userId)
        .maybeSingle();

      if (!enrollment) {
        return NextResponse.json(
          { error: { code: 'FORBIDDEN', message: 'Brak dostępu do tego kursu' } },
          { status: 403 }
        );
      }
    }

    // Pobieranie lekcji z paginacją
    const { data: lessons, count, error: lessonsError } = await supabase
      .from('lessons')
      .select('*', { count: 'exact' })
      .eq('chapter_id', chapterId)
      .order('order_number', { ascending: true })
      .range((page - 1) * limit, page * limit - 1);

    if (lessonsError) throw lessonsError;

    return NextResponse.json({
      data: lessons || [],
      meta: {
        total: count ?? 0,
        page,
        limit,
      },
    });
  } catch (error: any) {
    console.error('Błąd podczas pobierania lekcji:', error);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Wystąpił błąd serwera', details: error?.message } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chapters/lessons/[chapterId]
 * Dodaje nową lekcję do rozdziału
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    const { chapterId } = params;
    console.log('Dodawanie lekcji do rozdziału:', chapterId);

    // Walidacja uwierzytelnienia
    const authToken = req.cookies.get('supabase-auth-token')?.value;
    if (!authToken) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Użytkownik niezalogowany' } },
        { status: 401 }
      );
    }
    const tokenPayload = JSON.parse(Buffer.from(authToken.split('.')[1], 'base64').toString('utf8'));
    const userId = tokenPayload.sub;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    // Pobranie informacji o rozdziale i powiązanym kursie (do sprawdzenia uprawnień)
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('*, course:course_id (*)')
      .eq('id', chapterId)
      .maybeSingle();

    if (chapterError) throw chapterError;
    if (!chapter) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Rozdział nie istnieje' } },
        { status: 404 }
      );
    }

    // Sprawdzenie, czy użytkownik jest właścicielem kursu
    if (chapter.course.created_by !== userId) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Brak uprawnień do dodawania lekcji do tego rozdziału' } },
        { status: 403 }
      );
    }

    // Parsowanie i walidacja danych wejściowych
    const requestBody = await req.json();
    const validationResult = lessonSchema.safeParse(requestBody);
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

    const { title, content, is_published } = validationResult.data;
    let { order_number } = validationResult.data;

    // Automatyczne ustalanie numeru porządkowego, jeśli nie został podany
    if (!order_number) {
      const { data: lastLesson } = await supabase
        .from('lessons')
        .select('order_number')
        .eq('chapter_id', chapterId)
        .order('order_number', { ascending: false })
        .limit(1)
        .maybeSingle();

      order_number = lastLesson ? lastLesson.order_number + 1 : 1;
    } else {
      // Sprawdzenie, czy numer porządkowy jest już używany
      const { data: existingLesson } = await supabase
        .from('lessons')
        .select('id')
        .eq('chapter_id', chapterId)
        .eq('order_number', order_number)
        .maybeSingle();

      if (existingLesson) {
        // Przesunięcie istniejących lekcji - naprawione (usunięto supabase.raw)
        const { data: lessonsToUpdate } = await supabase
          .from('lessons')
          .select('id, order_number')
          .eq('chapter_id', chapterId)
          .gte('order_number', order_number)
          .order('order_number', { ascending: false });

        // Aktualizacja każdej lekcji oddzielnie
        if (lessonsToUpdate && lessonsToUpdate.length > 0) {
          for (const lesson of lessonsToUpdate) {
            await supabase
              .from('lessons')
              .update({ order_number: lesson.order_number + 1 })
              .eq('id', lesson.id);
          }
        }
      }
    }

    // Tworzenie nowej lekcji
    const lessonId = randomUUID();
    const { data: newLesson, error: insertError } = await supabase
      .from('lessons')
      .insert([
        {
          id: lessonId,
          title,
          content: content || '',
          order_number,
          is_published: is_published ?? true,
          chapter_id: chapterId,
          created_by: userId,
        },
      ])
      .select()
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json(
          {
            error: {
              code: 'DUPLICATE_ORDER_NUMBER',
              message: `Numer porządkowy ${order_number} jest już zajęty w tym rozdziale.`,
            },
          },
          { status: 400 }
        );
      }
      throw insertError;
    }

    return NextResponse.json(newLesson, { status: 201 });
  } catch (error: any) {
    console.error('Błąd podczas dodawania lekcji:', error);
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: 'Wystąpił błąd serwera',
          details: error?.message || String(error),
        },
      },
      { status: 500 }
    );
  }
}

