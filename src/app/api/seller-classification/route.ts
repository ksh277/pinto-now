import { NextRequest } from 'next/server';
import { query } from '@/lib/mysql';

interface Seller {
  id: number;
  brand_name: string;
  seller_type: string;
}

export async function GET(_req: NextRequest) {
  try {
    const sellers = await query<Seller[]>(`
      SELECT id, brand_name, seller_type
      FROM sellers 
      ORDER BY brand_name
    `);

    return Response.json({
      success: true,
      data: sellers
    });
  } catch (error) {
    console.error('Get sellers error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { sellerId, sellerType } = await req.json();

    if (!sellerId || !sellerType) {
      return Response.json({
        success: false,
        error: 'Seller ID and type are required'
      }, { status: 400 });
    }

    if (!['COMPANY', 'CREATOR', 'AUTHOR', 'INDIVIDUAL'].includes(sellerType)) {
      return Response.json({
        success: false,
        error: 'Invalid seller type'
      }, { status: 400 });
    }

    await query(`
      UPDATE sellers 
      SET seller_type = ?
      WHERE id = ?
    `, [sellerType, sellerId]);

    return Response.json({
      success: true,
      message: 'Seller type updated successfully'
    });

  } catch (error) {
    console.error('Update seller type error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST endpoint to create sample data for testing
export async function POST(_req: NextRequest) {
  try {
    // Check if we already have sample data
    const existingSellers = await query<{count: number}[]>(`
      SELECT COUNT(*) as count FROM sellers
    `);

    if (existingSellers[0]?.count > 0) {
      return Response.json({
        success: false,
        message: 'Sample data already exists'
      });
    }

    // Create sample sellers
    const sampleSellers = [
      { brand_name: '창작공간 아트', seller_type: 'CREATOR' },
      { brand_name: '작가스튜디오', seller_type: 'AUTHOR' },
      { brand_name: '개인작업실', seller_type: 'INDIVIDUAL' },
      { brand_name: '핸드메이드 크래프트', seller_type: 'CREATOR' },
      { brand_name: '아티스트 컬렉션', seller_type: 'AUTHOR' }
    ];

    // Create sample user first (needed for sellers)
    const userId = await query(`
      INSERT INTO users (email, password_hash, status)
      VALUES ('sample@example.com', 'sample_hash', 'ACTIVE')
    `);

    const userIdValue = (userId as any).insertId;

    // Insert sample sellers
    for (const seller of sampleSellers) {
      const sellerId = await query(`
        INSERT INTO sellers (user_id, brand_name, seller_type, status)
        VALUES (?, ?, ?, 'ACTIVE')
      `, [userIdValue, seller.brand_name, seller.seller_type]);

      const sellerIdValue = (sellerId as any).insertId;

      // Create sample products for each seller
      const sampleProducts = [
        {
          name: `${seller.brand_name} 티셔츠`,
          price: 25000,
          thumbnail_url: 'https://placehold.co/300x300/e2e8f0/64748b.png?text=Product'
        },
        {
          name: `${seller.brand_name} 머그컵`,
          price: 15000,
          thumbnail_url: 'https://placehold.co/300x300/f3f4f6/6b7280.png?text=Mug'
        }
      ];

      for (const product of sampleProducts) {
        await query(`
          INSERT INTO products (seller_id, category_id, name, slug, price, status, thumbnail_url)
          VALUES (?, 1, ?, ?, ?, 'ACTIVE', ?)
        `, [
          sellerIdValue, 
          product.name, 
          product.name.toLowerCase().replace(/\s+/g, '-'), 
          product.price, 
          product.thumbnail_url
        ]);
      }
    }

    return Response.json({
      success: true,
      message: 'Sample data created successfully',
      created: {
        sellers: sampleSellers.length,
        products: sampleSellers.length * 2
      }
    });

  } catch (error) {
    console.error('Create sample data error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}