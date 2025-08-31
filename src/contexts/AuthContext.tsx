'use client';

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  redirectPath: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setRedirectPath: (path: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [redirectPath, setRedirectPath] = useLocalStorage<string | null>('redirectPath', null);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.ok && data.user) {
        setUser({
          id: String(data.user.id),
          email: data.user.email,
          username: data.user.username,
          nickname: data.user.name || '',
          name: data.user.name || '',
          isAdmin: data.user.role === 'admin',
        });
      } else {
        throw new Error(data.error || '로그인 실패');
      }
    } catch (e: any) {
      setUser(null);
      throw new Error(e?.message || '로그인 실패');
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading: false,
      error: null,
      redirectPath,
      login,
      logout,
      setUser,
      setRedirectPath,
    }),
    [user, redirectPath, login, logout, setRedirectPath],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
