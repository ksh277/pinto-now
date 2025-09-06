-- 기본 데이터 추가 (기존 데이터와 중복 방지)
USE pinto;

-- 외래키 제약 임시 비활성화
SET FOREIGN_KEY_CHECKS = 0;

-- 1. 카테고리 데이터 추가
INSERT IGNORE INTO categories (id, name, slug, description, sort_order, is_active, created_at) VALUES
(1, '키링/열쇠고리', 'keyring', '다양한 키링과 열쇠고리', 1, 1, NOW()),
(2, '스티커', 'sticker', '개성있는 스티커 모음', 2, 1, NOW()),
(3, '문구용품', 'stationery', '북마크, 펜 등 문구용품', 3, 1, NOW()),
(4, '아크릴굿즈', 'acrylic', '아크릴 스탠드, 키링 등', 4, 1, NOW()),
(5, '한정굿즈', 'limited', '한정판 굿즈 모음', 5, 1, NOW());

-- 2. 카테고리 바로가기 데이터 추가
INSERT IGNORE INTO category_shortcuts (title, image_url, href, sort_order, is_active, created_at) VALUES
('1인샵', 'https://placehold.co/100x100/FFB6C1/000000?text=1인샵', '/category/1인샵', 1, 1, NOW()),
('선물추천', 'https://placehold.co/100x100/87CEEB/000000?text=선물추천', '/category/선물추천', 2, 1, NOW()),
('겨울아이디어', 'https://placehold.co/100x100/DDA0DD/000000?text=겨울', '/category/겨울아이디어', 3, 1, NOW()),
('여행굿즈', 'https://placehold.co/100x100/F0E68C/000000?text=여행', '/category/여행굿즈', 4, 1, NOW()),
('문구/미니', 'https://placehold.co/100x100/98FB98/000000?text=문구', '/category/문구미니', 5, 1, NOW()),
('반려동물굿즈', 'https://placehold.co/100x100/F4A460/000000?text=펫굿즈', '/category/반려동물굿즈', 6, 1, NOW()),
('의류', 'https://placehold.co/100x100/E6E6FA/000000?text=의류', '/category/의류', 7, 1, NOW()),
('개성아이디어', 'https://placehold.co/100x100/FFEFD5/000000?text=개성', '/category/개성아이디어', 8, 1, NOW());

-- 3. 샘플 상품 데이터 추가 (user_id를 기존 admin 사용자로 설정)
INSERT IGNORE INTO products (id, seller_id, category_id, name, slug, description, price, stock, status, is_customizable, thumbnail_url, rating_avg, review_count, view_count, created_at) VALUES
(1, (SELECT id FROM users WHERE username = 'admin' LIMIT 1), 1, '귀여운 고양이 아크릴 키링', 'cute-cat-keyring', '손으로 그린 고양이 캐릭터 키링입니다. 다양한 표정의 고양이들을 만나보세요!', 8000.00, 50, 'ACTIVE', 1, 'https://placehold.co/300x300/FFB6C1/000000?text=고양이키링', 4.8, 25, 120, NOW()),
(2, (SELECT id FROM users WHERE username = 'admin' LIMIT 1), 2, '개성있는 스티커 세트', 'unique-sticker-set', '다양한 감정 표현 스티커 20장 세트', 15000.00, 30, 'ACTIVE', 0, 'https://placehold.co/300x300/87CEEB/000000?text=스티커세트', 4.5, 18, 89, NOW()),
(3, (SELECT id FROM users WHERE username = 'admin' LIMIT 1), 3, '핸드메이드 북마크', 'handmade-bookmark', '수제 태슬 북마크 - 독서의 즐거움을 더해줍니다', 3000.00, 100, 'ACTIVE', 0, 'https://placehold.co/300x300/F0E68C/000000?text=북마크', 4.9, 42, 156, NOW()),
(4, (SELECT id FROM users WHERE username = 'admin' LIMIT 1), 1, '미니어처 음식 키링', 'miniature-food-keyring', '리얼한 미니어처 음식 키링 - 라면, 김밥, 떡볶이 등', 12000.00, 25, 'ACTIVE', 0, 'https://placehold.co/300x300/DDA0DD/000000?text=음식키링', 4.7, 33, 201, NOW()),
(5, (SELECT id FROM users WHERE username = 'admin' LIMIT 1), 2, '일러스트 엽서 세트', 'illustration-postcard', '계절 테마 일러스트 엽서 10장 세트', 7000.00, 40, 'ACTIVE', 0, 'https://placehold.co/300x300/F4A460/000000?text=엽서세트', 4.6, 22, 78, NOW()),
(6, (SELECT id FROM users WHERE username = 'admin' LIMIT 1), 4, '프리미엄 아크릴 스탠드', 'premium-acrylic-stand', '고급 아크릴 캐릭터 스탠드 - 투명하고 깔끔한 디자인', 25000.00, 15, 'ACTIVE', 1, 'https://placehold.co/300x300/E6E6FA/000000?text=아크릴스탠드', 4.9, 15, 67, NOW()),
(7, (SELECT id FROM users WHERE username = 'admin' LIMIT 1), 5, '한정판 굿즈 세트', 'limited-goods-set', '한정 수량 굿즈 패키지 - 키링 + 스티커 + 엽서', 45000.00, 10, 'ACTIVE', 0, 'https://placehold.co/300x300/FFEFD5/000000?text=한정굿즈', 5.0, 8, 45, NOW()),
(8, (SELECT id FROM users WHERE username = 'admin' LIMIT 1), 4, '기업 맞춤 굿즈', 'custom-corporate-goods', '기업용 맞춤 제작 굿즈 - 로고 삽입 가능', 35000.00, 20, 'ACTIVE', 1, 'https://placehold.co/300x300/E0FFFF/000000?text=기업굿즈', 4.4, 12, 34, NOW()),
(9, (SELECT id FROM users WHERE username = 'admin' LIMIT 1), 5, '대량 제작 키링', 'bulk-production-keyring', '대량 생산용 고품질 키링 - 최소 50개 주문', 15000.00, 200, 'ACTIVE', 1, 'https://placehold.co/300x300/FFFACD/000000?text=대량키링', 4.3, 28, 92, NOW()),
(10, (SELECT id FROM users WHERE username = 'admin' LIMIT 1), 1, '투명 아크릴 키링', 'transparent-acrylic-keyring', '심플하고 깔끔한 투명 아크릴 키링', 6000.00, 75, 'ACTIVE', 1, 'https://placehold.co/300x300/F0F8FF/000000?text=투명키링', 4.2, 19, 63, NOW());

-- 4. 상품 통계 데이터 추가
INSERT IGNORE INTO product_stats (product_id, likes_count, reviews_count, sales_count, updated_at) VALUES
(1, 45, 25, 78, NOW()),
(2, 32, 18, 52, NOW()),
(3, 67, 42, 125, NOW()),
(4, 38, 33, 89, NOW()),
(5, 24, 22, 43, NOW()),
(6, 29, 15, 35, NOW()),
(7, 15, 8, 18, NOW()),
(8, 18, 12, 22, NOW()),
(9, 41, 28, 67, NOW()),
(10, 22, 19, 38, NOW());

-- 5. 주간 랭킹 데이터 추가
INSERT IGNORE INTO weekly_rankings (product_id, seller_type, week_start, week_end, sales_count, click_count, ranking_score, rank_position, created_at) VALUES
(3, 'individual', CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY, CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY + INTERVAL 6 DAY, 25, 156, 25.156, 1, NOW()),
(1, 'individual', CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY, CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY + INTERVAL 6 DAY, 18, 120, 18.120, 2, NOW()),
(4, 'individual', CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY, CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY + INTERVAL 6 DAY, 15, 201, 15.201, 3, NOW()),
(2, 'individual', CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY, CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY + INTERVAL 6 DAY, 12, 89, 12.089, 4, NOW()),
(5, 'individual', CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY, CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY + INTERVAL 6 DAY, 8, 78, 8.078, 5, NOW());

-- 6. 상품 클릭 데이터 추가
INSERT IGNORE INTO product_clicks (product_id, user_id, ip_address, user_agent, clicked_at) VALUES
(1, (SELECT id FROM users WHERE username = 'admin' LIMIT 1), '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', NOW()),
(3, (SELECT id FROM users WHERE username = 'admin' LIMIT 1), '192.168.1.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(4, (SELECT id FROM users WHERE username = 'admin' LIMIT 1), '192.168.1.104', 'Mozilla/5.0 (Windows NT)', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(6, (SELECT id FROM users WHERE username = 'admin' LIMIT 1), '192.168.1.106', 'Mozilla/5.0 (Linux)', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(8, (SELECT id FROM users WHERE username = 'admin' LIMIT 1), '192.168.1.108', 'Mozilla/5.0 (Safari)', DATE_SUB(NOW(), INTERVAL 5 DAY));

-- 외래키 제약 재활성화
SET FOREIGN_KEY_CHECKS = 1;

-- 결과 확인
SELECT '=== 기본 데이터 삽입 완료 ===' as status;
SELECT 'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'products' as table_name, COUNT(*) as count FROM products
UNION ALL
SELECT 'category_shortcuts' as table_name, COUNT(*) as count FROM category_shortcuts
UNION ALL
SELECT 'weekly_rankings' as table_name, COUNT(*) as count FROM weekly_rankings
UNION ALL
SELECT 'product_clicks' as table_name, COUNT(*) as count FROM product_clicks
UNION ALL
SELECT 'product_stats' as table_name, COUNT(*) as count FROM product_stats;