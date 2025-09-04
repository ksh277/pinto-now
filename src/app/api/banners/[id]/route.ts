import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  try {
    const item = await prisma.banners.findUnique({ where: { id: BigInt(params.id) } });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    const result = {
      ...item,
      id: item.id.toString(),
    };
    
    return NextResponse.json(result);
  } catch (e: any) {
    console.error('Banner GET Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const data = await req.json();
    const updated = await prisma.banners.update({
      where: { id: BigInt(params.id) },
      data: {
        title: data.title ?? undefined,
        image_url: data.image_url ?? undefined,
        href: data.href ?? undefined,
        is_active: data.is_active ?? undefined,
        sort_order: data.sort_order ?? undefined,
      },
    });
    
    const result = {
      ...updated,
      id: updated.id.toString(),
    };
    
    return NextResponse.json(result);
  } catch (e: any) {
    console.error('Banner PUT Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await prisma.banners.delete({ where: { id: BigInt(params.id) } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('Banner DELETE Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
