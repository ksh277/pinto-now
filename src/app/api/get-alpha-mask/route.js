import { NextResponse } from 'next/server';

/**
 * 이미지 알파 매트(마스크) 추출 API 엔드포인트
 * POST /api/get-alpha-mask
 */
export async function POST(request) {
  console.log('🎯 알파 매트 추출 API 호출됨!');
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
    const maxSize = 5 * 1024 * 1024;
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
      console.log('❌ API 키가 없음');
      return NextResponse.json({
        success: false,
        message: 'API 키가 설정되지 않았습니다.',
        error: 'API_KEY_MISSING'
      });
    }

    try {
      console.log('🚀 Remove.bg API 호출 시작 (알파 매트)...');
      // Remove.bg API 호출 - 알파 매트만 요청
      const formDataForAPI = new FormData();
      formDataForAPI.append('image_file', imageFile);
      formDataForAPI.append('size', 'auto');
      formDataForAPI.append('format', 'png');
      formDataForAPI.append('channels', 'alpha'); // 알파 매트(흑백 마스크)만 요청
      
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': REMOVEBG_API_KEY,
        },
        body: formDataForAPI,
      });
      
      console.log('📡 Remove.bg API 응답 (알파):', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 402) {
          return NextResponse.json({
            success: false,
            error: 'API 크레딧이 부족합니다.',
          });
        }
        
        throw new Error(errorData.errors?.[0]?.title || `API Error: ${response.status}`);
      }

      // 성공적으로 처리된 알파 매트 데이터
      const alphaMaskBuffer = await response.arrayBuffer();
      const base64AlphaMask = Buffer.from(alphaMaskBuffer).toString('base64');
      const dataUrl = `data:image/png;base64,${base64AlphaMask}`;

      console.log('✅ 알파 매트 추출 완료');
      return NextResponse.json({
        success: true,
        alphaMask: dataUrl,
        message: '알파 매트가 성공적으로 추출되었습니다.'
      });

    } catch (apiError) {
      console.error('Remove.bg API error:', apiError);
      
      return NextResponse.json({
        success: false,
        error: apiError.message,
      });
    }

  } catch (error) {
    console.error('Alpha mask extraction error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: '알파 매트 추출 중 오류가 발생했습니다.',
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
    message: 'Alpha Mask Extraction API',
    methods: ['POST'],
    description: 'POST로 이미지 파일을 전송하면 알파 매트(흑백 마스크)를 반환합니다.',
    supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: '5MB'
  });
}