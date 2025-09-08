
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProductContext } from '@/contexts/product-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from './ui/skeleton';
import type { Role } from '@/contexts/product-context';

interface HeaderAuthNavProps {
  onMenuClose?: () => void;
}

export function HeaderAuthNav({ onMenuClose }: HeaderAuthNavProps) {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const { role, setRole } = useProductContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || isLoading) {
    return <Skeleton className="h-4 w-[250px]" />;
  }

  return (
    <>
      {isAuthenticated && user ? (
        <div className="flex items-center gap-4 text-muted-foreground">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-auto p-0 text-xs hover:bg-transparent">
                {user.nickname || (user.isAdmin && user.username === 'ha1045' ? '관리자' : user.username || '사용자')}님
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>내 계정</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/mypage">마이페이지</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin" prefetch={false}>관리자</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/orders" className="hover:underline">주문조회</Link>
        </div>
      ) : (
        <div className="flex items-center gap-4 text-muted-foreground">
          <Link href="/register" className="hover:underline" onClick={onMenuClose}>회원가입</Link>
          <Link href="/login" className="hover:underline" onClick={onMenuClose}>로그인</Link>
          <Link href="/orders" className="hover:underline" onClick={onMenuClose}>주문조회</Link>
        </div>
      )}
    </>
  );
}
