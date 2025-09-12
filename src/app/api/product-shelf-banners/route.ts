import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET() {
  try {
    const sql = `
      SELECT 
        psb.id,
        psb.title,
        psb.description,
        psb.image_url,
        psb.sort_order,
        JSON_ARRAYAGG(
          CASE 
            WHEN p.id IS NOT NULL THEN
              JSON_OBJECT(
                'id', p.id,
                'nameKo', p.name,
                'priceKrw', p.price,
                'imageUrl', p.thumbnail_url,
                'stats', JSON_OBJECT('likeCount', 0, 'reviewCount', 0)
              )
            ELSE NULL
          END
        ) as products
      FROM product_shelf_banners psb
      LEFT JOIN product_shelf_banner_products psbp ON psb.id = psbp.banner_id
      LEFT JOIN products p ON psbp.product_id = p.id AND p.status = 'ACTIVE'
      WHERE psb.is_active = 1
      GROUP BY psb.id, psb.title, psb.description, psb.image_url, psb.sort_order
      ORDER BY psb.sort_order ASC, psb.id ASC
    `;
    
    const results = await query(sql) as any[];
    
    const banners = results.map((row) => ({
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      imageUrl: row.image_url,
      sortOrder: row.sort_order,
      products: row.products ? 
        (typeof row.products === 'string' ? 
          JSON.parse(row.products).filter((p: any) => p !== null) : 
          Array.isArray(row.products) ? row.products.filter((p: any) => p !== null) : []
        ) : []
    }));

    return NextResponse.json({ banners });
  } catch (error) {
    console.error('Failed to fetch product shelf banners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { title, description, imageUrl, sortOrder, productIds } = await request.json();

    if (!title || !description || !imageUrl) {
      return NextResponse.json(
        { error: 'Title, description, and imageUrl are required' },
        { status: 400 }
      );
    }

    // Create banner
    const bannerSql = `
      INSERT INTO product_shelf_banners (title, description, image_url, sort_order)
      VALUES (?, ?, ?, ?)
    `;

    const result = await query(bannerSql, [
      title,
      description,
      imageUrl,
      sortOrder || 0
    ]) as any;

    const bannerId = result.insertId;

    // Add product associations
    if (productIds && productIds.length > 0) {
      const productAssociations = productIds.map((productId: number, index: number) => [
        bannerId,
        productId,
        index
      ]);

      const productSql = `
        INSERT INTO product_shelf_banner_products (banner_id, product_id, sort_order)
        VALUES ${productAssociations.map(() => '(?, ?, ?)').join(', ')}
      `;

      await query(productSql, productAssociations.flat());
    }

    return NextResponse.json({
      id: bannerId.toString(),
      title,
      description,
      imageUrl,
      sortOrder: sortOrder || 0
    });
  } catch (error) {
    console.error('Failed to create banner:', error);
    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}