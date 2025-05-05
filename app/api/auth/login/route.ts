import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { z } from 'zod';
import { cookies } from 'next/headers';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Dodanie obsługi OPTIONS dla CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    console.log('Otrzymano żądanie logowania');

    // Dodanie nagłówków CORS do odpowiedzi
    const responseHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json',
    };

    // Sprawdzenie poprawności zapytania
    if (!req.body) {
      console.error('Brak danych w zapytaniu');
      return NextResponse.json(
        { error: { code: 'MISSING_BODY', message: 'Brak danych w zapytaniu' } },
        { status: 400, headers: responseHeaders }
      );
    }

    // Parsowanie body z lepszą obsługą różnych formatów
    let body;
    try {
      body = await req.json();
      console.log('Sparsowane body zapytania', { email: body.email ? '***' : undefined });
    } catch (parseError) {
      console.error('Nie można sparsować body zapytania:', parseError);
      return NextResponse.json(
        { error: { code: 'INVALID_JSON', message: 'Nieprawidłowy format JSON' } },
        { status: 400, headers: responseHeaders }
      );
    }

    // Walidacja danych wejściowych
    try {
      const { email, password } = loginSchema.parse(body);

      // Próba logowania
      try {
        console.log('Próba logowania dla:', email);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          console.error('Błąd logowania Supabase:', error.message);
          return NextResponse.json(
            { error: { code: 'LOGIN_FAILED', message: error.message } },
            { status: 401, headers: responseHeaders }
          );
        }

        console.log('Logowanie udane dla:', email);

        // Sprawdzenie, czy istnieje profil użytkownika, jeżeli nie – dodanie nowego rekordu
        const userId = data.user.id;
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId);
        
        if (!profileError && (!profileData || profileData.length === 0)) {
          const { error: insertProfileError } = await supabase
            .from('profiles')
            .insert([{ id: userId, email }]); // dodano email dla nowego rekordu
          if (insertProfileError) {
            console.error('Błąd podczas tworzenia profilu:', insertProfileError);
            throw insertProfileError;
          }
        }

        // Utworzenie odpowiedzi
        const response = NextResponse.json(
          {
            message: 'Login successful',
            user: data.user,
          },
          { status: 200, headers: responseHeaders }
        );

        // Ustawienie ciasteczek sesji
        if (data.session) {
          // Ustawienie access token jako ciasteczko
          response.cookies.set({
            name: 'supabase-auth-token',
            value: data.session.access_token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: data.session.expires_in // czas życia w sekundach
          });

          // Opcjonalnie ustawienie refresh token
          response.cookies.set({
            name: 'supabase-auth-refresh-token',
            value: data.session.refresh_token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7
          });
          response.cookies.set({
            name: 'authenticated',
            value: 'true',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: data.session.expires_in
          });
        }

        return response;
      } catch (supabaseError: any) {
        console.error('Supabase auth error:', supabaseError);
        return NextResponse.json(
          {
            error: {
              code: 'SUPABASE_ERROR',
              message: supabaseError.message || 'Błąd uwierzytelniania Supabase',
            },
          },
          { status: 500, headers: responseHeaders }
        );
      }
    } catch (validationError: any) {
      console.error('Błąd walidacji:', validationError);
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Nieprawidłowy format danych logowania',
            details: validationError.errors,
          },
        },
        { status: 400, headers: responseHeaders }
      );
    }
  } catch (err: any) {
    console.error('Nieoczekiwany błąd:', err);
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: 'Wystąpił nieoczekiwany błąd serwera',
        },
      },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

