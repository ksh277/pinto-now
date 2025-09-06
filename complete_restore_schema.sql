-- Complete Database Schema Restoration
-- This includes all 40+ tables discovered from API analysis and git history

USE pinto;

-- ==========================================
-- Clean up first (order matters due to FK)
-- ==========================================
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS review_comments;
DROP TABLE IF EXISTS review_likes;
DROP TABLE IF EXISTS product_clicks;
DROP TABLE IF EXISTS weekly_rankings;
DROP TABLE IF EXISTS product_shelf_banners;
DROP TABLE IF EXISTS info_cards;
DROP TABLE IF EXISTS category_shortcuts;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS point_ledger;
DROP TABLE IF EXISTS inquiries;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS roles;
-- Keep existing tables: users, banners, reviews, products, sellers, etc.

SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- 1. User System Enhancement
-- ==========================================

-- 1.1 Roles
CREATE TABLE roles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(80) NOT NULL
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 1.2 User Profiles
CREATE TABLE user_profiles (
    user_id BIGINT UNSIGNED PRIMARY KEY,
    nickname VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(80),
    phone VARCHAR(30),
    avatar_url VARCHAR(512),
    birthdate DATE,
    bio TEXT,
    sns_instagram VARCHAR(100),
    sns_twitter VARCHAR(100),
    marketing_opt_in TINYINT(1) DEFAULT 0,
    community_notifications TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nickname (nickname)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 1.3 User-Role Mapping
CREATE TABLE user_roles (
    user_id BIGINT UNSIGNED,
    role_id INT UNSIGNED,
    assigned_by BIGINT UNSIGNED,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 1.4 Addresses
CREATE TABLE addresses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    label VARCHAR(60),
    type ENUM('SHIPPING', 'BILLING') NOT NULL DEFAULT 'SHIPPING',
    receiver VARCHAR(80) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    zip VARCHAR(20),
    line1 VARCHAR(255) NOT NULL,
    line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(50) DEFAULT '한국',
    is_default TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_default (user_id, is_default)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==========================================
-- 2. Commerce System
-- ==========================================

-- 2.1 Sellers (if not exists)
CREATE TABLE IF NOT EXISTS sellers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    brand_name VARCHAR(120) NOT NULL,
    status ENUM('PENDING', 'ACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'PENDING',
    biz_reg_no VARCHAR(40),
    cs_email VARCHAR(255),
    cs_phone VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_user (user_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2.2 Orders
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL UNIQUE,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT UNSIGNED NOT NULL,
    status ENUM('pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded', 'completed') NOT NULL DEFAULT 'pending',
    items_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    shipping_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    points_used INT NOT NULL DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    shipping_address JSON,
    memo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_status (user_id, status),
    INDEX idx_order_id (order_id),
    INDEX idx_order_number (order_number),
    INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2.3 Order Items
CREATE TABLE order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    product_name_ko VARCHAR(255) NOT NULL,
    product_name_en VARCHAR(255),
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    options JSON,
    image_url VARCHAR(512),
    design_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2.4 Payments
CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT UNSIGNED NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending',
    payment_key VARCHAR(255),
    transaction_id VARCHAR(255),
    raw_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_user_id (user_id),
    INDEX idx_payment_key (payment_key),
    INDEX idx_status (status)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==========================================
-- 3. Points System
-- ==========================================

-- 3.1 Point Ledger
CREATE TABLE point_ledger (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    direction ENUM('EARN', 'SPEND', 'EXPIRE', 'ADJUST') NOT NULL,
    amount INT NOT NULL,
    balance INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    ref_type VARCHAR(50),
    ref_id VARCHAR(100),
    expires_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_created (user_id, created_at DESC),
    INDEX idx_expires (expires_at),
    INDEX idx_direction (direction)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==========================================
-- 4. Content Management
-- ==========================================

-- 4.1 Category Shortcuts
CREATE TABLE category_shortcuts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    href VARCHAR(500) NOT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active_sort (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4.2 Info Cards
CREATE TABLE info_cards (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(512),
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active_sort (is_active, sort_order)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4.3 Product Shelf Banners
CREATE TABLE product_shelf_banners (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(512) NOT NULL,
    href VARCHAR(512),
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active_sort (is_active, sort_order)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==========================================
-- 5. Customer Service
-- ==========================================

-- 5.1 Inquiries
CREATE TABLE inquiries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    userId BIGINT UNSIGNED NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status ENUM('received', 'in_progress', 'completed', 'closed') DEFAULT 'received',
    admin_reply TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_status (userId, status),
    INDEX idx_created (createdAt DESC)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==========================================
-- 6. Analytics & Tracking
-- ==========================================

-- 6.1 Product Clicks
CREATE TABLE product_clicks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_time (product_id, clicked_at DESC),
    INDEX idx_ip_time (ip_address, clicked_at DESC)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 6.2 Weekly Rankings
CREATE TABLE weekly_rankings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    seller_type ENUM('individual', 'business') NOT NULL,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    sales_count INT DEFAULT 0,
    click_count INT DEFAULT 0,
    ranking_score DECIMAL(10,3) DEFAULT 0.000,
    rank_position INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_week_type_rank (week_start, seller_type, rank_position),
    INDEX idx_product_week (product_id, week_start)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==========================================
-- 7. Reviews Enhancement
-- ==========================================

-- 7.1 Review Likes
CREATE TABLE review_likes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    review_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_review_user (review_id, user_id),
    INDEX idx_review_id (review_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 7.2 Review Comments
CREATE TABLE review_comments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    review_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_review_created (review_id, created_at),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==========================================
-- Initial Data
-- ==========================================

-- Basic roles
INSERT IGNORE INTO roles (code, name) VALUES 
('USER', '일반사용자'),
('SELLER', '판매자'),
('STAFF', '직원'),
('ADMIN', '관리자');

-- Basic category shortcuts data
INSERT IGNORE INTO category_shortcuts (title, image_url, href, sort_order) VALUES
('1인샵', 'https://placehold.co/100x100.png', '/category/1인샵', 1),
('선물추천', 'https://placehold.co/100x100.png', '/category/선물추천', 2),
('겨울아이디어', 'https://placehold.co/100x100.png', '/category/겨울아이디어', 3),
('여행 굿즈', 'https://placehold.co/100x100.png', '/category/여행굿즈', 4),
('문구/미니', 'https://placehold.co/100x100.png', '/category/문구미니', 5),
('반려동물 굿즈', 'https://placehold.co/100x100.png', '/category/반려동물굿즈', 6),
('의류', 'https://placehold.co/100x100.png', '/category/의류', 7),
('개성 아이디어', 'https://placehold.co/100x100.png', '/category/개성아이디어', 8);

-- Basic info cards
INSERT IGNORE INTO info_cards (title, description, image_url, sort_order) VALUES
('빠른 제작', '24시간 내 제작 완료', 'https://placehold.co/300x200.png', 1),
('고품질 보장', '프리미엄 소재만 사용', 'https://placehold.co/300x200.png', 2),
('무료 배송', '3만원 이상 무료배송', 'https://placehold.co/300x200.png', 3);

SET FOREIGN_KEY_CHECKS = 1;