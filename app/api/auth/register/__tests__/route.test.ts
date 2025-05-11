import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';

// Mock the Supabase client
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: vi.fn()
    },
    from: vi.fn().mockImplementation((table) => {
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
        insert: vi.fn()
      };
    })
  }
}));

// Mock Zod validation failures
vi.mock('zod', async () => {
  const actualZod = await vi.importActual('zod');
  return {
    ...actualZod,
    z: {
      ...actualZod.z,
      object: vi.fn().mockImplementation(() => {
        return {
          parse: vi.fn((data) => {
            // Validate email format
            if (data.email && !data.email.includes('@')) {
              throw new Error('Invalid email format');
            }
            
            // Validate password length
            if (data.password && data.password.length < 6) {
              throw new Error('Password must be at least 6 characters');
            }
            
            // Validate display name
            if (data.displayName && (data.displayName.length < 3 || data.displayName.length > 50)) {
              throw new Error('Display name must be between 3 and 50 characters');
            }
            
            return data;
          })
        };
      })
    }
  };
});

describe('/api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should register a user successfully', async () => {
    // Setup
    const mockUser = { id: 'test-user-id' };
    const mockRegisterData = {
      email: 'test@example.com',
      password: 'securepassword123',
      displayName: 'Test User'
    };
    
    const { supabase } = await import('@/lib/supabaseClient');
    
    // Mock signUp success - poprawione mockowanie
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: mockUser },
      error: null
    });
    
    // Mock profile check (no existing profile)
    vi.mocked(supabase.from).mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null }),
          insert: vi.fn().mockResolvedValue({ error: null })
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
        insert: vi.fn()
      };
    });
    
    const mockRequest = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(mockRegisterData)
    });

    // Execute
    const result = await POST(mockRequest);
    const responseBody = await result.json();

    // Verify
    expect(result.status).toBe(201);
    expect(responseBody).toEqual({ message: 'User registered successfully' });
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: mockRegisterData.email,
      password: mockRegisterData.password
    });
    
    // Verify profile insertion was called correctly
    const insertCall = vi.mocked(supabase.from).mock.results[1]?.value.insert;
    expect(insertCall).toHaveBeenCalled();
    expect(insertCall).toHaveBeenCalledWith({
      id: mockUser.id,
      email: mockRegisterData.email,
      display_name: mockRegisterData.displayName
    });
  });

  it('should handle registration with existing email', async () => {
    // Setup
    const mockRegisterData = {
      email: 'existing@example.com',
      password: 'securepassword123',
      displayName: 'Test User'
    };
    
    const { supabase } = await import('@/lib/supabaseClient');
    
    // Mock signUp failure with existing email - poprawione mockowanie
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null },
      error: { message: 'User already registered', status: 400 }
    });
    
    const mockRequest = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(mockRegisterData)
    });

    // Execute
    const result = await POST(mockRequest);
    const responseBody = await result.json();

    // Verify
    expect(result.status).toBe(400);
    expect(responseBody).toEqual({ 
      error: { 
        code: 'SIGNUP_FAILED', 
        message: 'User already registered' 
      } 
    });
  });

  it('should handle invalid data format', async () => {
    // Setup
    const mockInvalidData = {
      email: 'not-an-email',  // Invalid email format
      password: 'securepassword123',
      displayName: 'Test User'
    };
    
    const mockRequest = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(mockInvalidData)
    });

    // Execute
    const result = await POST(mockRequest);
    const responseBody = await result.json();

    // Verify
    expect(result.status).toBe(400);
    expect(responseBody).toEqual({
      error: { 
        code: 'INVALID_INPUT',
        message: 'Invalid email format'
      }
    });
  });

  it('should create a profile after successful registration', async () => {
    // Setup
    const mockUser = { id: 'test-user-id' };
    const mockRegisterData = {
      email: 'test@example.com',
      password: 'securepassword123',
      displayName: 'Test User'
    };
    
    const { supabase } = await import('@/lib/supabaseClient');
    
    // Mock signUp success - poprawione mockowanie
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: mockUser },
      error: null
    });
    
    // Utworzenie mock funkcji ze śledzeniem wywołań 
    const insertMock = vi.fn().mockResolvedValue({ error: null });
    
    // Mock profile check (no existing profile)
    vi.mocked(supabase.from).mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null }),
          insert: insertMock
        };
      }
      return {
        select: vi.fn(),
        eq: vi.fn(),
        single: vi.fn(),
        insert: vi.fn()
      };
    });
    
    const mockRequest = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(mockRegisterData)
    });

    // Execute
    await POST(mockRequest);

    // Verify profile creation
    expect(insertMock).toHaveBeenCalledWith({
      id: mockUser.id,
      email: mockRegisterData.email,
      display_name: mockRegisterData.displayName
    });
  });

  it('should validate password length requirement', async () => {
    // Setup
    const mockInvalidData = {
      email: 'test@example.com',
      password: 'short', // Too short (less than 6 characters)
      displayName: 'Test User'
    };
    
    const mockRequest = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(mockInvalidData)
    });

    // Execute
    const result = await POST(mockRequest);
    const responseBody = await result.json();

    // Verify
    expect(result.status).toBe(400);
    expect(responseBody).toEqual({
      error: { 
        code: 'INVALID_INPUT',
        message: 'Password must be at least 6 characters'
      }
    });
  });

  it('should handle profile creation failure', async () => {
    // Setup
    const mockUser = { id: 'test-user-id' };
    const mockRegisterData = {
      email: 'test@example.com',
      password: 'securepassword123',
      displayName: 'Test User'
    };
    
    const { supabase } = await import('@/lib/supabaseClient');
    
    // Mock signUp success - poprawione mockowanie
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: mockUser },
      error: null
    });
    
    // Mock profile check (no existing profile) i błąd tworzenia profilu
    vi.mocked(supabase.from).mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null }),
          insert: vi.fn().mockResolvedValue({ 
            error: { message: 'Database constraint violation' } 
          })
        };
      }
      return {
        select: vi.fn(),
        eq: vi.fn(),
        single: vi.fn(),
        insert: vi.fn()
      };
    });
    
    const mockRequest = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(mockRegisterData)
    });

    // Execute
    const result = await POST(mockRequest);
    const responseBody = await result.json();

    // Verify
    expect(result.status).toBe(400);
    expect(responseBody).toEqual({
      error: { 
        code: 'PROFILE_INSERT_FAILED',
        message: 'Database constraint violation'
      }
    });
  });
});
