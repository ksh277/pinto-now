import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { verify } from 'jsonwebtoken';

function getUserIdFromToken(request: NextRequest): number | null {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) return null;

    const decoded = verify(token, process.env.JWT_SECRET!) as any;
    return decoded.id;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (files.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No files uploaded'
      }, { status: 400 });
    }

    if (files.length > 5) {
      return NextResponse.json({
        success: false,
        error: 'Maximum 5 images allowed'
      }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'reviews');

    // 업로드 디렉토리가 없으면 생성
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // 이미 존재하는 경우 무시
    }

    const uploadedImages = [];

    for (const file of files) {
      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({
          success: false,
          error: `File ${file.name} exceeds 5MB limit`
        }, { status: 400 });
      }

      // 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({
          success: false,
          error: `File ${file.name} is not an image`
        }, { status: 400 });
      }

      // 고유한 파일명 생성
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2);
      const extension = file.name.split('.').pop() || 'jpg';
      const fileName = `review_${userId}_${timestamp}_${randomId}.${extension}`;
      const filePath = join(uploadDir, fileName);

      // 파일 저장
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // 웹에서 접근 가능한 URL 생성
      const imageUrl = `/uploads/reviews/${fileName}`;
      uploadedImages.push(imageUrl);
    }

    return NextResponse.json({
      success: true,
      images: uploadedImages
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }, { status: 500 });
  }
}