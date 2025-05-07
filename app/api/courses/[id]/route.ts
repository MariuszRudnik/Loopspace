import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Schemat walidacji dla PUT
const updateCourseSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  description: z.string().max(2000).optional(),
  thumbnail_url: z.string().url().optional(),
  is_public: z.boolean().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const courseId = params.id;
    const authToken = req.cookies.get('supabase-auth-token')?.value;
    if (!authToken) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Użytkownik niezalogowany' } },
        { status: 401 }
      );
    }
    const tokenPayload = JSON.parse(
      Buffer.from(authToken.split('.')[1], 'base64').toString('utf8')
    );
    const userId = tokenPayload.sub;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    // Sprawdź czy kurs istnieje i należy do użytkownika
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
        { error: { code: 'FORBIDDEN', message: 'Brak uprawnień do edycji kursu' } },
        { status: 403 }
      );
    }

    // Walidacja danych wejściowych
    const body = await req.json();
    const validation = updateCourseSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Nieprawidłowe dane wejściowe', details: validation.error.format() } },
        { status: 400 }
      );
    }

    // Aktualizacja kursu
    const { data: updated, error: updateError } = await supabase
      .from('courses')
      .update(validation.data)
      .eq('id', courseId)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas aktualizacji kursu:', error);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Wystąpił błąd serwera' } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const courseId = params.id;
    const authToken = req.cookies.get('supabase-auth-token')?.value;
    if (!authToken) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Użytkownik niezalogowany' } },
        { status: 401 }
      );
    }
    const tokenPayload = JSON.parse(
      Buffer.from(authToken.split('.')[1], 'base64').toString('utf8')
    );
    const userId = tokenPayload.sub;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    // Sprawdź czy kurs istnieje i należy do użytkownika
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
        { error: { code: 'FORBIDDEN', message: 'Brak uprawnień do usunięcia kursu' } },
        { status: 403 }
      );
    }

    // Usunięcie kursu
    const { error: deleteError } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (deleteError) throw deleteError;

    return NextResponse.json({ message: 'Kurs został usunięty' }, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas usuwania kursu:', error);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Wystąpił błąd serwera' } },
      { status: 500 }
    );
  }
}
