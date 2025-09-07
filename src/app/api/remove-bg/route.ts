import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') || formData.get('file') as File;
    
    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Remove.bg API 키 (환경변수에서 가져오기)
    const apiKey = process.env.REMOVEBG_API_KEY;
    
    if (!apiKey) {
      // API 키가 없을 때 클라이언트 사이드에서 처리하도록 안내
      return NextResponse.json({ 
        error: 'Remove.bg API key not configured',
        useClientSide: true 
      }, { status: 400 });
    }

    // Remove.bg API 호출
    const removeBgFormData = new FormData();
    removeBgFormData.append('image_file', imageFile);
    removeBgFormData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: removeBgFormData,
    });

    if (!response.ok) {
      throw new Error(`Remove.bg API error: ${response.status}`);
    }

    const resultBuffer = await response.arrayBuffer();
    
    return new NextResponse(resultBuffer, {
      headers: {
        'Content-Type': 'image/png',
      },
    });

  } catch (error) {
    console.error('Remove background error:', error);
    return NextResponse.json(
      { error: 'Failed to remove background', useClientSide: true }, 
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';