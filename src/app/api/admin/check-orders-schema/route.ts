import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET(request: NextRequest) {
  try {
    // orders 테이블 스키마 조회
    const ordersSchema = await query(`DESCRIBE orders`) as any[];

    // order_items 테이블 스키마 조회
    let orderItemsSchema = [];
    try {
      orderItemsSchema = await query(`DESCRIBE order_items`) as any[];
    } catch (e) {
      console.log('order_items table does not exist');
    }

    // payments 테이블 스키마 조회
    let paymentsSchema = [];
    try {
      paymentsSchema = await query(`DESCRIBE payments`) as any[];
    } catch (e) {
      console.log('payments table does not exist');
    }

    return NextResponse.json({
      success: true,
      schemas: {
        orders: ordersSchema,
        order_items: orderItemsSchema,
        payments: paymentsSchema
      }
    });

  } catch (error) {
    console.error('Schema check error:', error);
    return NextResponse.json(
      { error: 'Failed to check schema', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';