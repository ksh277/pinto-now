import { NextRequest, NextResponse } from 'next/server';

const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
const KAKAO_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/kakao/callback';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'login') {
    // 카카오 로그인 페이지로 리다이렉트
    const kakaoAuthUrl = new URL('https://kauth.kakao.com/oauth/authorize');
    kakaoAuthUrl.searchParams.set('client_id', KAKAO_CLIENT_ID || '');
    kakaoAuthUrl.searchParams.set('redirect_uri', KAKAO_REDIRECT_URI);
    kakaoAuthUrl.searchParams.set('response_type', 'code');
    kakaoAuthUrl.searchParams.set('scope', 'profile_nickname,profile_image,account_email');

    return NextResponse.redirect(kakaoAuthUrl.toString());
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}