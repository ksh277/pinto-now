import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.banner.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(items, { status: 200 });
  } catch (e: any) {
    if (e?.code === 'P2021') return NextResponse.json([], { status: 200 });
    throw e;
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  const created = await prisma.banner.create({
    data: {
      title: data.title,
      imageUrl: data.imageUrl,
      href: data.href ?? null,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
