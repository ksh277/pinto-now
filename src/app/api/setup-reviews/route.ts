import { NextRequest } from 'next/server';
import { query } from '@/lib/mysql';

export async function POST(req: NextRequest) {
  try {
    // 1. 먼저 reviews 테이블에 like_count, comment_count 컬럼이 있는지 확인하고 없으면 추가
    try {
      await query(`ALTER TABLE reviews ADD COLUMN like_count INT DEFAULT 0`);
      console.log('Added like_count column');
    } catch (error) {
      // 컬럼이 이미 존재하는 경우 무시
    }

    try {
      await query(`ALTER TABLE reviews ADD COLUMN comment_count INT DEFAULT 0`);
      console.log('Added comment_count column');
    } catch (error) {
      // 컬럼이 이미 존재하는 경우 무시
    }

    // 2. review_likes 테이블 생성
    await query(`
      CREATE TABLE IF NOT EXISTS review_likes (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        review_id BIGINT UNSIGNED NOT NULL,
        user_id BIGINT UNSIGNED NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_review_like (review_id, user_id),
        INDEX idx_review (review_id),
        INDEX idx_user (user_id),
        INDEX idx_created_at (created_at DESC)
      ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    // 3. review_comments 테이블 생성
    await query(`
      CREATE TABLE IF NOT EXISTS review_comments (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        review_id BIGINT UNSIGNED NOT NULL,
        user_id BIGINT UNSIGNED NOT NULL,
        parent_id BIGINT UNSIGNED NULL,
        content TEXT NOT NULL,
        is_hidden TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES review_comments(id) ON DELETE CASCADE,
        INDEX idx_review (review_id),
        INDEX idx_user (user_id),
        INDEX idx_parent (parent_id),
        INDEX idx_created_at (created_at DESC)
      ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    // 4. 샘플 사용자가 없으면 생성
    let sampleUserId: number;
    const existingUser = await query<{id: number}[]>(`
      SELECT id FROM users WHERE email = 'sample@example.com'
    `);

    if (existingUser.length > 0) {
      sampleUserId = existingUser[0].id;
    } else {
      const userResult = await query(`
        INSERT INTO users (email, password_hash, status)
        VALUES ('sample@example.com', 'sample_hash', 'ACTIVE')
      `);
      sampleUserId = (userResult as any).insertId;

      // 사용자 프로필 생성
      await query(`
        INSERT INTO user_profiles (user_id, nickname, name)
        VALUES (?, '샘플유저', '샘플 사용자')
      `, [sampleUserId]);
    }

    // 5. 샘플 상품이 없으면 생성
    let sampleProductId: number;
    const existingProduct = await query<{id: number}[]>(`
      SELECT id FROM products WHERE name LIKE '%샘플%' LIMIT 1
    `);

    if (existingProduct.length > 0) {
      sampleProductId = existingProduct[0].id;
    } else {
      // 카테고리가 필요하면 먼저 확인
      let categoryId = 1;
      const categories = await query<{id: number}[]>(`SELECT id FROM categories LIMIT 1`);
      if (categories.length > 0) {
        categoryId = categories[0].id;
      }

      const productResult = await query(`
        INSERT INTO products (seller_id, category_id, name, slug, price, status, thumbnail_url)
        VALUES (1, ?, '샘플 아크릴 키링', 'sample-keyring', 15000, 'ACTIVE', 'https://placehold.co/300x300.png')
      `, [categoryId]);
      sampleProductId = (productResult as any).insertId;
    }

    // 6. 기존 리뷰가 있는지 확인하고 없으면 샘플 리뷰 2개 생성
    const existingReviews = await query<{id: number}[]>(`
      SELECT id FROM reviews WHERE product_id = ?
    `, [sampleProductId]);

    if (existingReviews.length === 0) {
      // 첫 번째 샘플 리뷰
      const review1Result = await query(`
        INSERT INTO reviews (product_id, user_id, rating, content, images, like_count, comment_count)
        VALUES (?, ?, 5, '정말 만족스러운 제품이에요! 디자인도 예쁘고 품질도 좋아서 친구들에게도 추천하고 있습니다. 배송도 빨라서 좋았어요.', '["https://placehold.co/300x300/e2e8f0/64748b.png?text=Review1", "https://placehold.co/300x300/f3f4f6/6b7280.png?text=Photo1"]', 3, 1)
      `, [sampleProductId, sampleUserId]);
      const review1Id = (review1Result as any).insertId;

      // 두 번째 샘플 리뷰
      const review2Result = await query(`
        INSERT INTO reviews (product_id, user_id, rating, content, images, like_count, comment_count)
        VALUES (?, ?, 4, '아크릴 재질이 생각보다 두껍고 튼튼해서 좋네요. 색상도 선명하게 나왔고 마감 처리도 깔끔합니다. 다만 배송이 조금 늦었어요.', '["https://placehold.co/300x300/ddd6fe/8b5cf6.png?text=Review2"]', 1, 0)
      `, [sampleProductId, sampleUserId]);
      const review2Id = (review2Result as any).insertId;

      // 첫 번째 리뷰에 좋아요 3개 추가
      for (let i = 0; i < 3; i++) {
        try {
          await query(`
            INSERT INTO review_likes (review_id, user_id)
            VALUES (?, ?)
          `, [review1Id, sampleUserId + i]);
        } catch (error) {
          // 중복 좋아요는 무시
        }
      }

      // 첫 번째 리뷰에 댓글 1개 추가
      await query(`
        INSERT INTO review_comments (review_id, user_id, content)
        VALUES (?, ?, '저도 같은 제품 주문했는데 정말 만족해요!')
      `, [review1Id, sampleUserId]);

      // 두 번째 리뷰에 좋아요 1개 추가
      try {
        await query(`
          INSERT INTO review_likes (review_id, user_id)
          VALUES (?, ?)
        `, [review2Id, sampleUserId]);
      } catch (error) {
        // 중복 좋아요는 무시
      }
    }

    return Response.json({
      success: true,
      message: 'Review system setup completed successfully',
      sampleProductId,
      sampleUserId
    });

  } catch (error) {
    console.error('Setup reviews error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}