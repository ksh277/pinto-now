-- seller_name 한국어 인코딩 수정

USE pinto;

-- users 테이블에서 판매자명 업데이트
UPDATE users SET 
username = CASE id
  WHEN 1 THEN '개인창작자'
  WHEN 2 THEN '아트스튜디오'
  WHEN 3 THEN '크리에이티브컴퍼니'
  ELSE username
END
WHERE id IN (1, 2, 3);

SELECT 'Seller names encoding fixed!' as result;