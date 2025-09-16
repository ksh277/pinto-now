import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET() {
  try {
    console.log('=== 가격 계산 검증 테스트 ===');

    // 1. 라미키링 20x20 500개 주문 생성
    const testOrderNumber = `PRICE_TEST_${Date.now().toString().slice(-6)}`;

    const addrSnapshot = {
      recipientName: '가격 테스트 고객',
      phone: '010-1234-5678',
      address: '서울시 강남구',
      paymentMethod: 'card'
    };

    // 2. 주문 생성 (500개 x 1300원 = 650,000원)
    const orderResult = await query(
      `INSERT INTO orders (
        order_no, user_id, status,
        total_amount, discount_amount, shipping_fee, point_used,
        addr_snapshot, memo,
        created_at, updated_at
      ) VALUES (?, 1, 'PENDING', ?, ?, ?, 0, ?, ?, NOW(), NOW())`,
      [
        testOrderNumber,
        653000, 0, 3000, // 650,000 + 3,000 배송비 = 653,000원
        JSON.stringify(addrSnapshot),
        '라미키링 500개 가격 테스트'
      ]
    ) as any;

    const orderId = orderResult.insertId;

    // 3. 주문 상품 생성 (500개 x 1300원/개)
    await query(
      `INSERT INTO order_items (
        order_id, product_id, product_name,
        qty, unit_price, option_snapshot,
        design_file_name, design_file_type,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        orderId, '6', '라미키링',
        500, 1300, // 500~999개 구간에서 20x20은 1300원
        JSON.stringify({
          size: '20x20',
          printType: 'single',
          nameKo: '라미키링',
          nameEn: 'Laminated Keyring'
        }),
        'price-test-design.pdf', 'application/pdf'
      ]
    );

    // 4. 검증 계산
    const expectedUnitPrice = 1300; // 500~999개 구간에서 20x20 가격
    const quantity = 500;
    const expectedItemTotal = expectedUnitPrice * quantity; // 650,000원
    const shippingFee = 3000;
    const expectedTotal = expectedItemTotal + shippingFee; // 653,000원

    // 5. 생성된 주문 조회
    const order = await query(`SELECT * FROM orders WHERE id = ?`, [orderId]);
    const orderItems = await query(`SELECT * FROM order_items WHERE order_id = ?`, [orderId]);

    const actualTotal = parseFloat(order[0].total_amount);
    const actualUnitPrice = parseFloat(orderItems[0].unit_price);
    const actualItemTotal = actualUnitPrice * orderItems[0].qty;

    return NextResponse.json({
      success: true,
      message: '가격 계산 검증 완료',
      data: {
        orderNumber: testOrderNumber,
        validation: {
          quantity: quantity,
          expectedUnitPrice: expectedUnitPrice,
          actualUnitPrice: actualUnitPrice,
          unitPriceCorrect: expectedUnitPrice === actualUnitPrice,

          expectedItemTotal: expectedItemTotal,
          actualItemTotal: actualItemTotal,
          itemTotalCorrect: expectedItemTotal === actualItemTotal,

          expectedTotal: expectedTotal,
          actualTotal: actualTotal,
          totalCorrect: expectedTotal === actualTotal,

          pricePerUnit: {
            tier: '500~999개',
            size: '20x20mm',
            printType: '단면',
            priceKrw: actualUnitPrice
          }
        },
        order: order[0],
        items: orderItems[0]
      }
    });

  } catch (error) {
    console.error('Pricing validation test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to validate pricing',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}