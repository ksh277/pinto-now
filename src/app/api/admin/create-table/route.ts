import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function POST(request: NextRequest) {
  try {
    // product_details 테이블 생성
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS product_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        detail_data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_product_id (product_id)
      )
    `;

    await query(createTableSQL);

    return NextResponse.json({
      success: true,
      message: 'product_details 테이블이 생성되었습니다.'
    });

  } catch (error) {
    console.error('Table creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create table', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';