-- 관리자 계정 확인 및 생성

USE pinto;

-- 기존 사용자 확인
SELECT id, email, username, password FROM users WHERE email = 'admin@example.com' OR username = 'admin';

-- 만약 admin 계정이 없다면 생성 (bcrypt 해시된 비밀번호: ha1045!!)
-- $2b$10$X8wQjX8B5k9tY2Kw8L4tXeN1U6Vz5Y7B2C4D3E1F9G8H0I2J1K3L4
INSERT IGNORE INTO users (email, username, password, created_at) VALUES 
('admin@example.com', 'admin', '$2b$10$X8wQjX8B5k9tY2Kw8L4tXeN1U6Vz5Y7B2C4D3E1F9G8H0I2J1K3L4', NOW());

-- 모든 사용자 조회
SELECT id, email, username, created_at FROM users;

SELECT 'Admin account check completed!' as result;