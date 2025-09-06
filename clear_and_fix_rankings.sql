-- 주간 랭킹 데이터 삭제하고 새로 생성

USE pinto;

-- 기존 주간 랭킹 데이터 삭제
DELETE FROM weekly_rankings;

-- product_stats 데이터 정리
UPDATE product_stats SET 
  likes_count = 0, 
  reviews_count = 0, 
  sales_count = 0,
  updated_at = NOW()
WHERE product_id IN (1,2,3,4,5,6,7,8,9,10);

-- product_clicks 데이터 삭제
DELETE FROM product_clicks;

-- 새로운 클릭 데이터 추가
INSERT INTO product_clicks (product_id, user_id, ip_address, user_agent, clicked_at) VALUES
(2, 1, '192.168.1.1', 'Mozilla/5.0', NOW()),
(5, NULL, '192.168.1.2', 'Mozilla/5.0', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(3, 1, '192.168.1.3', 'Mozilla/5.0', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(4, NULL, '192.168.1.4', 'Mozilla/5.0', DATE_SUB(NOW(), INTERVAL 3 HOUR));

SELECT 'Rankings data cleared and new click data added!' as result;