import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { randomUUID } from 'crypto';

const chapterSchema = z.object({
  title: z.string().min(3).max(255, { message: "Tytuł musi mieć od 3 do 255 znaków" }),
  order_number: z.number().int().positive({ message: "Numer porządkowy musi być liczbą dodatnią" }).optional(),
  is_published: z.boolean().default(true).optional(),
});

// 🔽 GET – pobierz rozdziały dla kursu
export async function GET(
    req: NextRequest,
    { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
    console.log('GET rozdziały – params:', courseId);

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 100);

    const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('id, is_public, created_by')
        .eq('id', courseId)
        .maybeSingle();

    if (courseError) throw courseError;
    if (!course) {
      return NextResponse.json(
          { error: { code: 'NOT_FOUND', message: 'Kurs nie istnieje' } },
          { status: 404 }
      );
    }

    const authToken = req.cookies.get('supabase-auth-token')?.value;
    let userId = null;
    if (authToken) {
      const tokenPayload = JSON.parse(Buffer.from(authToken.split('.')[1], 'base64').toString('utf8'));
      userId = tokenPayload.sub;
    }

    if (!course.is_public && course.created_by !== userId) {
      return NextResponse.json(
          { error: { code: 'FORBIDDEN', message: 'Brak dostępu do tego kursu' } },
          { status: 403 }
      );
    }

    const { data: chapters, count, error: chaptersError } = await supabase
        .from('chapters')
        .select('*', { count: 'exact' })
        .eq('course_id', courseId)
        .order('order_number', { ascending: true })
        .range((page - 1) * limit, page * limit - 1);

    if (chaptersError) throw chaptersError;

    return NextResponse.json({
      data: chapters,
      meta: {
        total: count ?? 0,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('Błąd podczas pobierania rozdziałów:', error);
    return NextResponse.json(
        { error: { code: 'SERVER_ERROR', message: 'Wystąpił błąd serwera' } },
        { status: 500 }
    );
  }
}

// 🔼 POST – dodaj nowy rozdział
export async function POST(
    req: NextRequest,
    { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
    console.log('Dodawanie rozdziału do kursu:', courseId);

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

    const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('id, created_by')
        .eq('id', courseId)
        .maybeSingle();

    if (courseError) throw courseError;
    if (!course) {
      return NextResponse.json(
          { error: { code: 'NOT_FOUND', message: 'Kurs nie istnieje' } },
          { status: 404 }
      );
    }
    if (course.created_by !== userId) {
      return NextResponse.json(
          { error: { code: 'FORBIDDEN', message: 'Brak uprawnień do dodawania rozdziałów do tego kursu' } },
          { status: 403 }
      );
    }

    const requestBody = await req.json();
    const validationResult = chapterSchema.safeParse(requestBody);
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

    const { title, is_published } = validationResult.data;
    let { order_number } = validationResult.data;

    // Ustal numer porządkowy automatycznie, jeśli nie podano
    if (!order_number) {
      const { data: lastChapter } = await supabase
          .from('chapters')
          .select('order_number')
          .eq('course_id', courseId)
          .order('order_number', { ascending: false })
          .limit(1)
          .single();

      order_number = lastChapter ? lastChapter.order_number + 1 : 1;
    }

    const chapterId = randomUUID();

    const { data: newChapter, error: insertError } = await supabase
        .from('chapters')
        .insert([
          {
            id: chapterId,
            title,
            order_number,
            is_published: is_published ?? true,
            course_id: courseId,
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
                message: `Numer porządkowy ${order_number} jest już zajęty w tym kursie.`,
              },
            },
            { status: 400 }
        );
      }

      throw insertError;
    }

    return NextResponse.json(newChapter, { status: 201 });
  } catch (error: any) {
    console.error('Błąd podczas tworzenia rozdziału:', error);
    return NextResponse.json(
        {
          error: {
            code: 'SERVER_ERROR',
            message: 'Wystąpił błąd serwera',
            details: error?.message ?? error,
          },
        },
        { status: 500 }
    );
  }
}
