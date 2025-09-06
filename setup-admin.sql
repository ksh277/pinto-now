-- 데이터베이스 및 테이블 생성
USE pinto;

-- roles 테이블 생성
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- users 테이블 생성
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- user_profiles 테이블 생성
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id INT PRIMARY KEY,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- user_roles 테이블 생성
CREATE TABLE IF NOT EXISTS user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_by INT NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id),
    UNIQUE KEY unique_user_role (user_id, role_id)
);

-- 기본 역할 삽입
INSERT IGNORE INTO roles (id, name, description) VALUES 
(1, 'USER', '일반 사용자'),
(2, 'SELLER', '판매자'),
(3, 'MODERATOR', '운영자'),
(4, 'ADMIN', '관리자');

-- admin 사용자 삽입 (비밀번호: ha1045)
INSERT IGNORE INTO users (id, username, email, password_hash, status) VALUES 
(1, 'admin', 'admin@pinto.com', '$2a$10$YrUjDcpq8u4rS4wv3YXMfO8XQNfLGJLcOmgp6W5ZQTa4K8vZpH0Be', 'ACTIVE');

-- admin 프로필 삽입
INSERT IGNORE INTO user_profiles (user_id, nickname, name, phone) VALUES 
(1, 'admin', '관리자', '010-0000-0000')
ON DUPLICATE KEY UPDATE
nickname = 'admin',
name = '관리자',
phone = '010-0000-0000',
updated_at = CURRENT_TIMESTAMP;

-- admin 역할 부여
INSERT IGNORE INTO user_roles (user_id, role_id, assigned_by) VALUES 
(1, 4, 1);

-- 확인 쿼리
SELECT 
    u.id,
    u.username,
    u.email,
    u.status,
    up.nickname,
    up.name,
    r.name as role_name
FROM users u 
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.username = 'admin';