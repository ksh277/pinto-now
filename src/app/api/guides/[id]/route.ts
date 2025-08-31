import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  const item = await prisma.guide.findUnique({ where: { id: params.id } });
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: Params) {
  const data = await req.json();
  const updated = await prisma.guide.update({
    where: { id: params.id },
    data: { title: data.title ?? undefined, content: data.content ?? undefined },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Params) {
  await prisma.guide.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
