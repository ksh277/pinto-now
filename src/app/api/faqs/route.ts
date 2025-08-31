import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const items = await prisma.faq.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const data = await req.json();
  const created = await prisma.faq.create({ data: { question: data.question, answer: data.answer } });
  return NextResponse.json(created, { status: 201 });
}
