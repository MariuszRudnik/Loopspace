import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(3).max(50),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, displayName } = registerSchema.parse(body);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return NextResponse.json(
        { error: { code: 'SIGNUP_FAILED', message: error.message } },
        { status: 400 }
      );
    }

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', data.user?.id)
      .single();

    if (!existingProfile) {
      const profileInsert = await supabase
        .from('profiles')
        .insert({ id: data.user?.id, email, display_name: displayName });

      if (profileInsert.error) {
        return NextResponse.json(
          { error: { code: 'PROFILE_INSERT_FAILED', message: profileInsert.error.message } },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: 'INVALID_INPUT', message: err.message ?? 'Unexpected error' } },
      { status: 400 }
    );
  }
}

