import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  const item = await prisma.faq.findUnique({ where: { id: params.id } });
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: Params) {
  const data = await req.json();
  const updated = await prisma.faq.update({
    where: { id: params.id },
    data: { question: data.question ?? undefined, answer: data.answer ?? undefined },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Params) {
  await prisma.faq.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
