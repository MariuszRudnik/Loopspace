import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Schemat walidacji danych wejściowych
const channelSchema = z.object({
  name: z.string().min(1, { message: "Nazwa kanału jest wymagana" }),
  description: z.string().optional(),
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
    console.log(userId)

    // 3. Inicjalizacja klienta Supabase
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    // // 4. Sprawdzenie, czy profil istnieje — jeśli nie, to go tworzymy
    // const { data: existingProfile } = await supabase
    //     .from('profiles')
    //     .select('id')
    //     .eq('id', userId)
    //     .maybeSingle();
    //
    // if (!existingProfile) {
    //   const { error: insertProfileError } = await supabase
    //       .from('profiles')
    //       .insert([{ id: userId }]);
    //
    //   if (insertProfileError) {
    //     console.error('Błąd podczas tworzenia profilu:', insertProfileError);
    //     throw insertProfileError;
    //   }
    // }

    // 5. Parsowanie i walidacja danych wejściowych
    const requestBody = await req.json();
    const validationResult = channelSchema.safeParse(requestBody);

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

    const { name, description } = validationResult.data;

    // 6. Dodanie nowego kanału do tabeli
    const { data: newChannel, error: insertError } = await supabase
        .from('channels')
        .insert([
          {
            name,
            description,
            created_by: userId,
          },
        ])
        .select()
        .single();

    if (insertError) {
      console.error('Błąd podczas dodawania kanału:', insertError);
      throw insertError;
    }

    // 7. Zwrócenie dodanego kanału
    return NextResponse.json(newChannel, { status: 201 });

  } catch (error) {
    console.error('Błąd podczas tworzenia kanału:', error);
    return NextResponse.json(
        { error: { code: 'SERVER_ERROR', message: 'Wystąpił błąd serwera' } },
        { status: 500 }
    );
  }
}
