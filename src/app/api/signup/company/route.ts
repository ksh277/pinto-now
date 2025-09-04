import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      // 필요한 필드 추출 (예시)
      const companyName = String(form.get('companyName') || '');
      const bizNo = String(form.get('bizNo') || '');
      const email = String(form.get('email') || '');
      const file = form.get('license'); // File | null

      // 여기서: 필수 필드 검증, 중복 체크, DB 저장, 관리자 알림(메일/슬랙) 등을 수행
      // file이 존재하면 실제 스토리지(S3 등)에 업로드하도록 구현

      return NextResponse.json({ ok: true, companyName, bizNo, email, hasFile: !!file });
    }

    // JSON으로 오는 경우 (예비 처리)
    const json = await req.json().catch(() => null);
    return NextResponse.json({ ok: true, ...json });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'server error' }, { status: 500 });
  }
}
