import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET() {
  try {
    const items = await query(
      'SELECT * FROM banners WHERE is_active = ? ORDER BY created_at DESC LIMIT 1',
      [true]
    ) as any[];
    
    if (!items || items.length === 0) {
      return NextResponse.json(null, { status: 200 });
    }

    const item = items[0];
    const result = {
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
      startAt: item.start_at ? new Date(item.start_at).toISOString() : null,
      endAt: item.end_at ? new Date(item.end_at).toISOString() : null,
      createdAt: item.created_at ? new Date(item.created_at).toISOString() : null,
      updatedAt: item.updated_at ? new Date(item.updated_at).toISOString() : null,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    console.error('Strip Banner Error:', e);
    return NextResponse.json(null, { status: 200 });
  }
}
