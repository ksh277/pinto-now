'use client';

import React, { createContext, useContext, useCallback, useMemo, useState, useEffect, type ReactNode } from 'react';
import { useProductContext } from '@/contexts/product-context';
import type { User } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';

type AuthCtx = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  redirectPath: string | null;
  setRedirectPath: (path: string | null) => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

function normalizeUser(u: any): User {
  const isAdmin = u?.isAdmin ?? (u?.role ? ['admin', 'seller', 'staff'].includes(u.role) : false);
  return {
    id: String(u?.id ?? ''),
    email: u?.email ?? '',
    username: u?.username,
    nickname: u?.nickname,
    name: u?.name,
    avatarUrl: u?.avatarUrl,
    phone: u?.phone,
    tel: u?.tel,
    zipcode: u?.zipcode,
    address1: u?.address1,
    address2: u?.address2,
    receive_sms: u?.receive_sms,
    receive_email: u?.receive_email,
    is_lifetime_member: u?.is_lifetime_member,
    membershipTier: u?.membershipTier,
    totalSpent: u?.totalSpent,
    pointsBalance: u?.pointsBalance,
    isAdmin,
    createdAt: u?.createdAt ? new Date(u.createdAt) : undefined,
    updatedAt: u?.updatedAt ? new Date(u.updatedAt) : undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useLocalStorage<string | null>('redirectPath', null);
  const { setRole } = useProductContext();
  // user가 바뀔 때마다 product-context의 role도 동기화
  useEffect(() => {
    if (user?.isAdmin) setRole('admin');
    else if (user) setRole('user');
    else setRole('guest');
  }, [user, setRole]);

  // ✅ 초기 로드/새로고침 시 쿠키로 상태 복원
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include', cache: 'no-store' });
        const data = await res.json();
        if (!aborted) setUser(data?.user ? normalizeUser(data.user) : null);
      } catch {
        if (!aborted) setUser(null);
      } finally {
        if (!aborted) setIsLoading(false);
      }
    })();
    return () => { aborted = true; };
  }, []);

  // 로그인: DB 인증 + JWT 쿠키 발급(/api/login) 사용
  const login = useCallback(async (username: string, password: string, rememberMe = false) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password, rememberMe }),
    });
    const data = await res.json();
    if (!res.ok || !data?.ok) throw new Error(data?.error || '로그인 실패');
    setUser(normalizeUser(data.user));
  }, []);

  // ✅ 실제 로그아웃: 서버 쿠키 제거
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthCtx>(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    redirectPath,
    setRedirectPath,
    setUser,
  }), [user, isLoading, login, logout, redirectPath, setRedirectPath]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
