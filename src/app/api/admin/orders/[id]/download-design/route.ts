import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyRequestAuth } from '@/lib/auth/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 관리자 권한 확인
    const authUser = await verifyRequestAuth(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const orderId = params.id;

    // 주문의 디자인 파일 정보 조회
    const designFileResult = await query(`
      SELECT
        oi.design_file_name,
        oi.design_file_type,
        oi.design_file_url,
        oi.design_file_data
      FROM order_items oi
      WHERE oi.order_id = ?
        AND oi.design_file_name IS NOT NULL
      LIMIT 1
    `, [orderId]) as any[];

    if (designFileResult.length === 0) {
      return NextResponse.json({ error: 'Design file not found' }, { status: 404 });
    }

    const designFile = designFileResult[0];

    // 파일 데이터가 Base64로 저장되어 있는 경우
    if (designFile.design_file_data) {
      try {
        // Base64 데이터에서 데이터 타입 prefix 제거
        const base64Data = designFile.design_file_data.split(',')[1] || designFile.design_file_data;
        const buffer = Buffer.from(base64Data, 'base64');

        const response = new NextResponse(buffer);
        response.headers.set('Content-Type', designFile.design_file_type || 'application/pdf');
        response.headers.set(
          'Content-Disposition',
          `attachment; filename="${designFile.design_file_name}"`
        );

        return response;
      } catch (error) {
        console.error('Error converting base64 to buffer:', error);
        return NextResponse.json({ error: 'Invalid file data' }, { status: 400 });
      }
    }

    // URL이 있는 경우 리다이렉트
    if (designFile.design_file_url) {
      return NextResponse.redirect(designFile.design_file_url);
    }

    return NextResponse.json({ error: 'No file data available' }, { status: 404 });

  } catch (error) {
    console.error('Download design file error:', error);
    return NextResponse.json(
      { error: 'Failed to download design file' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
