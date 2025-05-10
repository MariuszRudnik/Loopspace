import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  // Poprawne pobieranie cookies w Next.js 15 (asynchronicznie)
  const cookieStore = await cookies();
  const authToken = cookieStore.get('supabase-auth-token')?.value;

  if (!authToken) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Użytkownik niezalogowany' } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
          { error: { code: "400", message: "Invalid payload. 'messages' must be an array." } },
          { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
          { error: { code: "401", message: "Brak klucza OPENROUTER_API_KEY w zmiennych środowiskowych." } },
          { status: 401 }
      );
    }

    const baseUrl = "https://openrouter.ai/api/v1";
    const defaultModel = process.env.OPENROUTER_DEFAULT_MODEL || "deepseek/deepseek-r1:free";

    const payload = {
      model: defaultModel,
      messages: body.messages,
    };

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application