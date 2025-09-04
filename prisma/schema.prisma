
-- 1.1 기본 계정
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('ACTIVE', 'SUSPENDED', 'DELETED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 1.2 사용자 프로필
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_nickname (nickname)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 1.3 역할
CREATE TABLE roles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(80) NOT NULL
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 1.4 사용자-역할 매핑
CREATE TABLE user_roles (
    user_id BIGINT UNSIGNED,
    role_id INT UNSIGNED,
    assigned_by BIGINT UNSIGNED,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 1.5 주소
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_default (user_id, is_default)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==========================================
-- 2. 상품/카탈로그
-- ==========================================

-- 2.1 셀러 정보
CREATE TABLE sellers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    brand_name VARCHAR(120) NOT NULL,
    status ENUM('PENDING', 'ACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'PENDING',
    biz_reg_no VARCHAR(40),
    cs_email VARCHAR(255),
    cs_phone VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_user (user_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2.2 카테고리
CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(160) NOT NULL UNIQUE,
    parent_id BIGINT UNSIGNED NULL,
    description TEXT,
    icon_url VARCHAR(512),
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_parent_active (parent_id, is_active),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2.3 상품
CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    seller_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    status ENUM('DRAFT', 'ACTIVE', 'HIDDEN') NOT NULL DEFAULT 'DRAFT',
    is_customizable TINYINT(1) DEFAULT 0,
    thumbnail_url VARCHAR(512),
    rating_avg DECIMAL(2,1) DEFAULT 0.0,
    review_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES sellers(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_seller_status (seller_id, status),
    INDEX idx_category_status (category_id, status),
    INDEX idx_slug (slug),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_rating (rating_avg DESC),
    INDEX idx_customizable (is_customizable)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2.4 상품 옵션
CREATE TABLE product_options (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    opt_name VARCHAR(120) NOT NULL,
    opt_value VARCHAR(120) NOT NULL,
    extra_price DECIMAL(10,2) DEFAULT 0.00,
    stock INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_active (product_id, is_active)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2.5 상품 첨부파일
CREATE TABLE product_assets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    url VARCHAR(512) NOT NULL,
    kind ENUM('IMAGE', 'FILE', 'VIDEO') NOT NULL DEFAULT 'IMAGE',
    sort_order INT DEFAULT 0,
    alt_text VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_kind (product_id, kind),
    INDEX idx_sort_order (product_id, sort_order)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2.6 재고 이력
CREATE TABLE inventory_movements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    qty INT NOT NULL,
    reason ENUM('ORDER', 'CANCEL', 'MANUAL', 'ADJUST') NOT NULL,
    ref_type VARCHAR(50),
    ref_id BIGINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_product_created (product_id, created_at DESC)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==========================================
-- 3. 굿즈 에디터
-- ==========================================

-- 3.1 굿즈 커스터마이징 디자인
CREATE TABLE editor_designs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    design_data JSON NOT NULL,
    preview_url VARCHAR(512),
    status ENUM('DRAFT', 'COMPLETED', 'ORDERED') NOT NULL DEFAULT 'DRAFT',
    is_public TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_user_status (user_id, status),
    INDEX idx_product (product_id),
    INDEX idx_public (is_public, created_at DESC)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3.2 에디터 템플릿
CREATE TABLE editor_templates (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    template_data JSON NOT NULL,
    thumbnail_url VARCHAR(512),
    is_active TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category_active (category, is_active),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3.3 에디터용 소재
CREATE TABLE editor_assets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    url VARCHAR(512) NOT NULL,
    type ENUM('IMAGE', 'FONT', 'ICON', 'STICKER') NOT NULL,
    is_free TINYINT(1) DEFAULT 1,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category_type (category, type),
    INDEX idx_active_free (is_active, is_free)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==========================================
-- 4. 장바구니/주문/결제/배송
-- ==========================================

-- 4.1 장바구니
CREATE TABLE cart_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    design_id BIGINT UNSIGNED NULL,
    qty INT NOT NULL DEFAULT 1,
    options JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (design_id) REFERENCES editor_designs(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4.2 주문
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    order_no VARCHAR(50) NOT NULL UNIQUE,
    status ENUM('PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    shipping_fee DECIMAL(10,2) DEFAULT 0.00,
    point_used INT DEFAULT 0,
    addr_snapshot JSON NOT NULL,
    memo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_status (user_id, status),
    INDEX idx_order_no (order_no),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_status (status)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4.3 주문 상품
CREATE TABLE order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    design_id BIGINT UNSIGNED NULL,
    product_name VARCHAR(255) NOT NULL,
    qty INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    option_snapshot JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (design_id) REFERENCES editor_designs(id) ON DELETE SET NULL,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4.4 결제
CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    provider ENUM('PORTONE', 'KCP', 'ETC') NOT NULL DEFAULT 'PORTONE',
    tx_id VARCHAR(255),
    method VARCHAR(50),
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('INIT', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'INIT',
    raw JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    INDEX idx_order (order_id),
    INDEX idx_tx_id (tx_id),
    INDEX idx_status (status)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4.5 배송
CREATE TABLE shipments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    carrier VARCHAR(60),
    tracking_no VARCHAR(120),
    status ENUM('READY', 'IN_TRANSIT', 'DELIVERED', 'RETURNED') NOT NULL DEFAULT 'READY',
    shipped_at DATETIME NULL,
    delivered_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    INDEX idx_order (order_id),
    INDEX idx_tracking (tracking_no),
    INDEX idx_status (status)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4.6 배송 이벤트
CREATE TABLE shipment_events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    shipment_id BIGINT UNSIGNED NOT NULL,
    event_time DATETIME NOT NULL,
    location VARCHAR(255),
    description TEXT NOT NULL,
    raw JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
    INDEX idx_shipment_time (shipment_id, event_time DESC)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==========================================
-- 5. 리뷰/찜/포인트
-- ==========================================

-- 5.1 리뷰
CREATE TABLE reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    order_item_id BIGINT UNSIGNED,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    content TEXT,
    images JSON,
    is_hidden TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (order_item_id) REFERENCES order_items(id),
    INDEX idx_product_hidden (product_id, is_hidden),
    INDEX idx_user (user_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 5.2 찜
CREATE TABLE favorites (
    user_id BIGINT UNSIGNED,
    product_id BIGINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 5.3 포인트 원장
CREATE TABLE point_ledger (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    direction ENUM('EARN', 'SPEND', 'EXPIRE', 'ADJUST') NOT NULL,
    amount INT NOT NULL,
    balance INT NOT NULL,
    earn_rate DECIMAL(5,2) DEFAULT 2.00,
    reason VARCHAR(120) NOT NULL,
    ref_type VARCHAR(50),
    ref_id BIGINT UNSIGNED,
    expires_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_created (user_id, created_at DESC),
    INDEX idx_expires (expires_at),
    INDEX idx_direction (direction)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==========================================
-- 6. 커뮤니티
-- ==========================================

-- 6.1 게시판 카테고리
CREATE TABLE post_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(160) NOT NULL UNIQUE,
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_active_sort (is_active, sort_order)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 6.2 게시글
CREATE TABLE posts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    images JSON,
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    is_pinned TINYINT(1) DEFAULT 0,
    is_hidden TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES post_categories(id),
    INDEX idx_category_created (category_id, created_at DESC),
    INDEX idx_user_created (user_id, created_at DESC),
    INDEX idx_pinned_created (is_pinned DESC, created_at DESC),
    INDEX idx_hidden (is_hidden)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 6.3 댓글
CREATE TABLE comments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    parent_id BIGINT UNSIGNED NULL,
    content TEXT NOT NULL,
    like_count INT DEFAULT 0,
    is_hidden TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    INDEX idx_post_created (post_id, created_at),
    INDEX idx_parent (parent_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 6.4 게시글 좋아요
CREATE TABLE post_likes (
    user_id BIGINT UNSIGNED,
    post_id BIGINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    INDEX idx_post (post_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 6.5 댓글 좋아요
CREATE TABLE comment_likes (
    user_id BIGINT UNSIGNED,
    comment_id BIGINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, comment_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    INDEX idx_comment (comment_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 6.6 팔로우
CREATE TABLE follows (
    follower_id BIGINT UNSIGNED,
    following_id BIGINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_following (following_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 6.7 알림
CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    ref_type VARCHAR(50),
    ref_id BIGINT UNSIGNED,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read),
    INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==========================================
-- 7. 쿠폰/프로모션
-- ==========================================

-- 7.1 쿠폰
CREATE TABLE coupons (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type ENUM('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING') NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    min_amount DECIMAL(10,2) DEFAULT 0.00,
    max_discount DECIMAL(10,2),
    usage_limit INT DEFAULT 0,
    usage_count INT DEFAULT 0,
    per_user_limit INT DEFAULT 1,
    start_at DATETIME NOT NULL,
    end_at DATETIME NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_active_dates (is_active, start_at, end_at)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 7.2 사용자별 쿠폰 사용 이력
CREATE TABLE user_coupons (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    coupon_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NULL,
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (coupon_id) REFERENCES coupons(id),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    INDEX idx_user_coupon (user_id, coupon_id),
    INDEX idx_order (order_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==========================================
-- 8. 배너/슬라이드/아티스트
-- ==========================================

-- 8.1 배너
CREATE TABLE banners (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(512) NOT NULL,
    href VARCHAR(255),
    start_at DATETIME NOT NULL,
    end_at DATETIME NOT NULL,
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active_dates (is_active, start_at, end_at),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 8.2 메인 슬라이드
CREATE TABLE slides (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    image_url VARCHAR(512) NOT NULL,
    href VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active_sort (is_active, sort_order)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 8.3 아티스트 굿즈
CREATE TABLE artist_goods (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    artist_name VARCHAR(120),
    group_name VARCHAR(120),
    fandom VARCHAR(120),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_artist (artist_name),
    INDEX idx_fandom (fandom)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==========================================
-- 9. 미디어/CMS
-- ==========================================

-- 9.1 이미지 업로드 관리
CREATE TABLE media_uploads (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    url VARCHAR(512) NOT NULL,
    size INT UNSIGNED NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 9.2 CMS 설정
CREATE TABLE cms_settings (
    `key` VARCHAR(100) PRIMARY KEY,
    `value` TEXT NOT NULL,
    type ENUM('TEXT', 'IMAGE', 'JSON', 'NUMBER') NOT NULL DEFAULT 'TEXT',
    category VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    updated_by BIGINT UNSIGNED,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_category (category)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==========================================
-- 10. 시스템/로그
-- ==========================================

-- 10.1 관리자 활동 로그
CREATE TABLE admin_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admin_id BIGINT UNSIGNED NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id BIGINT UNSIGNED,
    changes JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id),
    INDEX idx_admin_created (admin_id, created_at DESC),
    INDEX idx_target (target_type, target_id),
    INDEX idx_action (action)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 10.2 시스템 설정
CREATE TABLE system_configs (
    `key` VARCHAR(100) PRIMARY KEY,
    `value` TEXT NOT NULL,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==========================================
-- 기본 데이터 삽입
-- ==========================================

-- 기본 역할 데이터
INSERT INTO roles (code, name) VALUES 
('USER', '일반사용자'),
('SELLER', '판매자'),
('STAFF', '직원'),
('ADMIN', '관리자');

-- 기본 게시판 카테고리
INSERT INTO post_categories (name, slug, sort_order, is_active) VALUES
('공지사항', 'notice', 1, 1),
('팬덤토크', 'fandom', 2, 1),
('창작자소통', 'creator', 3, 1),
('상품후기', 'review', 4, 1),
('자유게시판', 'free', 5, 1);

-- 기본 상품 카테고리
INSERT INTO categories (name, slug, parent_id, sort_order, is_active) VALUES
-- 1차 카테고리
('팬굿즈', 'fan-goods', NULL, 1, 1),
('단체/기업굿즈', 'corporate-goods', NULL, 2, 1),
('광고/사인물', 'signage', NULL, 3, 1),
('반려동물용품', 'pet-goods', NULL, 4, 1),
('포장/부자재', 'packaging', NULL, 5, 1);

-- 팬굿즈 하위 카테고리
INSERT INTO categories (name, slug, parent_id, sort_order, is_active) VALUES
('아크릴', 'acrylic', 1, 1, 1),
('포토카드', 'photocard', 1, 2, 1),
('키링', 'keyring', 1, 3, 1),
('스티커', 'sticker', 1, 4, 1),
('응원봉', 'light-stick', 1, 5, 1);

-- 단체/기업굿즈 하위 카테고리
INSERT INTO categories (name, slug, parent_id, sort_order, is_active) VALUES
('머그컵', 'mug', 2, 1, 1),
('티셔츠', 't-shirt', 2, 2, 1),
('텀블러', 'tumbler', 2, 3, 1),
('수건', 'towel', 2, 4, 1),
('시계', 'clock', 2, 5, 1),
('우산', 'umbrella', 2, 6, 1);

-- 광고/사인물 하위 카테고리
INSERT INTO categories (name, slug, parent_id, sort_order, is_active) VALUES
('LED 네온', 'led-neon', 3, 1, 1),
('미니간판', 'mini-sign', 3, 2, 1),
('환경디자인', 'environmental-design', 3, 3, 1);

-- 반려동물용품 하위 카테고리
INSERT INTO categories (name, slug, parent_id, sort_order, is_active) VALUES
('액자', 'frame', 4, 1, 1),
('방석', 'cushion', 4, 2, 1),
('장례굿즈', 'memorial', 4, 3, 1);

-- 포장/부자재 하위 카테고리
INSERT INTO categories (name, slug, parent_id, sort_order, is_active) VALUES
('굿즈 패키징', 'goods-packaging', 5, 1, 1),
('전시 부자재', 'display-materials', 5, 2, 1);

-- 기본 CMS 설정
INSERT INTO cms_settings (`key`, `value`, type, category, description) VALUES
('site_title', 'Pinto - 나만의 굿즈 플랫폼', 'TEXT', 'system', '사이트 제목'),
('site_description', '누구나 자신만의 굿즈를 제작하고 판매할 수 있는 올인원 커머스 플랫폼', 'TEXT', 'system', '사이트 설명'),
('point_rate', '2.00', 'NUMBER', 'system', '포인트 적립률 (%)'),
('free_shipping_amount', '30000', 'NUMBER', 'system', '무료배송 기준금액'),
('default_shipping_fee', '3000', 'NUMBER', 'system', '기본 배송비'),
('main_banner_count', '5', 'NUMBER', 'banner', '메인 배너 최대 개수'),
('slide_count', '3', 'NUMBER', 'banner', '메인 슬라이드 개수');

-- 기본 시스템 설정
INSERT INTO system_configs (`key`, `value`, description) VALUES
('maintenance_mode', 'false', '점검 모드 활성화 여부'),
('user_registration', 'true', '회원가입 허용 여부'),
('seller_registration', 'true', '셀러 등록 허용 여부'),
('editor_enabled', 'true', '굿즈 에디터 활성화 여부'),
('community_enabled', 'true', '커뮤니티 기능 활성화 여부');

-- 에디터 기본 템플릿 (예시)
INSERT INTO editor_templates (name, category, template_data, thumbnail_url, is_active, sort_order) VALUES
('기본 텍스트', 'text', '{"layers": [{"type": "text", "content": "샘플 텍스트", "x": 50, "y": 50, "fontSize": 16, "color": "#000000"}]}', '/images/templates/basic-text.png', 1, 1),
('기본 이미지', 'image', '{"layers": [{"type": "image", "src": "", "x": 0, "y": 0, "width": 200, "height": 200}]}', '/images/templates/basic-image.png', 1, 2),
('텍스트+이미지', 'combo', '{"layers": [{"type": "image", "src": "", "x": 0, "y": 0, "width": 150, "height": 150}, {"type": "text", "content": "텍스트", "x": 160, "y": 50, "fontSize": 14, "color": "#000000"}]}', '/images/templates/text-image.png', 1, 3);

-- 에디터 기본 소재 (예시)
INSERT INTO editor_assets (name, category, url, type, is_free, is_active) VALUES
('하트', 'icons', '/images/assets/heart.png', 'ICON', 1, 1),
('별', 'icons', '/images/assets/star.png', 'ICON', 1, 1),
('웃음', 'icons', '/images/assets/smile.png', 'ICON', 1, 1),
('기본폰트', 'fonts', '/fonts/basic.woff2', 'FONT', 1, 1),
('제목폰트', 'fonts', '/fonts/title.woff2', 'FONT', 0, 1);

-- ==========================================
-- 트리거 설정 (자동 계산)
-- ==========================================

-- 상품 평점 자동 계산 트리거
DELIMITER $

CREATE TRIGGER update_product_rating_after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE products 
    SET rating_avg = (
        SELECT ROUND(AVG(rating), 1) 
        FROM reviews 
        WHERE product_id = NEW.product_id AND is_hidden = 0
    ),
    review_count = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE product_id = NEW.product_id AND is_hidden = 0
    )
    WHERE id = NEW.product_id;
END$

CREATE TRIGGER update_product_rating_after_review_update
AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
    UPDATE products 
    SET rating_avg = (
        SELECT ROUND(AVG(rating), 1) 
        FROM reviews 
        WHERE product_id = NEW.product_id AND is_hidden = 0
    ),
    review_count = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE product_id = NEW.product_id AND is_hidden = 0
    )
    WHERE id = NEW.product_id;
END$

CREATE TRIGGER update_product_rating_after_review_delete
AFTER DELETE ON reviews
FOR EACH ROW
BEGIN
    UPDATE products 
    SET rating_avg = COALESCE((
        SELECT ROUND(AVG(rating), 1) 
        FROM reviews 
        WHERE product_id = OLD.product_id AND is_hidden = 0
    ), 0),
    review_count = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE product_id = OLD.product_id AND is_hidden = 0
    )
    WHERE id = OLD.product_id;
END$

-- 게시글 댓글 수 자동 계산 트리거
CREATE TRIGGER update_post_comment_count_after_insert
AFTER INSERT ON comments
FOR EACH ROW
BEGIN
    UPDATE posts 
    SET comment_count = (
        SELECT COUNT(*) 
        FROM comments 
        WHERE post_id = NEW.post_id AND is_hidden = 0
    )
    WHERE id = NEW.post_id;
END$

CREATE TRIGGER update_post_comment_count_after_update
AFTER UPDATE ON comments
FOR EACH ROW
BEGIN
    UPDATE posts 
    SET comment_count = (
        SELECT COUNT(*) 
        FROM comments 
        WHERE post_id = NEW.post_id AND is_hidden = 0
    )
    WHERE id = NEW.post_id;
END$

CREATE TRIGGER update_post_comment_count_after_delete
AFTER DELETE ON comments
FOR EACH ROW
BEGIN
    UPDATE posts 
    SET comment_count = (
        SELECT COUNT(*) 
        FROM comments 
        WHERE post_id = OLD.post_id AND is_hidden = 0
    )
    WHERE id = OLD.post_id;
END$

-- 게시글 좋아요 수 자동 계산 트리거
CREATE TRIGGER update_post_like_count_after_insert
AFTER INSERT ON post_likes
FOR EACH ROW
BEGIN
    UPDATE posts 
    SET like_count = (
        SELECT COUNT(*) 
        FROM post_likes 
        WHERE post_id = NEW.post_id
    )
    WHERE id = NEW.post_id;
END$

CREATE TRIGGER update_post_like_count_after_delete
AFTER DELETE ON post_likes
FOR EACH ROW
BEGIN
    UPDATE posts 
    SET like_count = (
        SELECT COUNT(*) 
        FROM post_likes 
        WHERE post_id = OLD.post_id
    )
    WHERE id = OLD.post_id;
END$

-- 댓글 좋아요 수 자동 계산 트리거
CREATE TRIGGER update_comment_like_count_after_insert
AFTER INSERT ON comment_likes
FOR EACH ROW
BEGIN
    UPDATE comments 
    SET like_count = (
        SELECT COUNT(*) 
        FROM comment_likes 
        WHERE comment_id = NEW.comment_id
    )
    WHERE id = NEW.comment_id;
END$

CREATE TRIGGER update_comment_like_count_after_delete
AFTER DELETE ON comment_likes
FOR EACH ROW
BEGIN
    UPDATE comments 
    SET like_count = (
        SELECT COUNT(*) 
        FROM comment_likes 
        WHERE comment_id = OLD.comment_id
    )
    WHERE id = OLD.comment_id;
END$

-- 쿠폰 사용 횟수 자동 증가 트리거
CREATE TRIGGER update_coupon_usage_after_use
AFTER INSERT ON user_coupons
FOR EACH ROW
BEGIN
    UPDATE coupons 
    SET usage_count = usage_count + 1
    WHERE id = NEW.coupon_id;
END$

DELIMITER ;

-- ==========================================
-- 성능 최적화를 위한 추가 인덱스
-- ==========================================

-- 복합 인덱스들
CREATE INDEX idx_products_category_status_created ON products(category_id, status, created_at DESC);
CREATE INDEX idx_products_seller_status_created ON products(seller_id, status, created_at DESC);
CREATE INDEX idx_orders_user_status_created ON orders(user_id, status, created_at DESC);
CREATE INDEX idx_posts_category_pinned_created ON posts(category_id, is_pinned DESC, created_at DESC);
CREATE INDEX idx_editor_designs_user_product ON editor_designs(user_id, product_id);
CREATE INDEX idx_point_ledger_user_direction ON point_ledger(user_id, direction);
CREATE INDEX idx_notifications_user_type_read ON notifications(user_id, type, is_read);

-- 전문 검색을 위한 FULLTEXT 인덱스 (선택사항)
-- ALTER TABLE products ADD FULLTEXT(name, description);
-- ALTER TABLE posts ADD FULLTEXT(title, content);

-- ==========================================
-- 뷰(View) 생성 - 자주 사용되는 조인 쿼리 최적화
-- ==========================================

-- 사용자 정보 통합 뷰
CREATE VIEW user_info AS
SELECT 
    u.id,
    u.email,
    u.status,
    u.created_at,
    up.nickname,
    up.name,
    up.phone,
    up.avatar_url,
    up.bio,
    GROUP_CONCAT(r.code) AS roles
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
GROUP BY u.id;

-- 상품 정보 통합 뷰
CREATE VIEW product_info AS
SELECT 
    p.*,
    c.name AS category_name,
    c.slug AS category_slug,
    s.brand_name AS seller_brand_name,
    s.status AS seller_status,
    COUNT(DISTINCT r.id) AS actual_review_count,
    COUNT(DISTINCT f.user_id) AS favorite_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN sellers s ON p.seller_id = s.id
LEFT JOIN reviews r ON p.id = r.product_id AND r.is_hidden = 0
LEFT JOIN favorites f ON p.id = f.product_id
GROUP BY p.id;

-- 주문 정보 통합 뷰
CREATE VIEW order_info AS
SELECT 
    o.*,
    up.nickname AS buyer_nickname,
    COUNT(oi.id) AS item_count,
    SUM(oi.qty) AS total_qty
FROM orders o
LEFT JOIN user_profiles up ON o.user_id = up.user_id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;