import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { signToken, setSessionCookie, computeMaxAge, AuthUser } from '@/lib/auth/jwt';

const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
const KAKAO_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/kakao/callback';

interface KakaoTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
}

interface KakaoUserInfo {
  id: number;
  connected_at: string;
  properties: {
    nickname: string;
    profile_image?: string;
    thumbnail_image?: string;
  };
  kakao_account: {
    profile_nickname_needs_agreement: boolean;
    profile_image_needs_agreement: boolean;
    profile: {
      nickname: string;
      thumbnail_image_url?: string;
      profile_image_url?: string;
    };
    has_email: boolean;
    email_needs_agreement: boolean;
    is_email_valid: boolean;
    is_email_verified: boolean;
    email?: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('카카오 로그인 오류:', error);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=kakao_error`);
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=no_code`);
    }

    // 1. 액세스 토큰 받기
    const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: KAKAO_CLIENT_ID || '',
        client_secret: KAKAO_CLIENT_SECRET || '',
        redirect_uri: KAKAO_REDIRECT_URI,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('카카오 토큰 요청 실패:', await tokenResponse.text());
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=token_error`);
    }

    const tokenData: KakaoTokenResponse = await tokenResponse.json();

    // 2. 사용자 정보 받기
    const userInfoResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    if (!userInfoResponse.ok) {
      console.error('카카오 사용자 정보 요청 실패:', await userInfoResponse.text());
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=userinfo_error`);
    }

    const userInfo: KakaoUserInfo = await userInfoResponse.json();
    const kakaoId = userInfo.id.toString();
    const nickname = userInfo.properties.nickname || userInfo.kakao_account.profile.nickname;
    const email = userInfo.kakao_account.email;
    const profileImage = userInfo.properties.profile_image || userInfo.kakao_account.profile.profile_image_url;

    // 3. 데이터베이스에서 사용자 찾기 또는 생성
    let dbUser;

    // 먼저 카카오 ID 또는 이메일로 기존 사용자 찾기
    const existingUsers = await query(`
      SELECT id, username, email, status, created_at, updated_at
      FROM users
      WHERE username = ? ${email ? 'OR email = ?' : ''}
      LIMIT 1
    `, email ? [`kakao_${kakaoId}`, email] : [`kakao_${kakaoId}`]) as any[];

    if (existingUsers.length === 0) {
      // 새 사용자 생성
      const uniqueUsername = `kakao_${kakaoId}`;

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

    // 5. 메인 페이지로 리다이렉트 (카카오 로그인 완료)
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/`;

    const response = NextResponse.redirect(redirectUrl);
    setSessionCookie(response, token, maxAge);

    return response;

  } catch (error) {
    console.error('카카오 로그인 처리 중 오류:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=server_error`);
  }
}