import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET() {
  try {
    console.log('=== 주문 플로우 테스트 ===');

    // 1. 테스트 주문 데이터 생성
    const testOrderId = `TEST-${Date.now()}`;
    const testOrderNumber = `TEST${Date.now().toString().slice(-6)}`;

    const addrSnapshot = {
      recipientName: '테스트 고객',
      phone: '010-1234-5678',
      zipCode: '12345',
      address: '서울시 강남구 테스트로 123',
      detailAddress: '101호',
      deliveryMemo: '문 앞에 놓아주세요',
      paymentMethod: 'card',
      installment: '일시불',
      receiptType: 'email'
    };

    // 2. 주문 생성
    const orderResult = await query(
      `INSERT INTO orders (
        order_no, user_id, status,
        total_amount, discount_amount, shipping_fee, point_used,
        addr_snapshot, memo,
        created_at, updated_at
      ) VALUES (?, 1, 'PENDING', ?, ?, ?, 0, ?, ?, NOW(), NOW())`,
      [
        testOrderNumber,
        164600, 0, 3000,
        JSON.stringify(addrSnapshot),
        '테스트 주문입니다'
      ]
    ) as any;

    const orderId = orderResult.insertId;

    // 3. 주문 상품 생성 (라미키링 20x20 101개)
    await query(
      `INSERT INTO order_items (
        order_id, product_id, product_name,
        qty, unit_price, option_snapshot,
        design_file_name, design_file_type, design_file_url,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        orderId, '6', '라미키링',
        101, 1600,
        JSON.stringify({
          size: '20x20',
          printType: 'single',
          customText: '',
          nameKo: '라미키링',
          nameEn: 'Laminated Keyring',
          image: '/components/img/placeholder-product.jpg'
        }),
        'test-design.pdf', 'application/pdf', null
      ]
    );

    // 4. 생성된 주문 조회
    const order = await query(`
      SELECT
        o.*,
        GROUP_CONCAT(
          CONCAT(oi.product_name, ' (', oi.qty, '개) - ', oi.design_file_name)
          SEPARATOR ', '
        ) as items_summary
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ?
      GROUP BY o.id
    `, [orderId]);

    // 5. 주문 상품 상세 조회
    const orderItems = await query(`
      SELECT *
      FROM order_items
      WHERE order_id = ?
    `, [orderId]);

    return NextResponse.json({
      success: true,
      message: '주문 플로우 테스트 완료',
      testData: {
        orderId: orderId,
        orderNumber: testOrderNumber,
        order: order[0],
        items: orderItems.map((item: any) => ({
          ...item,
          options: JSON.parse(item.option_snapshot || '{}')
        }))
      }
    });

  } catch (error) {
    console.error('Order flow test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to test order flow',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}