'use client';

export interface AuthUser {
  id: string;
  username: string;
  role: 'admin' | 'seller' | 'staff' | 'user';
  nickname?: string;
}

/**
 * 클라이언트에서 현재 사용자의 인증 상태를 확인하는 함수
 */
export async function verifyAuth(): Promise<AuthUser | null> {
  try {
    const response = await fetch('/api/auth/verify', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const user = await response.json();
      return user;
    }

    return null;
  } catch (error) {
    console.error('Auth verification failed:', error);
    return null;
  }
}

/**
 * 관리자 권한을 확인하는 함수
 */
export async function verifyAdminAuth(): Promise<AuthUser | null> {
  const user = await verifyAuth();
  return user?.role === 'admin' ? user : null;
}