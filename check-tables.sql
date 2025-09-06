-- 현재 데이터베이스 상태 확인
USE pinto;

-- 테이블 목록 확인
SHOW TABLES;

-- 각 테이블의 레코드 수 확인
SELECT 
    TABLE_NAME,
    TABLE_ROWS
FROM 
    INFORMATION_SCHEMA.TABLES 
WHERE 
    TABLE_SCHEMA = 'pinto'
ORDER BY TABLE_NAME;