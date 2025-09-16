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
    
    const banners = await Promise.all(results.map(async (row) => {
      const products = row.products ?
        (typeof row.products === 'string' ?
          JSON.parse(row.products).filter((p: any) => p !== null) :
          Array.isArray(row.products) ? row.products.filter((p: any) => p !== null) : []
        ) : [];

      // 각 상품의 정확한 데이터를 개별 API에서 가져오기
      const enhancedProducts = await Promise.all(products.map(async (p: any) => {
        try {
          // 아크릴 상품 (ID 1-9)의 경우 개별 API에서 정확한 데이터 가져오기
          if (p.id >= 1 && p.id <= 9) {
            const productResponse = await fetch(`http://localhost:3000/api/products/${p.id}`);
            if (productResponse.ok) {
              const productData = await productResponse.json();
              const product = productData.product;

              // pricing data가 있는 경우 소량 주문(1~9개) 구간의 최저가를 계산
              let displayPrice = product.priceKrw;
              if (product.pricingData && product.pricingData.pricingTiers && product.pricingData.pricingTiers.length > 0) {
                // 첫 번째 수량 구간 (1~9개)의 가격 사용
                const firstTier = product.pricingData.pricingTiers[0];
                if (firstTier.prices) {
                  const tierPrices = Object.values(firstTier.prices) as number[];
                  const validTierPrices = tierPrices.filter(price => typeof price === 'number' && price > 0);

                  if (validTierPrices.length > 0) {
                    displayPrice = Math.min(...validTierPrices);
                  }
                }
              }

              return {
                id: p.id,
                nameKo: product.nameKo,
                priceKrw: displayPrice,
                imageUrl: product.imageUrl,
                stats: { likeCount: 0, reviewCount: 0 }
              };
            }
          }

          // 일반 상품의 경우 기존 데이터 사용 (깨진 텍스트만 교체)
          return {
            ...p,
            nameKo: p.nameKo?.includes('�') ? '아크릴 상품' : p.nameKo
          };
        } catch (error) {
          console.error(`Error fetching product ${p.id}:`, error);
          return {
            ...p,
            nameKo: p.nameKo?.includes('�') ? '아크릴 상품' : p.nameKo
          };
        }
      }));

      return {
        id: row.id.toString(),
        title: row.title,
        description: row.description,
        imageUrl: row.image_url,
        moreLink: null,
        sortOrder: row.sort_order,
        products: enhancedProducts
      };
    }));

    return NextResponse.json({ banners }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
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

    const { title, description, imageUrl, moreLink, sortOrder, productIds } = await request.json();

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