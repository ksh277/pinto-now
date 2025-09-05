import { NextRequest } from 'next/server';
import { query } from '@/lib/mysql';

export async function POST(_req: NextRequest) {
  try {
    // 1. Add seller_type column to sellers table (check if exists first)
    const columnExists = await query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'sellers' 
      AND COLUMN_NAME = 'seller_type'
    `);
    
    if (!Array.isArray(columnExists) || columnExists.length === 0) {
      await query(`
        ALTER TABLE sellers 
        ADD COLUMN seller_type ENUM('COMPANY', 'CREATOR', 'AUTHOR', 'INDIVIDUAL') 
        NOT NULL DEFAULT 'COMPANY' 
        AFTER status
      `);
    }

    // 2. Create product_clicks table for tracking click counts
    await query(`
      CREATE TABLE IF NOT EXISTS product_clicks (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        product_id BIGINT UNSIGNED NOT NULL,
        user_id BIGINT UNSIGNED NULL,
        ip_address VARCHAR(45) NOT NULL,
        user_agent TEXT,
        clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_product_date (product_id, clicked_at),
        INDEX idx_ip_date (ip_address, clicked_at)
      ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    // 3. Create weekly_rankings table for caching ranking results
    await query(`
      CREATE TABLE IF NOT EXISTS weekly_rankings (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        product_id BIGINT UNSIGNED NOT NULL,
        seller_type ENUM('CREATOR', 'AUTHOR', 'INDIVIDUAL') NOT NULL,
        week_start DATE NOT NULL,
        week_end DATE NOT NULL,
        sales_count INT DEFAULT 0,
        click_count INT DEFAULT 0,
        ranking_score DECIMAL(10,2) NOT NULL,
        rank_position INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_product_week (product_id, week_start),
        INDEX idx_seller_type_week (seller_type, week_start, rank_position),
        INDEX idx_ranking_score (ranking_score DESC)
      ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    // 4. Add indexes to existing tables for better ranking performance
    const indexExists = await query(`
      SELECT INDEX_NAME 
      FROM INFORMATION_SCHEMA.STATISTICS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'order_items' 
      AND INDEX_NAME = 'idx_product_created'
    `);
    
    if (!Array.isArray(indexExists) || indexExists.length === 0) {
      await query(`
        ALTER TABLE order_items 
        ADD INDEX idx_product_created (product_id, created_at)
      `);
    }

    return Response.json({
      success: true,
      message: 'Creator ranking tables created successfully',
      tables_created: [
        'sellers.seller_type column added',
        'product_clicks table created',
        'weekly_rankings table created',
        'Performance indexes added'
      ]
    });

  } catch (error) {
    console.error('Setup creator ranking error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}