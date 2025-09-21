import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { signToken, setSessionCookie, computeMaxAge, AuthUser } from '@/lib/auth/jwt';

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const NAVER_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/naver/callback';

interface NaverTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface NaverUserInfo {
  resultcode: string;
  message: string;
  response: {
    id: string;
    nickname: string;
    name: string;
    email: string;
    gender: string;
    age: string;
    birthday: string;
    profile_image: string;
    birthyear: string;
    mobile: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('네이버 로그인 오류:', error);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=naver_error`);
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=no_code`);
    }

    // 1. 액세스 토큰 받기
    const tokenResponse = await fetch('https://nid.naver.com/oauth2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: NAVER_CLIENT_ID || '',
        client_secret: NAVER_CLIENT_SECRET || '',
        redirect_uri: NAVER_REDIRECT_URI,
        code: code,
        state: state,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('네이버 토큰 요청 실패:', await tokenResponse.text());
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=token_error`);
    }

    const tokenData: NaverTokenResponse = await tokenResponse.json();

    // 2. 사용자 정보 받기
    const userInfoResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      console.error('네이버 사용자 정보 요청 실패:', await userInfoResponse.text());
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=userinfo_error`);
    }

    const userInfo: NaverUserInfo = await userInfoResponse.json();
    
    if (userInfo.resultcode !== '00') {
      console.error('네이버 사용자 정보 오류:', userInfo.message);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=userinfo_error`);
    }

    const naverId = userInfo.response.id;
    const nickname = userInfo.response.nickname;
    const name = userInfo.response.name;
    const email = userInfo.response.email;
    const profileImage = userInfo.response.profile_image;

    // 3. 데이터베이스에서 사용자 찾기 또는 생성
    let dbUser;

    // 먼저 네이버 ID 또는 이메일로 기존 사용자 찾기
    const existingUsers = await query(`
      SELECT id, username, email, status, created_at, updated_at
      FROM users
      WHERE username = ? ${email ? 'OR email = ?' : ''}
      LIMIT 1
    `, email ? [`naver_${naverId}`, email] : [`naver_${naverId}`]) as any[];

    if (existingUsers.length === 0) {
      // 새 사용자 생성
      const uniqueUsername = `naver_${naverId}`;

      await query(`
        INSERT INTO users (username, email, status, created_at, updated_at)
        VALUES (?, ?, 'ACTIVE', NOW(), NOW())
      `, [uniqueUsername, email || null]);

      // 생성된 사용자 정보 조회
      const newUsers = await query(`
        SELECT id, username, email, status, created_at, updated_at
        FROM users
        WHERE username = ?
        LIMIT 1
      `, [uniqueUsername]) as any[];

      dbUser = newUsers[0];
    } else {
      // 기존 사용자 정보 업데이트
      dbUser = existingUsers[0];

      await query(`
        UPDATE users
        SET updated_at = NOW()
        WHERE id = ?
      `, [dbUser.id]);
    }

    // 4. JWT 토큰 생성 및 세션 설정
    const user: AuthUser = {
      id: dbUser.id.toString(),
      username: dbUser.username,
      role: dbUser.username === 'admin' ? 'admin' : 'user',
      nickname: nickname,
    };

    const maxAge = computeMaxAge(user, false); // 소셜 로그인은 기본적으로 세션 유지
    const token = await signToken(user, maxAge);

    // 5. 메인 페이지로 리다이렉트 (네이버 로그인 완료)
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/`;

    const response = NextResponse.redirect(redirectUrl);
    setSessionCookie(response, token, maxAge);

    return response;

  } catch (error) {
    console.error('네이버 로그인 처리 중 오류:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=server_error`);
  }
}