import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabaseClient';  // Importuję już istniejący klient Supabase

export async function DELETE(request: NextRequest) {
  try {
    // Pobranie tokenu użytkownika z ciasteczek
    const cookieStore = await cookies();
    const authToken = cookieStore.get('supabase-auth-token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Użytkownik niezalogowany' } },
        { status: 401 }
      );
    }

    // Używam istniejącego klienta Supabase zamiast tworzyć nowy
    // Dzięki temu unikam problemu z brakiem zmiennych środowiskowych
    
    // Zamiast używać jsonwebtoken, użyjemy Supabase do uzyskania ID użytkownika
    const { data: userData, error: userError } = await supabase.auth.getUser(authToken);
    
    if (userError || !userData || !userData.user) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Nieprawidłowy token' } },
        { status: 401 }
      );
    }

    const userId = userData.user.id;
    
    // Pobranie danych z żądania
    const { channelId } = await request.json();
    
    if (!channelId) {
      return NextResponse.json(
        { error: { code: 'MISSING_CHANNEL_ID', message: 'Brak ID kanału' } },
        { status: 400 }
      );
    }

    // Sprawdzenie, czy kanał istnieje i należy do użytkownika
    const { data: channel, error: channelError } = await supabase
      .from('channels')
      .select('*')
      .eq('id', channelId)
      .single();

    if (channelError || !channel) {
      return NextResponse.json(
        { error: { code: 'CHANNEL_NOT_FOUND', message: 'Kanał nie został znaleziony' } },
        { status: 404 }
      );
    }

    if (channel.created_by !== userId) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Brak uprawnień do usunięcia tego kanału' } },
        { status: 403 }
      );
    }

    // NOWA LOGIKA - Najpierw usunąć wszystkie kursy powiązane z kanałem
    // 1. Znajdź wszystkie kursy powiązane z kanałem
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id')
      .eq('channel_id', channelId);
    
    if (coursesError) {
      console.error('Błąd podczas pobierania kursów:', coursesError);
      return NextResponse.json(
        { error: { code: 'FETCH_COURSES_ERROR', message: 'Błąd podczas pobierania powiązanych kursów' } },
        { status: 500 }
      );
    }

    // 2. Dla każdego kursu potencjalnie trzeba usunąć również jego zawartość (rozdziały, lekcje)
    for (const course of courses || []) {
      // Opcjonalnie: usuwanie rozdziałów i lekcji kursu
      // Jeśli masz kaskadowe usuwanie w bazie danych, to ten krok może nie być potrzebny
    }

    // 3. Usuń wszystkie kursy związane z kanałem
    if (courses && courses.length > 0) {
      const { error: deleteCoursesError } = await supabase
        .from('courses')
        .delete()
        .eq('channel_id', channelId);
      
      if (deleteCoursesError) {
        console.error('Błąd podczas usuwania kursów:', deleteCoursesError);
        return NextResponse.json(
          { error: { code: 'DELETE_COURSES_ERROR', message: 'Błąd podczas usuwania powiązanych kursów' } },
          { status: 500 }
        );
      }
    }

    // Teraz możemy bezpiecznie usunąć kanał
    const { error: deleteError } = await supabase
      .from('channels')
      .delete()
      .eq('id', channelId);

    if (deleteError) {
      console.error('Błąd podczas usuwania kanału:', deleteError);
      return NextResponse.json(
        { error: { code: 'DELETE_CHANNEL_ERROR', message: 'Błąd podczas usuwania kanału' } },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Kanał został pomyślnie usunięty' }, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas usuwania kanału:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Wystąpił wewnętrzny błąd serwera' } },
      { status: 500 }
    );
  }
}

