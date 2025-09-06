-- 오늘 추가 작업된 테이블들

USE pinto;

-- 8.4 상품 진열대 배너 (누락되었던 테이블)
CREATE TABLE IF NOT EXISTS product_shelf_banners (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(512) NOT NULL,
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active_sort (is_active, sort_order)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 8.5 배너-상품 연관관계
CREATE TABLE IF NOT EXISTS product_shelf_banner_products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    banner_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (banner_id) REFERENCES product_shelf_banners(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_banner_sort (banner_id, sort_order),
    UNIQUE KEY unique_banner_product (banner_id, product_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 카테고리 바로가기 테이블 (API에서 발견)
CREATE TABLE IF NOT EXISTS category_shortcuts (
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

-- 상품 클릭 추적 테이블
CREATE TABLE IF NOT EXISTS product_clicks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_time (product_id, clicked_at DESC),
    INDEX idx_ip_time (ip_address, clicked_at DESC)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 주간 랭킹 테이블
CREATE TABLE IF NOT EXISTS weekly_rankings (
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

-- 기본 카테고리 바로가기 데이터
INSERT IGNORE INTO category_shortcuts (title, image_url, href, sort_order) VALUES
('1인샵', 'https://placehold.co/100x100.png', '/category/1인샵', 1),
('선물추천', 'https://placehold.co/100x100.png', '/category/선물추천', 2),
('겨울아이디어', 'https://placehold.co/100x100.png', '/category/겨울아이디어', 3),
('여행 굿즈', 'https://placehold.co/100x100.png', '/category/여행굿즈', 4),
('문구/미니', 'https://placehold.co/100x100.png', '/category/문구미니', 5),
('반려동물 굿즈', 'https://placehold.co/100x100.png', '/category/반려동물굿즈', 6),
('의류', 'https://placehold.co/100x100.png', '/category/의류', 7),
('개성 아이디어', 'https://placehold.co/100x100.png', '/category/개성아이디어', 8);