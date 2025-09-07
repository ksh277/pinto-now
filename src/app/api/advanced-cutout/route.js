import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * 고급 이미지 컷아웃 API
 * - MediaPipe(인물) + GrabCut(사물) 자동 감지
 * - 투명 배경 + 타이트 크롭 + 키링 고리 옵션
 * POST /api/advanced-cutout
 */

async function advancedCutout(inputPath, outputPath, options = {}) {
  const {
    marginCm = 0.1,
    addRing = false,
    ringMm = 6.0,
    ringGapMm = 3.0,
    forceGeneral = false,
    dpi = 300
  } = options;

  const pythonScript = path.join(process.cwd(), 'python', 'cutout.py');
  
  const args = [
    pythonScript,
    inputPath,
    outputPath,
    '--dpi', dpi.toString(),
    '--margin-cm', marginCm.toString(),
    '--feather', '2'
  ];

  if (addRing) {
    args.push('--add-ring', '--ring-mm', ringMm.toString(), '--ring-gap-mm', ringGapMm.toString());
  }
  
  if (forceGeneral) {
    args.push('--force-general');
  }

  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', args);
    
    let stdout = '';
    let stderr = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, output: stdout });
      } else {
        reject(new Error(`Python script failed: ${stderr}`));
      }
    });
  });
}

export async function POST(request) {
  console.log('🎨 고급 컷아웃 API 호출됨!');
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image');
    const marginCm = parseFloat(formData.get('marginCm') || '0.1');
    const addRing = formData.get('addRing') === 'true';
    const ringMm = parseFloat(formData.get('ringMm') || '6.0');
    const forceGeneral = formData.get('forceGeneral') === 'true';
    
    console.log('📁 이미지 파일:', imageFile ? `${imageFile.name} (${imageFile.size} bytes)` : 'null');
    console.log('📏 여백:', marginCm + 'cm', '🔗 고리:', addRing);
    
    if (!imageFile || !imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '유효한 이미지 파일이 필요합니다.' },
        { status: 400 }
      );
    }

    try {
      // 임시 파일 경로 생성
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
      
      const timestamp = Date.now();
      const inputPath = path.join(uploadsDir, `input_${timestamp}.${imageFile.type.split('/')[1]}`);
      const outputPath = path.join(uploadsDir, `cutout_${timestamp}.png`);
      
      // 입력 이미지 저장
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      await fs.writeFile(inputPath, buffer);
      
      console.log('🔄 고급 컷아웃 처리 시작...');
      
      // Python 스크립트로 고급 컷아웃 실행
      const cutoutResult = await advancedCutout(inputPath, outputPath, {
        marginCm,
        addRing,
        ringMm,
        forceGeneral,
        dpi: 300
      });
      
      // 결과 이미지를 base64로 읽기
      const resultBuffer = await fs.readFile(outputPath);
      const resultBase64 = resultBuffer.toString('base64');
      const resultDataUrl = `data:image/png;base64,${resultBase64}`;
      
      // 임시 파일 정리
      await fs.unlink(inputPath).catch(() => {});
      await fs.unlink(outputPath).catch(() => {});
      
      console.log('✅ 고급 컷아웃 완료!');
      
      return NextResponse.json({
        success: true,
        cutout: {
          imageData: resultDataUrl,
          format: 'png',
          hasAlpha: true,
          marginCm: marginCm,
          addRing: addRing
        },
        processing: {
          method: forceGeneral ? 'GrabCut (일반 객체)' : 'MediaPipe + GrabCut (자동 감지)',
          quality: 'Professional',
          features: [
            '투명 배경',
            '타이트 크롭',
            '정밀한 외곽선',
            addRing ? '키링 고리' : null
          ].filter(Boolean)
        },
        message: '고품질 투명 컷아웃이 완료되었습니다.',
        instructions: '결과는 완전 투명 배경의 PNG 파일입니다.'
      });

    } catch (cutoutError) {
      console.error('컷아웃 처리 오류:', cutoutError);
      
      return NextResponse.json({
        success: false,
        error: '컷아웃 처리 실패: ' + cutoutError.message,
      });
    }

  } catch (error) {
    console.error('Advanced cutout error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: '고급 컷아웃 처리 중 오류가 발생했습니다.',
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Advanced Cutout API',
    methods: ['POST'],
    description: 'MediaPipe + GrabCut을 사용한 고품질 투명 컷아웃 생성',
    supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: '10MB',
    parameters: {
      image: 'File - 컷아웃할 이미지',
      marginCm: 'Number - 여백 크기 (cm, 기본값: 0.1)',
      addRing: 'Boolean - 키링 고리 추가 (기본값: false)',
      ringMm: 'Number - 고리 지름 (mm, 기본값: 6.0)',
      forceGeneral: 'Boolean - 일반 객체 모드 강제 (기본값: false)'
    },
    features: [
      'MediaPipe 인물 세그멘테이션',
      'GrabCut 일반 객체 컷아웃',
      '투명 배경 (알파 채널)',
      '타이트 크롭핑',
      '키링 고리 자동 생성',
      '정밀한 외곽선'
    ]
  });
}