-- 기존 하드코딩된 카테고리 숏컷 데이터 삭제
DELETE FROM category_shortcuts 
WHERE title IN (
  '1인샵', 
  '선물추천', 
  '겨울아이디어', 
  '여행굿즈', 
  '문구/미니', 
  '반려동물굿즈', 
  '의류', 
  '개성아이디어'
);

-- 또는 모든 카테고리 숏컷 데이터 삭제 (관리자가 새로 추가할 예정이면)
-- DELETE FROM category_shortcuts;