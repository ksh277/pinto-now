import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
  const item = await prisma.banners.findFirst({
      where: { is_active: true },
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(item ?? null, { status: 200 });
  } catch (e: any) {
    if (e?.code === 'P2021') return NextResponse.json(null, { status: 200 });
    throw e;
  }
}
