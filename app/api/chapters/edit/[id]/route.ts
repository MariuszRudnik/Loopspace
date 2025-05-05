import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const putChapterSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  order_number: z.number().int().positive().optional(),
  is_published: z.boolean().optional(),
});

// #### PUT /api/chapters/edit/:id – Aktualizacja rozdziału 
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    console.log('PUT /api/chapters/edit/:id, id:', id);

    // Pobieranie tokenu sesji z cookies i ekstrakcja userId
    const authToken = req.cookies.get('supabase-auth-token')?.value;
    if (!authToken) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Użytkownik niezalogowany' } }, { status: 401 });
    }
    const tokenPayload = JSON.parse(Buffer.from(authToken.split('.')[1], 'base64').toString('utf8'));
    const userId = tokenPayload.sub;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    // Pobieranie rozdziału wraz z danymi kursu, aby zweryfikować uprawnienia użytkownika
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('*, course:course_id ( created_by )')
      .eq('id', id)
      .maybeSingle();
    if (chapterError) throw chapterError;
    if (!chapter) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Rozdział nie istnieje' } }, { status: 404 });
    }
    if (chapter.course.created_by !== userId) {
      return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Brak uprawnień do aktualizacji tego rozdziału' } }, { status: 403 });
    }

    const requestBody = await req.json();
    const validationResult = putChapterSchema.safeParse(requestBody);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Nieprawidłowe dane wejściowe', details: validationResult.error.format() } },
        { status: 400 }
      );
    }

    const { data: updatedChapter, error: updateError } = await supabase
      .from('chapters')
      .update(validationResult.data)
      .eq('id', id)
      .select()
      .single();
    if (updateError) throw updateError;

    return NextResponse.json(updatedChapter, { status: 200 });
  } catch (error: any) {
    console.error('Błąd podczas aktualizacji rozdziału:', error);
    return NextResponse.json({ error: { code: 'SERVER_ERROR', message: error?.message || error } }, { status: 500 });
  }
}

// #### DELETE /api/chapters/edit/:id – Usunięcie rozdziału
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    console.log('DELETE /api/chapters/edit/:id, id:', id);

    // Pobieranie tokenu sesji z cookies i ekstrakcja userId
    const authToken = req.cookies.get('supabase-auth-token')?.value;
    if (!authToken) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Użytkownik niezalogowany' } }, { status: 401 });
    }
    const tokenPayload = JSON.parse(Buffer.from(authToken.split('.')[1], 'base64').toString('utf8'));
    const userId = tokenPayload.sub;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    // Pobieranie rozdziału wraz z danymi kursu, aby sprawdzić uprawnienia użytkownika
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('*, course:course_id ( created_by )')
      .eq('id', id)
      .maybeSingle();
    if (chapterError) throw chapterError;
    if (!chapter) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Rozdział nie istnieje' } }, { status: 404 });
    }
    if (chapter.course.created_by !== userId) {
      return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Brak uprawnień do usunięcia tego rozdziału' } }, { status: 403 });
    }

    const { error: deleteError } = await supabase
      .from('chapters')
      .delete()
      .eq('id', id);
    if (deleteError) throw deleteError;

    return NextResponse.json({ message: 'Rozdział został usunięty' }, { status: 200 });
  } catch (error: any) {
    console.error('Błąd podczas usuwania rozdziału:', error);
    return NextResponse.json({ error: { code: 'SERVER_ERROR', message: error?.message || error } }, { status: 500 });
  }
}
