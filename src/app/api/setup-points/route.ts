import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function POST(req: NextRequest) {
  try {
    console.log('Creating point_ledger table...');
    
    // Check if table exists
    const tableCheck = await query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'point_ledger'
    `);
    
    const tableExists = (tableCheck as any)[0].count > 0;
    
    if (tableExists) {
      console.log('point_ledger table already exists');
      return NextResponse.json({
        success: true,
        message: 'point_ledger table already exists'
      });
    }

    // Create point_ledger table
    await query(`
      CREATE TABLE point_ledger (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        direction ENUM('EARN', 'SPEND', 'EXPIRE', 'ADJUST') NOT NULL,
        amount INT NOT NULL,
        balance INT NOT NULL,
        description VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('point_ledger table created successfully');

    // Add some test data for user ID 1 (if exists)
    const users = await query(`SELECT id FROM users LIMIT 1`);
    
    if (users && (users as any).length > 0) {
      const userId = (users as any)[0].id;
      console.log(`Adding test points for user ${userId}`);
      
      // Add some test point transactions
      await query(`
        INSERT INTO point_ledger (user_id, direction, amount, balance, description) VALUES
        (?, 'EARN', 1000, 1000, '회원가입 축하 포인트'),
        (?, 'EARN', 500, 1500, '첫 주문 완료 포인트'),
        (?, 'SPEND', 200, 1300, '주문 시 포인트 사용'),
        (?, 'EARN', 300, 1600, '리뷰 작성 포인트')
      `, [userId, userId, userId, userId]);
      
      console.log('Test point data added');
    }

    return NextResponse.json({
      success: true,
      message: 'point_ledger table created successfully'
    });

  } catch (error) {
    console.error('Setup points error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}