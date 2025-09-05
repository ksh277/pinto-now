import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const item = await prisma.banners.findUnique({ where: { id: BigInt(id) } });
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
    const { id } = await params;
    const bannerId = BigInt(id);
    
    const data = await req.json();

    const existingBanner = await prisma.banners.findUnique({
      where: { id: bannerId }
    });

    if (!existingBanner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    const updateData: any = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.image_url !== undefined) updateData.image_url = data.image_url;
    if (data.href !== undefined) updateData.href = data.href;
    if (data.banner_type !== undefined) updateData.banner_type = data.banner_type;
    if (data.device_type !== undefined) updateData.device_type = data.device_type;
    if (data.is_active !== undefined) updateData.is_active = Boolean(data.is_active);
    if (data.sort_order !== undefined) updateData.sort_order = parseInt(data.sort_order);
    if (data.start_at !== undefined) updateData.start_at = new Date(data.start_at);
    if (data.end_at !== undefined) updateData.end_at = new Date(data.end_at);

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const updated = await prisma.banners.update({
      where: { id: bannerId },
      data: updateData
    });
    
    const result = {
      ...updated,
      id: updated.id.toString(),
    };
    
    return NextResponse.json(result);
  } catch (e: any) {
    console.error('Banner PUT Error:', e);
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'Duplicate entry' }, { status: 409 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const bannerId = BigInt(id);

    const existingBanner = await prisma.banners.findUnique({
      where: { id: bannerId }
    });

    if (!existingBanner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    await prisma.banners.delete({ 
      where: { id: bannerId } 
    });
    
    return NextResponse.json({ 
      message: 'Banner deleted successfully',
      deletedId: id 
    });
  } catch (e: any) {
    console.error('Banner DELETE Error:', e);
    if (e.code === 'P2025') {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
