import { NextResponse } from "next/server";

export async function POST(request: Request) {
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

    // Stały base URL z pełną ścieżką API
    const baseUrl = "https://openrouter.ai/api/v1";
    const defaultModel = process.env.OPENROUTER_DEFAULT_MODEL || "deepseek/deepseek-r1:free";

    const payload = {
      model: defaultModel,
      messages: body.messages,
    };

    // Nie dodajemy ponownie /api/v1, bo już jest w baseUrl
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.YOUR_SITE_URL || "http://localhost",
        "X-Title": process.env.YOUR_SITE_NAME || "Loopspace",
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      return NextResponse.json(
          {
            error: {
              code: response.status.toString(),
              message: "Odpowiedź z OpenRouter nie jest w formacie JSON. Upewnij się, że endpoint to /api/v1/chat/completions oraz że klucz API jest poprawny.",
              details: text.slice(0, 300),
            },
          },
          { status: response.status }
      );
    }

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
          { error: errorData },
          { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Błąd w /api/chat:", error);
    return NextResponse.json(
        { error: { code: "500", message: "Błąd serwera." } },
        { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
      { status: "ok", message: "Endpoint działa. Użyj POST, aby rozmawiać z chatem." },
      { status: 200 }
  );
}
