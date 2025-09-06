-- 간단한 사용자 확인

USE pinto;

-- 현재 사용자 테이블 구조 확인
DESCRIBE users;

-- 기존 사용자 조회
SELECT * FROM users LIMIT 5;

SELECT 'User table structure checked!' as result;