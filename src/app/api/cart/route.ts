import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, sizeId, printType, quantity, customOptions, userId = 1 } = body;

    // 상품 정보 조회
    const products = await query(`
      SELECT id, name, price
      FROM products
      WHERE id = ? AND status = 'ACTIVE'
    `, [productId]) as any[];

    if (products.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = products[0];

    // 상품 상세 정보로부터 가격 계산
    const productDetails = await query(`
      SELECT detail_data
      FROM product_details
      WHERE product_id = ?
    `, [productId]) as any[];

    let calculatedPrice = product.price;

    if (productDetails.length > 0) {
      try {
        const detailData = JSON.parse(productDetails[0].detail_data);
        const pricingData = detailData.pricingData || detailData;

        if (pricingData && pricingData.pricingTiers) {
          const tier = pricingData.pricingTiers.find((t: any) => t.type === printType) || pricingData.pricingTiers[0];
          if (tier && tier.prices && tier.prices[sizeId]) {
            // 수량에 따른 가격 결정
            const pricesByQuantity = tier.prices[sizeId];
            let selectedPrice = calculatedPrice;

            for (const [range, price] of Object.entries(pricesByQuantity)) {
              const [min, max] = range.split('-').map(s => parseInt(s.replace(/[^0-9]/g, '')));
              if (quantity >= min && (isNaN(max) || quantity <= max)) {
                selectedPrice = price as number;
                break;
              }
            }
            calculatedPrice = selectedPrice;
          }
        }
      } catch (e) {
        console.error('Error parsing pricing data:', e);
      }
    }

    // 기존 카트 아이템 확인
    const existingItems = await query(`
      SELECT id, quantity
      FROM cart_items
      WHERE user_id = ? AND product_id = ? AND size_id = ? AND print_type = ?
    `, [userId, productId, sizeId, printType]) as any[];

    if (existingItems.length > 0) {
      // 기존 아이템 수량 업데이트
      const newQuantity = existingItems[0].quantity + quantity;
      await query(`
        UPDATE cart_items
        SET quantity = ?, unit_price = ?, updated_at = NOW()
        WHERE id = ?
      `, [newQuantity, calculatedPrice, existingItems[0].id]);

      return NextResponse.json({
        success: true,
        message: 'Cart updated',
        cartItemId: existingItems[0].id,
        quantity: newQuantity
      });
    } else {
      // 새 카트 아이템 추가
      const result = await query(`
        INSERT INTO cart_items (user_id, product_id, size_id, print_type, quantity, unit_price, custom_options, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [userId, productId, sizeId, printType, quantity, calculatedPrice, JSON.stringify(customOptions || {})]) as any;

      return NextResponse.json({
        success: true,
        message: 'Added to cart',
        cartItemId: result.insertId,
        quantity: quantity
      });
    }

  } catch (error) {
    console.error('Cart API error:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = 1; // 임시 사용자 ID

    const cartItems = await query(`
      SELECT
        ci.id as cart_item_id,
        ci.quantity,
        ci.unit_price,
        ci.size_id,
        ci.print_type,
        ci.custom_options,
        p.id as product_id,
        p.name as product_name,
        p.thumbnail_url as product_image
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `, [userId]) as any[];

    const totalAmount = cartItems.reduce((sum: number, item: any) =>
      sum + (item.unit_price * item.quantity), 0
    );

    return NextResponse.json({
      success: true,
      items: cartItems,
      totalAmount,
      itemCount: cartItems.length
    });

  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';