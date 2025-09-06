-- 한국어 인코딩 문제 수정

USE pinto;

-- 기존 카테고리 바로가기 데이터 삭제하고 재삽입
DELETE FROM category_shortcuts;

-- UTF-8 인코딩으로 올바른 한국어 텍스트 삽입
INSERT INTO category_shortcuts (title, image_url, href, sort_order) VALUES
('1인샵', 'https://placehold.co/100x100.png', '/category/1인샵', 1),
('선물추천', 'https://placehold.co/100x100.png', '/category/선물추천', 2),
('겨울아이디어', 'https://placehold.co/100x100.png', '/category/겨울아이디어', 3),
('여행굿즈', 'https://placehold.co/100x100.png', '/category/여행굿즈', 4),
('문구/미니', 'https://placehold.co/100x100.png', '/category/문구미니', 5),
('반려동물굿즈', 'https://placehold.co/100x100.png', '/category/반려동물굿즈', 6),
('의류', 'https://placehold.co/100x100.png', '/category/의류', 7),
('개성아이디어', 'https://placehold.co/100x100.png', '/category/개성아이디어', 8);

-- 다른 테이블의 한국어 텍스트도 수정
UPDATE products SET 
name = CASE id
  WHEN 2 THEN '귀여운 고양이 아크릴 키링'
  WHEN 3 THEN '개성있는 스티커 세트'
  WHEN 4 THEN '핸드메이드 북마크'
  WHEN 5 THEN '미니어처 음식 키링'
  WHEN 6 THEN '일러스트 엽서 세트'
  WHEN 7 THEN '프리미엄 아크릴 스탠드'
  WHEN 8 THEN '한정판 굿즈 세트'
  WHEN 9 THEN '기업 맞춤 굿즈'
  WHEN 10 THEN '대량 제작 키링'
  ELSE name
END,
description = CASE id
  WHEN 2 THEN '손으로 그린 고양이 캐릭터 키링'
  WHEN 3 THEN '다양한 감정 표현 스티커'
  WHEN 4 THEN '수제 태슬 북마크'
  WHEN 5 THEN '리얼한 미니어처 음식 키링'
  WHEN 6 THEN '계절 테마 일러스트 엽서'
  WHEN 7 THEN '고급 아크릴 캐릭터 스탠드'
  WHEN 8 THEN '한정 수량 굿즈 패키지'
  WHEN 9 THEN '기업용 맞춤 제작 굿즈'
  WHEN 10 THEN '대량 생산용 고품질 키링'
  ELSE description
END
WHERE id IN (2,3,4,5,6,7,8,9,10);

SELECT 'Korean encoding fixed successfully!' as result;