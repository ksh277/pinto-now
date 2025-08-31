import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const item = await prisma.stripBanner.findFirst({ where: { isActive: true }, orderBy: { createdAt: 'desc' } });
  if (!item) return NextResponse.json(null);
  return NextResponse.json(item);
}
