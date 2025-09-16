import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET() {
  try {
    // 컬럼이 존재하는지 확인
    const checkColumns = await query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'order_items'
      AND COLUMN_NAME IN ('design_file_name', 'design_file_type', 'design_file_url')
    `) as any[];

    const existingColumns = checkColumns.map((row: any) => row.COLUMN_NAME);
    const columnsToAdd = [];

    if (!existingColumns.includes('design_file_name')) {
      columnsToAdd.push('ADD COLUMN design_file_name VARCHAR(255) DEFAULT NULL');
    }
    if (!existingColumns.includes('design_file_type')) {
      columnsToAdd.push('ADD COLUMN design_file_type VARCHAR(100) DEFAULT NULL');
    }
    if (!existingColumns.includes('design_file_url')) {
      columnsToAdd.push('ADD COLUMN design_file_url TEXT DEFAULT NULL');
    }

    if (columnsToAdd.length > 0) {
      await query(`ALTER TABLE order_items ${columnsToAdd.join(', ')}`);
    }

    return NextResponse.json({
      success: true,
      message: `order_items 테이블 업데이트 완료. 추가된 컬럼: ${columnsToAdd.length}개`,
      addedColumns: columnsToAdd
    });
  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup database', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}