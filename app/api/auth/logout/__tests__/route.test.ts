import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../logout/route';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Mock the Supabase client
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signOut: vi.fn().mockResolvedValue({ error: null })
    }
  }
}));

// Mock Next.js cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn().mockReturnValue({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn()
  })
}));

describe('/api/auth/logout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should log out the user successfully', async () => {
    // Setup
    const mockCookiesInstance = {
      get: vi.fn().mockReturnValue({ value: 'mock-auth-token' }),
      set: vi.fn(),
      delete: vi.fn()
    };
    
    vi.mocked(cookies).mockReturnValue(mockCookiesInstance);
    
    const mockRequest = new NextRequest('http://localhost/api/auth/logout');

    // Execute
    const result = await POST(mockRequest);
    const responseBody = await result.json();

    // Verify
    expect(result.status).toBe(200);
    expect(responseBody).toEqual({ success: true });
    
    // Verify Supabase was called
    const { supabase } = await import('@/lib/supabaseClient');
    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });

  it('should clear session cookies after logout', async () => {
    // Setup
    const mockCookiesInstance = {
      get: vi.fn().mockReturnValue({ value: 'mock-auth-token' }),
      set: vi.fn(),
      delete: vi.fn()
    };
    
    vi.mocked(cookies).mockReturnValue(mockCookiesInstance);
    
    const mockRequest = new NextRequest('http://localhost/api/auth/logout');

    // Execute
    await POST(mockRequest);

    // Verify cookies are deleted
    expect(mockCookiesInstance.delete).toHaveBeenCalledWith('sb-access-token');
    expect(mockCookiesInstance.delete).toHaveBeenCalledWith('sb-refresh-token');
  });

  it('should handle logout for unauthenticated users gracefully', async () => {
    // Setup - no auth tokens in cookies
    const mockCookiesInstance = {
      get: vi.fn().mockReturnValue(null), // No auth token
      set: vi.fn(),
      delete: vi.fn()
    };
    
    vi.mocked(cookies).mockReturnValue(mockCookiesInstance);
    
    const mockRequest = new NextRequest('http://localhost/api/auth/logout');

    // Execute
    const result = await POST(mockRequest);
    const responseBody = await result.json();

    // Verify successful response even for unauthenticated users
    expect(result.status).toBe(200);
    expect(responseBody).toEqual({ success: true });
    
    // Supabase should still be called (to ensure any potential session state is cleared)
    const { supabase } = await import('@/lib/supabaseClient');
    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });
});
