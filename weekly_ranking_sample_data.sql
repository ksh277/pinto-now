-- 주간 랭킹 샘플 데이터 생성

USE pinto;

-- 현재 주의 시작과 끝 날짜 계산
SET @current_week_start = DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY);
SET @current_week_end = DATE_ADD(@current_week_start, INTERVAL 6 DAY);

-- 더 많은 샘플 제품 추가 (개인 판매자용)
INSERT IGNORE INTO products (id, seller_id, category_id, name, slug, description, price, status, thumbnail_url) VALUES
(2, 1, 1, '귀여운 고양이 아크릴 키링', 'cute-cat-keyring', '손으로 그린 고양이 캐릭터 키링', 8000.00, 'ACTIVE', 'https://placehold.co/300x300/FFB6C1/000000?text=고양이키링'),
(3, 1, 2, '개성있는 스티커 세트', 'unique-sticker-set', '다양한 감정 표현 스티커', 5000.00, 'ACTIVE', 'https://placehold.co/300x300/98FB98/000000?text=스티커세트'),
(4, 1, 3, '핸드메이드 북마크', 'handmade-bookmark', '수제 태슬 북마크', 3000.00, 'ACTIVE', 'https://placehold.co/300x300/F0E68C/000000?text=북마크'),
(5, 1, 1, '미니어처 음식 키링', 'miniature-food-keyring', '리얼한 미니어처 음식 키링', 12000.00, 'ACTIVE', 'https://placehold.co/300x300/DDA0DD/000000?text=음식키링'),
(6, 1, 2, '일러스트 엽서 세트', 'illustration-postcard', '계절 테마 일러스트 엽서', 7000.00, 'ACTIVE', 'https://placehold.co/300x300/F4A460/000000?text=엽서세트');

-- 비즈니스 판매자 추가 (사업자)
INSERT IGNORE INTO users (id, email, username, created_at) VALUES
(2, 'business@example.com', 'business_creator', NOW()),
(3, 'company@example.com', 'company_seller', NOW());

-- 비즈니스 판매자 제품들
INSERT IGNORE INTO products (id, seller_id, category_id, name, slug, description, price, status, thumbnail_url) VALUES
(7, 2, 4, '프리미엄 아크릴 스탠드', 'premium-acrylic-stand', '고급 아크릴 캐릭터 스탠드', 25000.00, 'ACTIVE', 'https://placehold.co/300x300/E6E6FA/000000?text=아크릴스탠드'),
(8, 2, 5, '한정판 굿즈 세트', 'limited-goods-set', '한정 수량 굿즈 패키지', 45000.00, 'ACTIVE', 'https://placehold.co/300x300/FFEFD5/000000?text=한정굿즈'),
(9, 3, 4, '기업 맞춤 굿즈', 'custom-corporate-goods', '기업용 맞춤 제작 굿즈', 35000.00, 'ACTIVE', 'https://placehold.co/300x300/E0FFFF/000000?text=기업굿즈'),
(10, 3, 5, '대량 제작 키링', 'bulk-production-keyring', '대량 생산용 고품질 키링', 15000.00, 'ACTIVE', 'https://placehold.co/300x300/FFFACD/000000?text=대량키링');

-- 제품 통계 데이터 추가
INSERT IGNORE INTO product_stats (product_id, likes_count, reviews_count, sales_count, updated_at) VALUES
(2, 45, 12, 28, NOW()),
(3, 32, 8, 15, NOW()),
(4, 18, 5, 9, NOW()),
(5, 67, 18, 42, NOW()),
(6, 23, 6, 11, NOW()),
(7, 89, 25, 67, NOW()),
(8, 156, 42, 123, NOW()),
(9, 78, 21, 56, NOW()),
(10, 92, 28, 74, NOW());

-- 이번 주 주간 랭킹 데이터 (개인 판매자)
INSERT IGNORE INTO weekly_rankings (product_id, seller_type, week_start, week_end, sales_count, click_count, ranking_score, rank_position, created_at) VALUES
-- 개인 창작자 랭킹 (1위~10위)
(5, 'individual', @current_week_start, @current_week_end, 42, 890, 95.5, 1, NOW()),
(2, 'individual', @current_week_start, @current_week_end, 28, 672, 78.2, 2, NOW()),
(1, 'individual', @current_week_start, @current_week_end, 25, 545, 71.8, 3, NOW()),
(6, 'individual', @current_week_start, @current_week_end, 11, 434, 48.3, 4, NOW()),
(3, 'individual', @current_week_start, @current_week_end, 15, 398, 45.7, 5, NOW()),
(4, 'individual', @current_week_start, @current_week_end, 9, 267, 32.1, 6, NOW()),

-- 비즈니스 랭킹 (1위~10위)  
(8, 'business', @current_week_start, @current_week_end, 123, 2340, 198.7, 1, NOW()),
(10, 'business', @current_week_start, @current_week_end, 74, 1560, 145.2, 2, NOW()),
(7, 'business', @current_week_start, @current_week_end, 67, 1420, 132.8, 3, NOW()),
(9, 'business', @current_week_start, @current_week_end, 56, 1180, 118.6, 4, NOW());

-- 지난 주 랭킹 데이터도 추가 (비교용)
SET @last_week_start = DATE_SUB(@current_week_start, INTERVAL 7 DAY);
SET @last_week_end = DATE_SUB(@current_week_end, INTERVAL 7 DAY);

INSERT IGNORE INTO weekly_rankings (product_id, seller_type, week_start, week_end, sales_count, click_count, ranking_score, rank_position, created_at) VALUES
-- 지난 주 개인 창작자 랭킹
(2, 'individual', @last_week_start, @last_week_end, 35, 756, 82.1, 1, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(5, 'individual', @last_week_start, @last_week_end, 38, 812, 86.3, 2, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(1, 'individual', @last_week_start, @last_week_end, 22, 498, 65.4, 3, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(3, 'individual', @last_week_start, @last_week_end, 18, 445, 52.8, 4, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(6, 'individual', @last_week_start, @last_week_end, 13, 389, 43.2, 5, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(4, 'individual', @last_week_start, @last_week_end, 11, 301, 35.7, 6, DATE_SUB(NOW(), INTERVAL 7 DAY)),

-- 지난 주 비즈니스 랭킹
(10, 'business', @last_week_start, @last_week_end, 89, 1890, 167.3, 1, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(8, 'business', @last_week_start, @last_week_end, 115, 2156, 183.4, 2, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(7, 'business', @last_week_start, @last_week_end, 58, 1234, 119.8, 3, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(9, 'business', @last_week_start, @last_week_end, 51, 1089, 108.2, 4, DATE_SUB(NOW(), INTERVAL 7 DAY));

-- 추가 클릭 데이터 (최근 활동)
INSERT IGNORE INTO product_clicks (product_id, user_id, ip_address, user_agent, clicked_at) VALUES
(5, 1, '192.168.1.1', 'Mozilla/5.0', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(2, NULL, '192.168.1.2', 'Mozilla/5.0', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(8, 1, '192.168.1.3', 'Mozilla/5.0', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(10, NULL, '192.168.1.4', 'Mozilla/5.0', DATE_SUB(NOW(), INTERVAL 4 HOUR)),
(1, 1, '192.168.1.5', 'Mozilla/5.0', DATE_SUB(NOW(), INTERVAL 5 HOUR)),
(7, NULL, '192.168.1.6', 'Mozilla/5.0', DATE_SUB(NOW(), INTERVAL 6 HOUR));

SELECT 'Weekly ranking sample data inserted successfully!' as result;