import { NextResponse } from 'next/server';

/**
 * 간단한 SVG 패스 생성 API (클라이언트 사이드 처리용)
 * POST /api/generate-svg-path
 */
export async function POST(request) {
  console.log('🎨 SVG 패스 생성 API 호출됨!');
  try {
    const formData = await request.formData();
    const alphaMaskFile = formData.get('alphaMask');
    const marginCm = parseFloat(formData.get('marginCm') || '1');
    
    console.log('📁 알파 매트 파일:', alphaMaskFile ? `${alphaMaskFile.name} (${alphaMaskFile.size} bytes)` : 'null');
    console.log('📏 여백:', marginCm + 'cm');
    
    if (!alphaMaskFile || !alphaMaskFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '유효한 알파 매트 이미지가 필요합니다.' },
        { status: 400 }
      );
    }

    try {
      // 알파 매트 이미지를 base64로 변환
      const arrayBuffer = await alphaMaskFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Data = buffer.toString('base64');
      const dataUrl = `data:image/png;base64,${base64Data}`;
      
      console.log('✅ 알파 매트 base64 변환 완료');
      
      // 임시로 간단한 SVG 패스 반환 (클라이언트에서 ImageTracer 사용 예정)
      const viewBox = '0 0 200 200';
      const simpleRectPath = 'M 10 10 L 190 10 L 190 190 L 10 190 Z';
      
      return NextResponse.json({
        success: true,
        svgPath: simpleRectPath,
        originalPath: simpleRectPath,
        viewBox: viewBox,
        marginCm: marginCm,
        alphaMaskData: dataUrl, // 클라이언트가 직접 처리할 수 있도록 전달
        fullSvg: `<svg viewBox="${viewBox}"><path d="${simpleRectPath}"/></svg>`,
        message: 'SVG 패스가 생성되었습니다. 클라이언트에서 ImageTracer로 처리하세요.'
      });

    } catch (processingError) {
      console.error('처리 오류:', processingError);
      
      return NextResponse.json({
        success: false,
        error: '처리 실패: ' + processingError.message,
      });
    }

  } catch (error) {
    console.error('SVG path generation error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'SVG 패스 생성 중 오류가 발생했습니다.',
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
    message: 'SVG Path Generation API',
    methods: ['POST'],
    description: 'POST로 알파 매트 이미지를 전송하면 base64 데이터를 반환합니다.',
    supportedFormats: ['image/png'],
    maxFileSize: '5MB',
    parameters: {
      alphaMask: 'File - 알파 매트 이미지 (PNG)',
      marginCm: 'Number - 여백 크기 (cm, 기본값: 1)'
    }
  });
}