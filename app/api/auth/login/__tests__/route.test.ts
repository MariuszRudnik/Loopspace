import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { POST } from '../route';

// Mockowanie zależności
vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server');
  return {
    ...actual,
    NextResponse: {
      json: vi.fn((data, options) => ({
        data,
        ...options,
        cookies: {
          set: vi.fn()
        }
      }))
    }
  };
});

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn()
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    insert: vi.fn()
  }
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn()
  }))
}));

// Import mokowanych zależności
import { supabase } from '@/lib/supabaseClient';

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('1. Test poprawnego logowania użytkownika', async () => {
    // Arrange
    // Rozszerzony mockUser zgodny z typem User
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      role: '',
      updated_at: new Date().toISOString(),
    };

    // Rozszerzony mockSession zgodny z typem Session
    const mockSession = {
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
      user: mockUser  // dodanie referencji do użytkownika
    };

    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    }) as unknown as NextRequest;

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null
    });

    // @ts-ignore
    vi.mocked(supabase.from).mockImplementation((table) => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({
        data: [{ id: 'user-123', email: 'test@example.com' }],
        error: null
      })
    }));

    // Act
    await POST(request);

    // Assert
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: 'Login successful',
        user: mockUser
      },
      expect.objectContaining({ status: 200 })
    );

    // Sprawdzenie czy cookies zostały ustawione
    const responseMock = (NextResponse.json as any).mock.results[0].value;
    expect(responseMock.cookies.set).toHaveBeenCalledTimes(3);
  });

  it('2. Test niepoprawnych danych logowania', async () => {
    // Arrange
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrong-password'
      })
    }) as unknown as NextRequest;

    // @ts-ignore
    // @ts-ignore
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { session: null, user: null },
      error: {
        message: 'Invalid login credentials',
        code: 'auth/invalid-login-credentials',
        status: 401,
        __isAuthError: true,
        name: 'AuthApiError'
      }
    });

    // Act
    await POST(request);

    // Assert
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: { code: 'LOGIN_FAILED', message: 'Invalid login credentials' } },
      expect.objectContaining({ status: 401 })
    );
  });

  it('3. Test nieprawidłowego formatu danych', async () => {
    // Arrange
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'not-valid-email',
        password: '12345' // za krótkie hasło
      })
    }) as unknown as NextRequest;

    // Act
    await POST(request);

    // Assert
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'VALIDATION_ERROR'
        })
      }),
      expect.objectContaining({ status: 400 })
    );

    // Upewniamy się, że nawet nie próbowaliśmy się logować
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it('4. Test braku wymaganych pól', async () => {
    // Arrange
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        // Brak email i password
      })
    }) as unknown as NextRequest;

    // Act
    await POST(request);

    // Assert
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'VALIDATION_ERROR'
        })
      }),
      expect.objectContaining({ status: 400 })
    );
  });

  it('5. Test obsługi błędów Supabase', async () => {
    // Arrange
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    }) as unknown as NextRequest;

    // Symulacja błędu połączenia z Supabase
    vi.mocked(supabase.auth.signInWithPassword).mockImplementation(() => {
      throw new Error('Connection error');
    });

    // Act
    await POST(request);

    // Assert
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'SUPABASE_ERROR'
        })
      }),
      expect.objectContaining({ status: 500 })
    );
  });

  it('6. Test ustawiania cookies po pomyślnym logowaniu', async () => {
    // Arrange
    // Rozszerzony mockUser zgodny z typem User
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      role: '',
      updated_at: new Date().toISOString(),
    };

    // Rozszerzony mockSession zgodny z typem Session
    const mockSession = {
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
      user: mockUser  // dodanie referencji do użytkownika
    };

    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    }) as unknown as NextRequest;

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null
    });

    // @ts-ignore
    vi.mocked(supabase.from).mockImplementation((table) => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({
        data: [{ id: 'user-123', email: 'test@example.com' }],
        error: null
      })
    }));

    // Act
    await POST(request);

    // Assert
    const responseMock = (NextResponse.json as any).mock.results[0].value;

    // Sprawdzenie czy cookies zostały ustawione poprawnie
    expect(responseMock.cookies.set).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'supabase-auth-token',
        value: 'test-access-token',
        httpOnly: true
      })
    );

    expect(responseMock.cookies.set).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'supabase-auth-refresh-token',
        value: 'test-refresh-token',
        httpOnly: true
      })
    );

    expect(responseMock.cookies.set).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'authenticated',
        value: 'true'
      })
    );
  });

  it('7. Test tworzenia profilu użytkownika jeśli nie istnieje', async () => {
    // Arrange
    // Rozszerzony mockUser zgodny z typem User
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      role: '',
      updated_at: new Date().toISOString(),
    };

    // Rozszerzony mockSession zgodny z typem Session
    const mockSession = {
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
      user: mockUser
    };

    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    }) as unknown as NextRequest;

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null
    });

    // Tworzenie mocków z możliwością śledzenia wywołań
    const insertMock = vi.fn().mockResolvedValue({
      data: { id: 'user-123', email: 'test@example.com' },
      error: null
    });

    const selectEqMock = vi.fn().mockResolvedValue({
      data: [], // Pusty wynik - profil nie istnieje
      error: null
    });

    // Mock supabase.from z wszystkimi wymaganymi metodami
    vi.mocked(supabase.from).mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          select: () => ({
            eq: selectEqMock
          }),
          insert: insertMock,
          // Dodajemy wymagane właściwości aby zaspokoić TypeScript
          url: '',
          headers: {},
          upsert: vi.fn(),
          update: vi.fn(),
          delete: vi.fn(),
          rpc: vi.fn(),
          // Wszelkie inne wymagane metody
          eq: vi.fn(),
          neq: vi.fn(),
          gt: vi.fn(),
          lt: vi.fn(),
          gte: vi.fn(),
          lte: vi.fn(),
          order: vi.fn(),
          limit: vi.fn()
        } as any;  // użycie 'as any' jako ostateczność do obejścia typowania
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        insert: vi.fn(),
        // Dodanie pustych implementacji dla innych metod
        url: '',
        headers: {},
        upsert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        rpc: vi.fn()
      } as any;
    });

    // Act
    await POST(request);

    // Assert
    // Sprawdzamy czy został wykonany select do sprawdzenia profilu
    expect(supabase.from).toHaveBeenCalledWith('profiles');

    // Sprawdzamy czy została wywołana operacja insert dla utworzenia profilu
    expect(insertMock).toHaveBeenCalledWith([
      { id: 'user-123', email: 'test@example.com' }
    ]);

    // Sprawdzamy czy odpowiedź jest poprawna
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: 'Login successful',
        user: mockUser
      },
      expect.objectContaining({ status: 200 })
    );
  });

  it('Test braku danych w zapytaniu', async () => {
    // Arrange
    const request = {
      body: null,
    } as unknown as NextRequest;

    // Act
    await POST(request);

    // Assert
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: { code: 'MISSING_BODY', message: 'Brak danych w zapytaniu' } },
      expect.objectContaining({ status: 400 })
    );
  });

  it('Test nieprawidłowego formatu JSON', async () => {
    // Arrange
    const request = {
      body: {},
      json: vi.fn().mockRejectedValue(new Error('JSON parse error'))
    } as unknown as NextRequest;

    // Act
    await POST(request);

    // Assert
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: { code: 'INVALID_JSON', message: 'Nieprawidłowy format JSON' } },
      expect.objectContaining({ status: 400 })
    );
  });
});

