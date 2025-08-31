import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const item = await prisma.stripBanner.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(item ?? null, { status: 200 });
  } catch (e: any) {
    if (e?.code === 'P2021') return NextResponse.json(null, { status: 200 });
    throw e;
  }
}
