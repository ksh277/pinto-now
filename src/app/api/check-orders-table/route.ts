import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET() {
  try {
    // orders 테이블 구조 확인
    const ordersStructure = await query(`
      DESCRIBE orders
    `);

    // order_items 테이블 구조 확인
    const orderItemsStructure = await query(`
      DESCRIBE order_items
    `);

    return NextResponse.json({
      success: true,
      tables: {
        orders: ordersStructure,
        order_items: orderItemsStructure
      }
    });

  } catch (error) {
    console.error('Check tables error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check tables',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}