import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET() {
  try {
    const sql = `
      SELECT 
        id,
        title,
        image_url,
        href,
        sort_order,
        is_active
      FROM category_shortcuts
      WHERE is_active = 1
      ORDER BY sort_order ASC
    `;
    
    const results = await query(sql) as any[];
    
    const shortcuts = results.map((row) => ({
      id: row.id.toString(),
      title: row.title,
      image_url: row.image_url,
      href: row.href,
      sort_order: row.sort_order,
      is_active: Boolean(row.is_active)
    }));

    return NextResponse.json(shortcuts);
  } catch (error) {
    console.error('Failed to fetch category shortcuts:', error);
    
    // Return default shortcuts if database fails
    const defaultShortcuts = [
      { id: '1', title: '아크릴 굿즈', image_url: '/category/1.png', href: '/category/acrylic', sort_order: 1, is_active: true },
      { id: '2', title: '포토카드', image_url: '/category/2.png', href: '/category/photocard', sort_order: 2, is_active: true },
      { id: '3', title: '티셔츠 인쇄', image_url: '/category/3.png', href: '/category/tshirt', sort_order: 3, is_active: true },
      { id: '4', title: '컵 만들기', image_url: '/category/4.png', href: '/category/cup', sort_order: 4, is_active: true },
      { id: '5', title: '다꾸 만들기', image_url: '/category/5.png', href: '/category/diary', sort_order: 5, is_active: true },
      { id: '6', title: '반려동물 굿즈', image_url: '/category/6.png', href: '/category/pet', sort_order: 6, is_active: true },
      { id: '7', title: '단체 판촉물', image_url: '/category/7.png', href: '/category/promotion', sort_order: 7, is_active: true },
      { id: '8', title: '광고, 사인물', image_url: '/category/8.png', href: '/category/sign', sort_order: 8, is_active: true }
    ];
    
    return NextResponse.json(defaultShortcuts);
  }
}