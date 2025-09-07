import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/ai/flows/chat-flow';

export async function POST(req: NextRequest) {
  try {
    // 환경 변수 체크
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return NextResponse.json({ 
        error: 'API 키가 설정되지 않았습니다.' 
      }, { status: 500 });
    }

    const { message } = await req.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    console.log('Processing chat message:', message.substring(0, 50) + '...');
    
    const response = await chat(message);
    
    console.log('Chat response generated successfully');
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    
    // 더 자세한 에러 정보
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json({ 
      error: 'AI 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.' 
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';