import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getPricingByProductId, hasAdvancedPricing } from '@/lib/pricing-data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 아크릴 상품들 (1-9)에 대해서는 pricing-data.ts의 데이터를 사용
    if (hasAdvancedPricing(id)) {
      const pricingData = getPricingByProductId(id);
      if (pricingData) {
        const product = {
          id: id,
          nameKo: pricingData.name,
          nameEn: pricingData.name,
          descriptionKo: `고품질 ${pricingData.name}를 다양한 사이즈와 옵션으로 제작합니다.`,
          descriptionEn: `High-quality ${pricingData.name} available in various sizes and options.`,
          imageUrl: "/components/img/placeholder-product.jpg",
          categoryId: "1", // 아크릴 굿즈 카테고리
          subcategory: '',
          isPublished: true,
          isFeatured: false,
          status: 'ACTIVE',
          stockQuantity: 999,
          pricingData: pricingData,
          priceKrw: pricingData.pricingTiers[0]?.prices ? Math.min(...Object.values(pricingData.pricingTiers[0].prices).filter(p => p > 0)) : 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        return NextResponse.json({ product });
      }
    }

    // 일반 상품들은 데이터베이스에서 조회
    const sql = `
      SELECT
        id,
        name,
        description,
        thumbnail_url as imageUrl,
        category_id as categoryId,
        price,
        stock,
        status,
        created_at as createdAt,
        updated_at as updatedAt
      FROM products
      WHERE id = ? AND status != 'DELETED'
    `;

    const results = await query(sql, [id]) as any[];

    if (results.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const row = results[0];
    const product = {
      id: row.id.toString(),
      nameKo: row.name,
      nameEn: row.name,
      descriptionKo: row.description || '',
      descriptionEn: row.description || '',
      imageUrl: row.imageUrl,
      categoryId: row.categoryId.toString(),
      subcategory: '',
      isPublished: true,
      isFeatured: false,
      status: row.status,
      stockQuantity: row.stock,
      pricingData: null,
      priceKrw: row.price,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const {
      nameKo,
      nameEn,
      descriptionKo,
      descriptionEn,
      imageUrl,
      categoryId,
      subcategory,
      isPublished,
      isFeatured,
      status,
      stockQuantity,
      printTypes,
      sizes,
      pricingTiers,
      customOptions
    } = await request.json();

    // 최소 가격 계산
    let minPrice = 0;
    if (pricingTiers && pricingTiers.length > 0) {
      const firstTier = pricingTiers[0];
      if (firstTier.prices) {
        const prices = Object.values(firstTier.prices) as number[];
        minPrice = Math.min(...prices.filter(p => p > 0));
      }
    }

    const pricingData = {
      printTypes,
      sizes,
      pricingTiers,
      customOptions,
      minPrice
    };

    const sql = `
      UPDATE products SET
        name = ?,
        description = ?,
        thumbnail_url = ?,
        category_id = ?,
        price = ?,
        stock = ?,
        status = ?,
        updated_at = NOW()
      WHERE id = ?
    `;

    await query(sql, [
      nameKo,
      descriptionKo || null,
      imageUrl,
      categoryId,
      minPrice,
      stockQuantity || 0,
      status || 'ACTIVE',
      id
    ]);

    return NextResponse.json({
      success: true,
      message: '상품이 성공적으로 수정되었습니다.'
    });
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 인증 토큰 확인 (개발 환경에서는 임시로 우회)
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    // if (!token) {
    //   return NextResponse.json(
    //     { error: 'Authentication required' },
    //     { status: 401 }
    //   );
    // }

    // 아크릴 상품들 (1-9)은 pricing-data.ts에서 관리되므로 삭제 불가
    if (hasAdvancedPricing(id)) {
      return NextResponse.json({
        success: false,
        message: '아크릴 상품은 시스템에서 관리되므로 삭제할 수 없습니다.'
      }, { status: 400 });
    }

    // 실제 데이터베이스에서 상품 삭제
    const sql = `DELETE FROM products WHERE id = ?`;
    await query(sql, [id]);

    return NextResponse.json({
      success: true,
      message: '상품이 성공적으로 삭제되었습니다.'
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}