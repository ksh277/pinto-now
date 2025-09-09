import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const uploadedUrls: Record<string, string> = {};
    
    // images 폴더에서 1.png ~ 8.png 파일들을 찾아서 업로드
    for (let i = 1; i <= 8; i++) {
      const imagePath = path.join(process.cwd(), 'public', 'images', `${i}.png`);
      
      // 파일이 존재하는지 확인
      if (!fs.existsSync(imagePath)) {
        console.log(`이미지 ${i}.png 파일이 존재하지 않습니다.`);
        continue;
      }

      try {
        // 파일을 읽어서 Buffer로 변환
        const fileBuffer = fs.readFileSync(imagePath);
        const fileName = `banner-${i}.png`;

        // Vercel Blob에 업로드
        const blob = await put(fileName, fileBuffer, {
          access: 'public',
        });

        uploadedUrls[`image${i}`] = blob.url;
        console.log(`✅ ${i}.png -> ${blob.url}`);
      } catch (uploadError) {
        console.error(`❌ ${i}.png 업로드 실패:`, uploadError);
      }
    }

    // 카테고리 이미지들도 업로드 (category 폴더)
    for (let i = 1; i <= 8; i++) {
      const categoryPath = path.join(process.cwd(), 'public', 'category', `${i}.png`);
      
      if (!fs.existsSync(categoryPath)) {
        console.log(`카테고리 이미지 ${i}.png 파일이 존재하지 않습니다.`);
        continue;
      }

      try {
        const fileBuffer = fs.readFileSync(categoryPath);
        const fileName = `category-${i}.png`;

        const blob = await put(fileName, fileBuffer, {
          access: 'public',
        });

        uploadedUrls[`category${i}`] = blob.url;
        console.log(`✅ category/${i}.png -> ${blob.url}`);
      } catch (uploadError) {
        console.error(`❌ category/${i}.png 업로드 실패:`, uploadError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${Object.keys(uploadedUrls).length}개 이미지 업로드 완료`,
      urls: uploadedUrls
    });

  } catch (error) {
    console.error('로컬 이미지 업로드 오류:', error);
    return NextResponse.json(
      { error: '로컬 이미지 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}