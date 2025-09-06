import { NextResponse } from 'next/server';

/**
 * 이미지 배경 제거 API 엔드포인트
 * POST /api/remove-background
 */
export async function POST(request) {
  console.log('🎯 배경 제거 API 호출됨!');
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image');
    console.log('📁 이미지 파일:', imageFile ? `${imageFile.name} (${imageFile.size} bytes)` : 'null');
    
    if (!imageFile || !imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '유효한 이미지 파일이 필요합니다.' },
        { status: 400 }
      );
    }

    // 파일 크기 제한 (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { error: '파일 크기가 너무 큽니다. 5MB 이하의 이미지를 업로드해주세요.' },
        { status: 400 }
      );
    }

    // 환경 변수에서 API 키 확인
    const REMOVEBG_API_KEY = process.env.REMOVEBG_API_KEY;
    console.log('🔑 API 키 확인:', REMOVEBG_API_KEY ? `${REMOVEBG_API_KEY.substring(0, 8)}...` : 'undefined');
    
    if (!REMOVEBG_API_KEY) {
      console.log('❌ API 키가 없음 - 클라이언트 사이드로 폴백');
      // API 키가 없으면 클라이언트 사이드 처리로 폴백
      return NextResponse.json({
        success: false,
        message: 'API 키가 설정되지 않았습니다. 클라이언트 사이드 처리를 사용하세요.',
        useClientSide: true
      });
    }

    try {
      console.log('🚀 Remove.bg API 호출 시작...');
      // Remove.bg API 호출
      const formDataForAPI = new FormData();
      formDataForAPI.append('image_file', imageFile);
      formDataForAPI.append('size', 'auto');
      formDataForAPI.append('format', 'png');
      formDataForAPI.append('channels', 'rgba'); // 투명 PNG 결과
      
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': REMOVEBG_API_KEY,
        },
        body: formDataForAPI,
      });
      
      console.log('📡 Remove.bg API 응답:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 402) {
          return NextResponse.json({
            success: false,
            error: 'API 크레딧이 부족합니다.',
            useClientSide: true
          });
        }
        
        throw new Error(errorData.errors?.[0]?.title || `API Error: ${response.status}`);
      }

      // 성공적으로 처리된 이미지 데이터
      const processedImageBuffer = await response.arrayBuffer();
      const base64Image = Buffer.from(processedImageBuffer).toString('base64');
      const dataUrl = `data:image/png;base64,${base64Image}`;

      return NextResponse.json({
        success: true,
        imageData: dataUrl,
        message: '배경이 성공적으로 제거되었습니다.'
      });

    } catch (apiError) {
      console.error('Remove.bg API error:', apiError);
      
      // API 실패 시 클라이언트 사이드 처리 안내
      return NextResponse.json({
        success: false,
        error: apiError.message,
        useClientSide: true
      });
    }

  } catch (error) {
    console.error('Background removal error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: '배경 제거 처리 중 오류가 발생했습니다.',
        details: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * 지원되는 HTTP 메서드 확인
 */
export async function GET() {
  return NextResponse.json({
    message: 'Background Removal API',
    methods: ['POST'],
    description: 'POST로 이미지 파일을 전송하면 배경이 제거된 이미지를 반환합니다.',
    supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: '5MB'
  });
}

/**
 * CORS 설정
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}