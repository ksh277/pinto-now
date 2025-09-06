-- 관리자 계정 확인 및 생성
USE pinto;

-- 현재 users 테이블 확인
SELECT COUNT(*) as user_count FROM users;
SELECT id, username, email, status FROM users WHERE username = 'admin' OR email LIKE '%admin%';

-- 관리자 계정이 없으면 생성
INSERT IGNORE INTO users (username, email, password_hash, status, created_at, updated_at) VALUES 
('admin', 'admin@example.com', '$2b$10$X8wQjX8B5k9tY2Kw8L4tXeN1U6Vz5Y7B2C4D3E1F9G8H0I2J1K3L4', 'ACTIVE', NOW(), NOW());

-- 결과 확인
SELECT id, username, email, status, created_at FROM users WHERE username = 'admin';

-- 전체 사용자 수
SELECT COUNT(*) as total_users FROM users;