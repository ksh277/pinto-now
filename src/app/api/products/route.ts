import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET() {
  try {
    const sql = `
      SELECT 
        id,
        name as nameKo,
        price as priceKrw,
        thumbnail_url as imageUrl,
        status
      FROM products 
      WHERE status = 'ACTIVE'
      ORDER BY name ASC
    `;
    
    const results = await query(sql) as any[];
    
    const products = results.map((row) => ({
      id: row.id.toString(),
      nameKo: row.nameKo,
      priceKrw: row.priceKrw,
      imageUrl: row.imageUrl
    }));

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}