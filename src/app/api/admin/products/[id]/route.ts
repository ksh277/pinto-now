import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyRequestAuth } from '@/lib/auth/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 관리자 권한 확인 (개발 중 임시 우회)
    // const authUser = await verifyRequestAuth(request);
    // if (!authUser || authUser.role !== 'admin') {
    //   return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    // }

    const productId = params.id;

    // 상품 기본 정보 조회
    const products = await query(`
      SELECT
        p.id,
        p.name,
        p.description,
        p.thumbnail_url as imageUrl,
        p.category_id as categoryId,
        p.price,
        p.stock,
        p.status,
        p.slug,
        p.is_customizable,
        p.description_detail,
        p.created_at as createdAt,
        p.updated_at as updatedAt
      FROM products p
      WHERE p.id = ?
    `, [productId]) as any[];

    if (products.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = products[0];

    // 상품 상세 정보 조회
    const productDetails = await query(`
      SELECT detail_data
      FROM product_details
      WHERE product_id = ?
    `, [productId]) as any[];

    let pricingData = null;
    let descriptionImageUrl = null;
    let additionalImages = [];

    if (productDetails.length > 0) {
      try {
        const detailData = JSON.parse(productDetails[0].detail_data);
        pricingData = detailData.pricingData || detailData;
        descriptionImageUrl = detailData.descriptionImageUrl;
        additionalImages = detailData.additionalImages || [];
      } catch (e) {
        console.error('Error parsing product detail data:', e);
      }
    }

    // 응답 데이터 구성
    const productData = {
      ...product,
      pricingData,
      descriptionImageUrl,
      additionalImages
    };

    return NextResponse.json(productData);

  } catch (error) {
    console.error('Admin product detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 관리자 권한 확인 (개발 중 임시 우회)
    // const authUser = await verifyRequestAuth(request);
    // if (!authUser || authUser.role !== 'admin') {
    //   return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    // }

    const productId = params.id;
    const body = await request.json();

    const {
      name,
      description,
      imageUrl,
      categoryId,
      price,
      stock,
      status,
      pricingData,
      descriptionImageUrl,
      additionalImages
    } = body;

    // pricing 데이터에서 최소 가격 계산
    let calculatedPrice = price;
    if (!calculatedPrice && pricingData?.pricingTiers?.length > 0) {
      const firstTier = pricingData.pricingTiers[0];
      if (firstTier.prices && Object.keys(firstTier.prices).length > 0) {
        const allPrices = [];
        for (const sizeKey of Object.keys(firstTier.prices)) {
          const sizePrices = firstTier.prices[sizeKey];
          if (typeof sizePrices === 'object') {
            for (const quantityKey of Object.keys(sizePrices)) {
              const priceValue = sizePrices[quantityKey];
              if (typeof priceValue === 'number' && priceValue > 0) {
                allPrices.push(priceValue);
              }
            }
          }
        }
        if (allPrices.length > 0) {
          calculatedPrice = Math.min(...allPrices);
        }
      }
    }

    // 기본 상품 정보 업데이트
    await query(`
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
    `, [
      name,
      description,
      imageUrl,
      parseInt(categoryId) || 1,
      calculatedPrice || price || 10000,
      stock || 100,
      status || 'ACTIVE',
      productId
    ]);

    // 상세 정보 업데이트
    if (pricingData || descriptionImageUrl || additionalImages) {
      const detailData = {
        pricingData,
        descriptionImageUrl,
        additionalImages: additionalImages || [],
        lastUpdated: new Date().toISOString()
      };

      await query(`
        INSERT INTO product_details (product_id, detail_data)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE detail_data = VALUES(detail_data)
      `, [productId, JSON.stringify(detailData)]);
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 관리자 권한 확인 (개발 중 임시 우회)
    // const authUser = await verifyRequestAuth(request);
    // if (!authUser || authUser.role !== 'admin') {
    //   return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    // }

    const productId = params.id;

    // 소프트 삭제 (status를 DELETED로 변경)
    await query(`
      UPDATE products SET
        status = 'DELETED',
        updated_at = NOW()
      WHERE id = ?
    `, [productId]);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Product deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';