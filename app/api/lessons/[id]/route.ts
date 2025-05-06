import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Schemat walidacji dla aktualizacji lekcji
const updateLessonSchema = z.object({
  title: z.string().min(3).max(255, { message: "Tytuł musi mieć od 3 do 255 znaków" }).optional(),
  content: z.string().max(10000, { message: "Zawartość nie może przekraczać 10000 znaków" }).optional(),
  order_number: z.number().int().positive({ message: "Numer porządkowy musi być liczbą dodatnią" }).optional(),
  is_published: z.boolean().optional(),
});

/**
 * GET /api/lessons/:id
 * Pobiera pojedynczą lekcję wraz z informacją o postępie użytkownika
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('GET lekcja:', id);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    // Pobieranie lekcji wraz z informacją o rozdziale i kursie
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select(`
        *,
        chapter:chapter_id (
          *,
          course:course_id (
            *
          )
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (lessonError) throw lessonError;
    if (!lesson) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Lekcja nie istnieje' } },
        { status: 404 }
      );
    }

    // Sprawdzanie uprawnień użytkownika
    const authToken = req.cookies.get('supabase-auth-token')?.value;
    let userId = null;
    let userProgress = null;

    if (authToken) {
      const tokenPayload = JSON.parse(Buffer.from(authToken.split('.')[1], 'base64').toString('utf8'));
      userId = tokenPayload.sub;

      // Jeżeli użytkownik jest zalogowany, pobierz jego postęp dla tej lekcji
      const { data: progress } = await supabase
        .from('progress')
        .select('*')
        .eq('lesson_id', id)
        .eq('user_id', userId)
        .maybeSingle();

      userProgress = progress;
    }

    // Sprawdzenie, czy kurs jest publiczny lub czy użytkownik ma do niego dostęp
    if (!lesson.chapter.course.is_public && lesson.chapter.course.created_by !== userId) {
      // Sprawdź, czy użytkownik jest zapisany na kurs
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', lesson.chapter.course_id)
        .eq('user_id', userId)
        .maybeSingle();

      if (!enrollment) {
        return NextResponse.json(
          { error: { code: 'FORBIDDEN', message: 'Brak dostępu do tej lekcji' } },
          { status: 403 }
        );
      }
    }

    // Zwróć lekcję wraz z informacją o postępie
    return NextResponse.json({
      ...lesson,
      progress: userProgress,
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
 * PUT /api/lessons/:id
 * Aktualizuje lekcję
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('PUT aktualizacja lekcji:', id);

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

    // Pobieranie lekcji, aby sprawdzić uprawnienia
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select(`
        *,
        chapter:chapter_id (
          course:course_id (
            created_by
          )
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (lessonError) throw lessonError;
    if (!lesson) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Lekcja nie istnieje' } },
        { status: 404 }
      );
    }

    // Sprawdzenie, czy użytkownik jest właścicielem kursu
    if (lesson.chapter.course.created_by !== userId) {
      // Tutaj można dodać sprawdzenie, czy użytkownik jest adminem
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Brak uprawnień do aktualizacji tej lekcji' } },
        { status: 403 }
      );
    }

    // Parsowanie i walidacja danych wejściowych
    const requestBody = await req.json();
    const validationResult = updateLessonSchema.safeParse(requestBody);
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

    const updates = validationResult.data;
    
    // Jeśli zmieniany jest numer porządkowy, sprawdź czy nie koliduje z istniejącym
    if (updates.order_number && updates.order_number !== lesson.order_number) {
      const { data: existingLesson } = await supabase
        .from('lessons')
        .select('id')
        .eq('chapter_id', lesson.chapter_id)
        .eq('order_number', updates.order_number)
        .neq('id', id) // Wykluczenie bieżącej lekcji
        .maybeSingle();

      if (existingLesson) {
        // Przesuwamy istniejące lekcje, aby zrobić miejsce
        const { data: lessonsToUpdate } = await supabase
          .from('lessons')
          .select('id, order_number')
          .eq('chapter_id', lesson.chapter_id)
          .gte('order_number', updates.order_number)
          .neq('id', id) // wykluczenie bieżącej lekcji
          .order('order_number', { ascending: false });

        // Aktualizacja kolejności lekcji
        if (lessonsToUpdate && lessonsToUpdate.length > 0) {
          for (const lessonToUpdate of lessonsToUpdate) {
            await supabase
              .from('lessons')
              .update({ order_number: lessonToUpdate.order_number + 1 })
              .eq('id', lessonToUpdate.id);
          }
        }
      }
    }

    // Aktualizacja lekcji
    const { data: updatedLesson, error: updateError } = await supabase
      .from('lessons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      if (updateError.code === '23505') {
        return NextResponse.json(
          {
            error: {
              code: 'DUPLICATE_ORDER_NUMBER',
              message: `Numer porządkowy ${updates.order_number} jest już zajęty w tym rozdziale.`,
            },
          },
          { status: 400 }
        );
      }
      throw updateError;
    }

    return NextResponse.json(updatedLesson);
  } catch (error: any) {
    console.error('Błąd podczas aktualizacji lekcji:', error);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Wystąpił błąd serwera', details: error?.message } },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/lessons/:id
 * Usuwa lekcję
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('DELETE lekcja:', id);

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

    // Pobieranie lekcji, aby sprawdzić uprawnienia i uzyskać niezbędne dane
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select(`
        *,
        chapter:chapter_id (
          course:course_id (
            created_by
          )
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (lessonError) throw lessonError;
    if (!lesson) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Lekcja nie istnieje' } },
        { status: 404 }
      );
    }

    // Sprawdzenie, czy użytkownik jest właścicielem kursu
    if (lesson.chapter.course.created_by !== userId) {
      // Tutaj można dodać sprawdzenie, czy użytkownik jest adminem
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Brak uprawnień do usunięcia tej lekcji' } },
        { status: 403 }
      );
    }

    // Usuwanie lekcji
    const { error: deleteError } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    // Po usunięciu przenumeruj pozostałe lekcje, aby zachować ciągłość
    const { data: remainingLessons } = await supabase
      .from('lessons')
      .select('id, order_number')
      .eq('chapter_id', lesson.chapter_id)
      .order('order_number', { ascending: true });
    
    if (remainingLessons && remainingLessons.length > 0) {
      for (let i = 0; i < remainingLessons.length; i++) {
        if (remainingLessons[i].order_number !== i + 1) {
          await supabase
            .from('lessons')
            .update({ order_number: i + 1 })
            .eq('id', remainingLessons[i].id);
        }
      }
    }

    return NextResponse.json(
      { message: 'Lekcja została usunięta pomyślnie' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Błąd podczas usuwania lekcji:', error);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Wystąpił błąd serwera', details: error?.message } },
      { status: 500 }
    );
  }
}
