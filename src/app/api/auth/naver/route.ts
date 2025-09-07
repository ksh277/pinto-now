import { NextRequest, NextResponse } from 'next/server';

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const NAVER_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/naver/callback';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'login') {
    // 네이버 로그인 페이지로 리다이렉트
    const state = Math.random().toString(36).substr(2, 11); // CSRF 방지용 state
    
    const naverAuthUrl = new URL('https://nid.naver.com/oauth2.0/authorize');
    naverAuthUrl.searchParams.set('response_type', 'code');
    naverAuthUrl.searchParams.set('client_id', NAVER_CLIENT_ID || '');
    naverAuthUrl.searchParams.set('redirect_uri', NAVER_REDIRECT_URI);
    naverAuthUrl.searchParams.set('state', state);

    return NextResponse.redirect(naverAuthUrl.toString());
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}