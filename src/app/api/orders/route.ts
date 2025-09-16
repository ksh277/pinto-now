import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyToken } from '@/lib/auth/jwt';

interface OrderItem {
  productId: string;
  nameKo: string;
  nameEn: string;
  quantity: number;
  price: number;
  options: any;
  image: string;
  designFile?: {
    name: string;
    type: string;
    url?: string;
  };
}

interface OrderData {
  items: OrderItem[];
  shipping: {
    recipientName: string;
    phone: string;
    zipCode: string;
    address: string;
    detailAddress: string;
    deliveryMemo: string;
  };
  payment: {
    method: string;
    installment: string;
    receiptType: string;
  };
  amounts: {
    itemsTotal: number;
    shippingFee: number;
    pointsUsed: number;
    finalAmount: number;
  };
  pointsToUse: number;
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await verifyToken(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orderData: OrderData = await req.json();

    // 입력 검증
    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }

    if (!orderData.shipping.recipientName || !orderData.shipping.phone || !orderData.shipping.address) {
      return NextResponse.json({ error: 'Missing shipping information' }, { status: 400 });
    }

    // 포인트 사용량 검증
    if (orderData.pointsToUse > 0) {
      const latestBalanceResult = await query<{ balance: number }[]>(`
        SELECT balance 
        FROM point_ledger 
        WHERE user_id = ? 
        ORDER BY created_at DESC, id DESC 
        LIMIT 1
      `, [authUser.id]);

      const availablePoints = latestBalanceResult[0]?.balance || 0;
      
      if (availablePoints < orderData.pointsToUse) {
        return NextResponse.json({ error: 'Insufficient points' }, { status: 400 });
      }
    }

    // 주문번호 생성
    const orderNumber = `${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;

    // 배송 주소 정보 JSON으로 변환
    const addrSnapshot = {
      recipientName: orderData.shipping.recipientName,
      phone: orderData.shipping.phone,
      zipCode: orderData.shipping.zipCode || '',
      address: orderData.shipping.address,
      detailAddress: orderData.shipping.detailAddress || '',
      deliveryMemo: orderData.shipping.deliveryMemo || '',
      paymentMethod: orderData.payment.method,
      installment: orderData.payment.installment,
      receiptType: orderData.payment.receiptType
    };

    // 트랜잭션 시작 (MySQL)
    try {
      // 1. 주문 정보 저장
      const orderResult = await query(
        `INSERT INTO orders (
          order_no, user_id, status,
          total_amount, discount_amount, shipping_fee, point_used,
          addr_snapshot, memo,
          created_at, updated_at
        ) VALUES (?, ?, 'PENDING', ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          orderNumber, authUser.id,
          orderData.amounts.finalAmount,
          orderData.amounts.itemsTotal - orderData.amounts.finalAmount + orderData.amounts.shippingFee + orderData.amounts.pointsUsed,
          orderData.amounts.shippingFee,
          orderData.amounts.pointsUsed,
          JSON.stringify(addrSnapshot),
          orderData.shipping.deliveryMemo || ''
        ]
      ) as any;

      const orderId = orderResult.insertId;

      // 2. 주문 상품 정보 저장
      for (const item of orderData.items) {
        await query(
          `INSERT INTO order_items (
            order_id, product_id, product_name,
            qty, unit_price, option_snapshot,
            design_file_name, design_file_type, design_file_url,
            created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            orderId,
            item.productId,
            item.nameKo,
            item.quantity,
            item.price,
            JSON.stringify({
              ...item.options,
              nameKo: item.nameKo,
              nameEn: item.nameEn,
              image: item.image
            }),
            item.designFile?.name || null,
            item.designFile?.type || null,
            item.designFile?.url || null
          ]
        );
      }

      // 3. 포인트 사용 처리
      if (orderData.pointsToUse > 0) {
        // 현재 잔액 조회
        const latestBalanceResult = await query<{ balance: number }[]>(`
          SELECT balance 
          FROM point_ledger 
          WHERE user_id = ? 
          ORDER BY created_at DESC, id DESC 
          LIMIT 1
        `, [authUser.id]);

        const currentBalance = latestBalanceResult[0]?.balance || 0;
        const newBalance = currentBalance - orderData.pointsToUse;

        // 포인트 사용 기록 추가
        await query(
          `INSERT INTO point_ledger (user_id, direction, amount, balance, description) 
           VALUES (?, 'SPEND', ?, ?, '주문 결제 시 포인트 사용')`,
          [authUser.id, orderData.pointsToUse, newBalance]
        );
      }

      // 4. 결제 정보 저장 (결제 대기 상태)
      await query(
        `INSERT INTO payments (
          order_id, user_id, payment_method, amount, status,
          payment_key, created_at, updated_at
        ) VALUES (?, ?, ?, ?, 'pending', NULL, NOW(), NOW())`,
        [orderId, authUser.id, orderData.payment.method, orderData.amounts.finalAmount]
      );

      return NextResponse.json({
        success: true,
        orderId: orderId,
        orderNumber: orderNumber,
        message: 'Order created successfully'
      });

    } catch (dbError) {
      console.error('Database error during order creation:', dbError);
      return NextResponse.json(
        { error: 'Failed to create order' }, 
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const authUser = await verifyToken(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 사용자의 주문 목록 조회
    const orders = await query(
      `SELECT
        id, order_no, status, total_amount,
        addr_snapshot, created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 20`,
      [authUser.id]
    ) as any[];

    // addr_snapshot JSON 파싱
    const ordersWithParsedAddr = orders.map((order: any) => ({
      ...order,
      address: order.addr_snapshot ? JSON.parse(order.addr_snapshot) : null
    }));

    return NextResponse.json({ orders: ordersWithParsedAddr });

  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';