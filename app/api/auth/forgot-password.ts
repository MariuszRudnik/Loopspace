import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } });
  }

  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });

    if (error) {
      console.error('Supabase Error:', error.message); // Logowanie błędu do konsoli
      return res.status(400).json({ error: { code: 'RESET_PASSWORD_FAILED', message: error.message } });
    }

    console.log(`Password reset email sent to: ${email}`); // Logowanie wysłania e-maila
    return res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (err: any) {
    console.error('Validation Error:', err); // Logowanie błędu walidacji
    return res.status(400).json({ error: { code: 'INVALID_INPUT', message: err.message ?? 'Unexpected error' } });
  }
}
