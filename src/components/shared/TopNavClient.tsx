'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { AuthUser } from '@/lib/auth/jwt';

type Props = {
  initialUser: AuthUser | null;
};

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then((r) => r.json());

export default function TopNavClient({ initialUser }: Props) {
  const router = useRouter();
  const { data } = useSWR<{ ok: boolean; user: AuthUser | null }>(
    '/api/me',
    fetcher,
    {
      fallbackData: { ok: true, user: initialUser },
      revalidateOnFocus: false,
    }
  );
  const user = data?.user;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.refresh();
  };

  if (!user) {
    return (
      <nav>
        <Link href="/signup">회원가입</Link>{' '}
        <Link href="/login">로그인</Link>{' '}
        <Link href="/orders">주문조회</Link>
      </nav>
    );
  }

  return (
    <nav>
      <Link href="/mypage">마이페이지</Link>{' '}
      <Link href="/orders">주문조회</Link>{' '}
      <button type="button" onClick={handleLogout}>
        로그아웃
      </button>{' '}
      {['admin', 'seller', 'staff'].includes(user.role) && (
        <Link href="/admin">관리자 모드</Link>
      )}
    </nav>
  );
}
