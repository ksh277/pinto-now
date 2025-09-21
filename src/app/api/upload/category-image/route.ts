import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: '파일이 선택되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 파일 타입 검사
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '지원되지 않는 파일 형식입니다. (JPEG, PNG, GIF, WebP만 허용)' },
        { status: 400 }
      );
    }

    // 파일 크기 검사 (2MB 제한)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: '파일 크기가 너무 큽니다. (최대 2MB)' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 파일 확장자 추출
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'png';

    // 고유한 파일명 생성
    const fileName = `category-${randomUUID()}.${fileExtension}`;

    // 업로드 디렉토리 경로
    const uploadDir = join(process.cwd(), 'public', 'category');

    try {
      // 디렉토리가 존재하지 않으면 생성
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // 디렉토리가 이미 존재하는 경우 무시
    }

    const filePath = join(uploadDir, fileName);

    // 파일 저장
    await writeFile(filePath, buffer);

    // 웹 경로 반환
    const webPath = `/category/${fileName}`;

    return NextResponse.json({
      success: true,
      image_url: webPath,
      message: '이미지가 성공적으로 업로드되었습니다.'
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: '이미지 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}