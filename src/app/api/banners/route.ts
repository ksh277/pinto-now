import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const items = await prisma.banner.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const data = await req.json();
  const created = await prisma.banner.create({
    data: {
      href: data.href ?? '#',
      imgSrc: data.imgSrc,
      alt: data.alt ?? '',
    },
  });
  return NextResponse.json(created, { status: 201 });
}
