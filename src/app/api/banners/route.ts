import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get('include_inactive') === 'true';
    const sortBy = searchParams.get('sort') || 'created_at';
    const sortOrder = searchParams.get('order') === 'asc' ? 'asc' : 'desc';
    const limit = parseInt(searchParams.get('limit') || '50');
    const bannerType = searchParams.get('banner_type');
    const deviceType = searchParams.get('device_type');

    let whereClause: any = includeInactive ? {} : { is_active: true };
    
    if (bannerType) {
      whereClause.banner_type = bannerType;
    }
    
    if (deviceType) {
      whereClause.OR = [
        { device_type: deviceType },
        { device_type: 'all' }
      ];
    }

    const orderByClause = sortBy === 'sort_order' 
      ? { sort_order: sortOrder as 'asc' | 'desc', created_at: 'desc' as const }
      : { [sortBy]: sortOrder as 'asc' | 'desc' };

    const items = await prisma.banners.findMany({
      where: whereClause,
      orderBy: orderByClause,
      take: Math.min(limit, 100),
    });

    const transformedItems = items.map((item: any) => ({
      id: item.id.toString(),
      href: item.href || '#',
      imgSrc: item.image_url,
      alt: item.title,
      title: item.title,
      mainTitle: item.main_title,
      subTitle: item.sub_title,
      moreButtonLink: item.more_button_link,
      bannerType: item.banner_type,
      deviceType: item.device_type,
      isActive: item.is_active,
      sortOrder: item.sort_order,
      startAt: item.start_at?.toISOString(),
      endAt: item.end_at?.toISOString(),
      createdAt: item.created_at?.toISOString(),
      updatedAt: item.updated_at?.toISOString(),
    }));

    return NextResponse.json(transformedItems, { status: 200 });
  } catch (e: any) {
    console.error('Banner API Error:', e);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.title || !data.image_url) {
      return NextResponse.json(
        { error: 'Title and image_url are required' }, 
        { status: 400 }
      );
    }

    const bannerType = data.banner_type || 'IMAGE_BANNER';
    const deviceType = data.device_type || 'all';
    const sortOrder = data.sort_order !== undefined ? parseInt(data.sort_order) : 0;
    const isActive = data.is_active !== undefined ? Boolean(data.is_active) : true;

    // 배너 타입별 제한 확인
    const existingCount = await prisma.banners.count({
      where: { 
        banner_type: bannerType,
        is_active: true 
      } as any
    });

    const limits: { [key: string]: number } = {
      'TOP_BANNER': 8,
      'STRIP_BANNER': 1,
      'HOME_SLIDER_PC': 2,
      'HOME_SLIDER_MOBILE': 1,
      'IMAGE_BANNER': 12
    };

    if (limits[bannerType] && existingCount >= limits[bannerType]) {
      return NextResponse.json(
        { error: `${bannerType} 타입의 배너는 최대 ${limits[bannerType]}개까지만 등록 가능합니다.` },
        { status: 400 }
      );
    }

    const createData: any = {
      title: data.title.trim(),
      image_url: data.image_url.trim(),
      href: data.href?.trim() || null,
      main_title: data.main_title?.trim() || null,
      sub_title: data.sub_title?.trim() || null,
      more_button_link: data.more_button_link?.trim() || null,
      banner_type: bannerType,
      device_type: deviceType,
      is_active: isActive,
      sort_order: sortOrder,
      start_at: data.start_at ? new Date(data.start_at) : new Date(),
      end_at: data.end_at ? new Date(data.end_at) : new Date('2025-12-31'),
    };

    const created = await prisma.banners.create({
      data: createData,
    });

    const result = {
      ...created,
      id: created.id.toString(),
    };

    return NextResponse.json(result, { status: 201 });
  } catch (e: any) {
    console.error('Banner POST Error:', e);
    console.error('Error details:', {
      code: e.code,
      name: e.name,
      message: e.message,
      stack: e.stack
    });
    
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'Duplicate entry' }, { status: 409 });
    }
    
    if (e.name === 'ValidationError') {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create banner', 
      details: e.message 
    }, { status: 500 });
  }
}
