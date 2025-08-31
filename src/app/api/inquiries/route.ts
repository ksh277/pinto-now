import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const items = await prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const data = await req.json();
  const created = await prisma.inquiry.create({ data: { email: data.email, message: data.message, status: data.status ?? undefined } });
  return NextResponse.json(created, { status: 201 });
}
