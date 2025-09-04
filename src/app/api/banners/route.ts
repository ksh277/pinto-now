import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
  const items = await prisma.banners.findMany({ 
      where: { is_active: true },
      orderBy: { created_at: 'desc' }
    });
    
    // Transform data to match TopBanner component expectations
    const transformedItems = items.map(item => ({
      id: item.id.toString(),
      href: item.href || '#',
      imgSrc: item.image_url,
      alt: item.title
    }));
    
    return NextResponse.json(transformedItems, { status: 200 });
  } catch (e: any) {
    console.error('Banner API Error:', e);
    if (e?.code === 'P2021') return NextResponse.json([], { status: 200 });
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
  const created = await prisma.banners.create({
      data: {
        title: data.title,
        image_url: data.image_url,
        href: data.href ?? null,
        is_active: data.is_active ?? true,
        sort_order: data.sort_order ?? 0,
        start_at: data.start_at ? new Date(data.start_at) : new Date(),
        end_at: data.end_at ? new Date(data.end_at) : new Date('2025-12-31'),
      },
    });
    
    // Convert BigInt to string for JSON serialization
    const result = {
      ...created,
      id: created.id.toString(),
    };
    
    return NextResponse.json(result, { status: 201 });
  } catch (e: any) {
    console.error('Banner POST Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
