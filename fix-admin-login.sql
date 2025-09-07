-- admin 계정 로그인 문제 수정
USE pinto;

-- 현재 admin 계정 확인
SELECT id, username, email, password_hash, status FROM users WHERE username = 'admin';

-- admin 계정이 없으면 생성, 있으면 비밀번호 업데이트
INSERT INTO users (username, email, password_hash, status, created_at, updated_at) 
VALUES ('admin', 'admin@example.com', '$2b$10$Di6YOBDrGALX/vVkW5OpPe1YMtFE213XT6Wbiriqah3ny8TDUMx6a', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
  password_hash = '$2b$10$Di6YOBDrGALX/vVkW5OpPe1YMtFE213XT6Wbiriqah3ny8TDUMx6a',
  status = 'ACTIVE',
  updated_at = NOW();

-- admin 역할 확인 및 생성
INSERT IGNORE INTO roles (id, name, description) VALUES (1, 'ADMIN', 'Administrator role');

-- admin 사용자에게 ADMIN 역할 부여
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, 1
FROM users u
WHERE u.username = 'admin'
ON DUPLICATE KEY UPDATE role_id = 1;

-- 결과 확인
SELECT u.id, u.username, u.email, u.status, r.name as role
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.username = 'admin';