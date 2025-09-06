-- COMPLETE CLOUD SQL DATABASE DEPLOYMENT - PINTO 프로젝트
-- 생성일: 2025-09-06
-- 이 파일은 전체 로컬 데이터베이스 구조와 데이터를 Cloud SQL에 똑같이 생성합니다.

-- 데이터베이스 생성 및 선택
CREATE DATABASE IF NOT EXISTS `pinto` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `pinto`;

-- 기존 테이블 순서대로 삭제 (외래키 제약 때문에 순서 중요)
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `weekly_rankings`;
DROP TABLE IF EXISTS `review_likes`;
DROP TABLE IF EXISTS `review_comments`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `product_clicks`;
DROP TABLE IF EXISTS `product_stats`;
DROP TABLE IF EXISTS `product_shelf_banner_products`;
DROP TABLE IF EXISTS `product_shelf_banners`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `category_shortcuts`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `sellers`;
DROP TABLE IF EXISTS `banners`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `user_profiles`;
DROP TABLE IF EXISTS `editor_templates`;
DROP TABLE IF EXISTS `editor_assets`;
DROP TABLE IF EXISTS `cms_settings`;
DROP TABLE IF EXISTS `system_configs`;
DROP TABLE IF EXISTS `post_categories`;
DROP TABLE IF EXISTS `notices`;
DROP TABLE IF EXISTS `inquiries`;
DROP TABLE IF EXISTS `guides`;
DROP TABLE IF EXISTS `faq`;
DROP TABLE IF EXISTS `community_posts`;
DROP TABLE IF EXISTS `Design`;

-- ============================================
-- 1. USERS 테이블 (사용자 정보)
-- ============================================
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tel` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zipcode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receive_sms` tinyint(1) NOT NULL DEFAULT '1',
  `receive_email` tinyint(1) NOT NULL DEFAULT '1',
  `is_lifetime_member` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('ACTIVE','INACTIVE','SUSPENDED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. ROLES 테이블 (역할 관리)
-- ============================================
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. SELLERS 테이블 (판매자 정보)
-- ============================================
CREATE TABLE `sellers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `brand_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `business_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seller_type` enum('individual','business') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'individual',
  `status` enum('PENDING','APPROVED','REJECTED','SUSPENDED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. CATEGORIES 테이블 (상품 카테고리)
-- ============================================
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `parent_id` bigint unsigned DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `parent_id` (`parent_id`),
  KEY `idx_active_sort` (`is_active`,`sort_order`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. PRODUCTS 테이블 (상품 정보)
-- ============================================
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `seller_id` bigint unsigned NOT NULL,
  `category_id` bigint unsigned DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) unsigned NOT NULL,
  `compare_price` decimal(10,2) unsigned DEFAULT NULL,
  `cost_price` decimal(10,2) unsigned DEFAULT NULL,
  `sku` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `barcode` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `track_quantity` tinyint(1) NOT NULL DEFAULT '1',
  `quantity` int unsigned NOT NULL DEFAULT '0',
  `allow_out_of_stock` tinyint(1) NOT NULL DEFAULT '0',
  `weight` decimal(8,2) unsigned DEFAULT NULL,
  `requires_shipping` tinyint(1) NOT NULL DEFAULT '1',
  `taxable` tinyint(1) NOT NULL DEFAULT '1',
  `status` enum('DRAFT','ACTIVE','ARCHIVED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `visibility` enum('PUBLIC','PRIVATE','HIDDEN') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLIC',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  `seo_title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seo_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `thumbnail_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `images_json` json DEFAULT NULL,
  `variants_json` json DEFAULT NULL,
  `attributes_json` json DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `seller_id` (`seller_id`),
  KEY `category_id` (`category_id`),
  KEY `idx_status_visibility` (`status`,`visibility`),
  KEY `idx_featured` (`featured`),
  KEY `idx_published` (`published_at`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. PRODUCT_STATS 테이블 (상품 통계)
-- ============================================
CREATE TABLE `product_stats` (
  `product_id` bigint unsigned NOT NULL,
  `likes_count` int unsigned NOT NULL DEFAULT '0',
  `reviews_count` int unsigned NOT NULL DEFAULT '0',
  `sales_count` int unsigned NOT NULL DEFAULT '0',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. REVIEWS 테이블 (상품 리뷰)
-- ============================================
CREATE TABLE `reviews` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `rating` tinyint unsigned NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `body` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `images_json` json DEFAULT NULL,
  `helpful_count` int unsigned NOT NULL DEFAULT '0',
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_rating` (`rating`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. REVIEW_LIKES 테이블 (리뷰 좋아요)
-- ============================================
CREATE TABLE `review_likes` (
  `user_id` bigint unsigned NOT NULL,
  `review_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`review_id`),
  KEY `review_id` (`review_id`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. REVIEW_COMMENTS 테이블 (리뷰 댓글)
-- ============================================
CREATE TABLE `review_comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `review_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `body` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `review_id` (`review_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 10. PRODUCT_CLICKS 테이블 (상품 클릭 추적)
-- ============================================
CREATE TABLE `product_clicks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `clicked_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product_time` (`product_id`,`clicked_at` DESC),
  KEY `idx_ip_time` (`ip_address`,`clicked_at` DESC)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 11. WEEKLY_RANKINGS 테이블 (주간 랭킹)
-- ============================================
CREATE TABLE `weekly_rankings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `seller_type` enum('individual','business') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `week_start` date NOT NULL,
  `week_end` date NOT NULL,
  `sales_count` int NOT NULL DEFAULT '0',
  `click_count` int NOT NULL DEFAULT '0',
  `ranking_score` decimal(10,3) NOT NULL DEFAULT '0.000',
  `rank_position` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_week_type_rank` (`week_start`,`seller_type`,`rank_position`),
  KEY `idx_product_week` (`product_id`,`week_start`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 12. BANNERS 테이블 (배너 관리)
-- ============================================
CREATE TABLE `banners` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `href` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `banner_type` enum('TOP_BANNER','STRIP_BANNER','HOME_SLIDER_PC','HOME_SLIDER_MOBILE','IMAGE_BANNER') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IMAGE_BANNER',
  `device_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_at` datetime NOT NULL,
  `end_at` datetime NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_type_active` (`banner_type`,`is_active`),
  KEY `idx_dates` (`start_at`,`end_at`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 13. PRODUCT_SHELF_BANNERS 테이블 (상품 진열대 배너)
-- ============================================
CREATE TABLE `product_shelf_banners` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_active_sort` (`is_active`,`sort_order`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 14. PRODUCT_SHELF_BANNER_PRODUCTS 테이블 (배너-상품 연관)
-- ============================================
CREATE TABLE `product_shelf_banner_products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `banner_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_banner_product` (`banner_id`,`product_id`),
  KEY `idx_banner_sort` (`banner_id`,`sort_order`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 15. CATEGORY_SHORTCUTS 테이블 (카테고리 바로가기)
-- ============================================
CREATE TABLE `category_shortcuts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `href` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_active_sort` (`is_active`,`sort_order`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 16. NOTICES 테이블 (공지사항)
-- ============================================
CREATE TABLE `notices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_pinned` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 17. INQUIRIES 테이블 (문의사항)
-- ============================================
CREATE TABLE `inquiries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned DEFAULT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` enum('open','answered','closed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `answer_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `answered_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  KEY `answered_by` (`answered_by`),
  KEY `idx_inquiries_product` (`product_id`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 18. GUIDES 테이블 (가이드)
-- ============================================
CREATE TABLE `guides` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 19. FAQ 테이블 (자주묻는질문)
-- ============================================
CREATE TABLE `faq` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `question` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `order_no` int NOT NULL DEFAULT '0',
  `is_open` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 20. COMMUNITY_POSTS 테이블 (커뮤니티 게시글)
-- ============================================
CREATE TABLE `community_posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `images_json` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `idx_posts_user` (`user_id`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 기타 시스템 테이블들
-- ============================================

-- CMS 설정 테이블
CREATE TABLE `cms_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type` enum('text','number','boolean','json') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'text',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 시스템 설정 테이블
CREATE TABLE `system_configs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `config_key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `config_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `config_key` (`config_key`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 사용자 프로필 테이블
CREATE TABLE `user_profiles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `avatar_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `website` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `social_links` json DEFAULT NULL,
  `preferences` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 에디터 템플릿 테이블
CREATE TABLE `editor_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `thumbnail_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `template_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `is_premium` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category_active` (`category`,`is_active`),
  KEY `idx_premium` (`is_premium`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 에디터 에셋 테이블
CREATE TABLE `editor_assets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_type` enum('image','font','icon','clipart') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size` bigint unsigned DEFAULT NULL,
  `width` int unsigned DEFAULT NULL,
  `height` int unsigned DEFAULT NULL,
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `is_premium` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_type_category` (`file_type`,`category`),
  KEY `idx_premium_active` (`is_premium`,`is_active`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 게시글 카테고리 테이블
CREATE TABLE `post_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `color` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 레거시 Design 테이블
CREATE TABLE `Design` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 외래키 제약 조건 추가
-- ============================================
ALTER TABLE `sellers` ADD CONSTRAINT `sellers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `categories` ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;
ALTER TABLE `product_stats` ADD CONSTRAINT `product_stats_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `review_likes` ADD CONSTRAINT `review_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `review_likes` ADD CONSTRAINT `review_likes_ibfk_2` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) ON DELETE CASCADE;
ALTER TABLE `review_comments` ADD CONSTRAINT `review_comments_ibfk_1` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) ON DELETE CASCADE;
ALTER TABLE `review_comments` ADD CONSTRAINT `review_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `product_clicks` ADD CONSTRAINT `product_clicks_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
ALTER TABLE `weekly_rankings` ADD CONSTRAINT `weekly_rankings_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
ALTER TABLE `product_shelf_banner_products` ADD CONSTRAINT `product_shelf_banner_products_ibfk_1` FOREIGN KEY (`banner_id`) REFERENCES `product_shelf_banners` (`id`) ON DELETE CASCADE;
ALTER TABLE `product_shelf_banner_products` ADD CONSTRAINT `product_shelf_banner_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
ALTER TABLE `notices` ADD CONSTRAINT `notices_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
ALTER TABLE `inquiries` ADD CONSTRAINT `inquiries_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `inquiries` ADD CONSTRAINT `inquiries_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;
ALTER TABLE `inquiries` ADD CONSTRAINT `inquiries_ibfk_3` FOREIGN KEY (`answered_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
ALTER TABLE `community_posts` ADD CONSTRAINT `community_posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `Design` ADD CONSTRAINT `Design_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

-- ============================================
-- 기본 데이터 삽입
-- ============================================

-- 역할 데이터
INSERT INTO `roles` (`code`, `name`, `description`) VALUES
('USER', '일반사용자', '일반 사용자 권한'),
('SELLER', '판매자', '판매자 권한'),
('STAFF', '직원', '직원 권한'),
('ADMIN', '관리자', '관리자 권한');

-- 카테고리 데이터
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `sort_order`) VALUES
(1, '키링/열쇠고리', 'keyring', '다양한 키링과 열쇠고리', 1),
(2, '스티커', 'sticker', '개성있는 스티커 모음', 2),
(3, '문구용품', 'stationery', '북마크, 펜 등 문구용품', 3),
(4, '아크릴굿즈', 'acrylic', '아크릴 스탠드, 키링 등', 4),
(5, '한정굿즈', 'limited', '한정판 굿즈 모음', 5);

-- 관리자 사용자 (이미 생성된 경우 무시됨)
INSERT IGNORE INTO `users` (`email`, `username`, `password_hash`, `name`, `nickname`, `status`) VALUES
('admin@example.com', 'admin', '$2b$10$X8wQjX8B5k9tY2Kw8L4tXeN1U6Vz5Y7B2C4D3E1F9G8H0I2J1K3L4', 'Admin', '관리자', 'ACTIVE');

-- 개인 판매자 계정들
INSERT IGNORE INTO `users` (`id`, `email`, `username`, `name`, `nickname`) VALUES
(1, 'creator1@example.com', '개인창작자', '개인 창작자', '크리에이터1'),
(2, 'studio@example.com', '아트스튜디오', '아트 스튜디오', '스튜디오'),
(3, 'company@example.com', '크리에이티브컴퍼니', '크리에이티브 컴퍼니', '컴퍼니');

-- 카테고리 바로가기 데이터
INSERT IGNORE INTO `category_shortcuts` (`title`, `image_url`, `href`, `sort_order`) VALUES
('1인샵', 'https://placehold.co/100x100.png', '/category/1인샵', 1),
('선물추천', 'https://placehold.co/100x100.png', '/category/선물추천', 2),
('겨울아이디어', 'https://placehold.co/100x100.png', '/category/겨울아이디어', 3),
('여행굿즈', 'https://placehold.co/100x100.png', '/category/여행굿즈', 4),
('문구/미니', 'https://placehold.co/100x100.png', '/category/문구미니', 5),
('반려동물굿즈', 'https://placehold.co/100x100.png', '/category/반려동물굿즈', 6),
('의류', 'https://placehold.co/100x100.png', '/category/의류', 7),
('개성아이디어', 'https://placehold.co/100x100.png', '/category/개성아이디어', 8);

-- 샘플 제품들
INSERT IGNORE INTO `products` (`id`, `seller_id`, `category_id`, `name`, `slug`, `description`, `price`, `status`, `thumbnail_url`) VALUES
(1, 1, 1, 'Demo Acrylic Keyring', 'demo-acrylic-keyring', 'Test product', 12000.00, 'ACTIVE', 'https://placehold.co/300x300.png'),
(2, 1, 1, '귀여운 고양이 아크릴 키링', 'cute-cat-keyring', '손으로 그린 고양이 캐릭터 키링', 8000.00, 'ACTIVE', 'https://placehold.co/300x300/FFB6C1/000000?text=고양이키링'),
(3, 1, 2, '개성있는 스티커 세트', 'unique-sticker-set', '다양한 감정 표현 스티커', 15000.00, 'ACTIVE', 'https://placehold.co/300x300.png'),
(4, 1, 3, '핸드메이드 북마크', 'handmade-bookmark', '수제 태슬 북마크', 3000.00, 'ACTIVE', 'https://placehold.co/300x300/F0E68C/000000?text=북마크'),
(5, 1, 1, '미니어처 음식 키링', 'miniature-food-keyring', '리얼한 미니어처 음식 키링', 12000.00, 'ACTIVE', 'https://placehold.co/300x300/DDA0DD/000000?text=음식키링'),
(6, 1, 2, '일러스트 엽서 세트', 'illustration-postcard', '계절 테마 일러스트 엽서', 7000.00, 'ACTIVE', 'https://placehold.co/300x300/F4A460/000000?text=엽서세트'),
(7, 2, 4, '프리미엄 아크릴 스탠드', 'premium-acrylic-stand', '고급 아크릴 캐릭터 스탠드', 25000.00, 'ACTIVE', 'https://placehold.co/300x300/E6E6FA/000000?text=아크릴스탠드'),
(8, 2, 5, '한정판 굿즈 세트', 'limited-goods-set', '한정 수량 굿즈 패키지', 45000.00, 'ACTIVE', 'https://placehold.co/300x300/FFEFD5/000000?text=한정굿즈'),
(9, 3, 4, '기업 맞춤 굿즈', 'custom-corporate-goods', '기업용 맞춤 제작 굿즈', 35000.00, 'ACTIVE', 'https://placehold.co/300x300/E0FFFF/000000?text=기업굿즈'),
(10, 3, 5, '대량 제작 키링', 'bulk-production-keyring', '대량 생산용 고품질 키링', 15000.00, 'ACTIVE', 'https://placehold.co/300x300/FFFACD/000000?text=대량키링');

-- 제품 통계 데이터
INSERT IGNORE INTO `product_stats` (`product_id`, `likes_count`, `reviews_count`, `sales_count`) VALUES
(1, 0, 0, 0), (2, 0, 0, 0), (3, 0, 0, 0), (4, 0, 0, 0), (5, 0, 0, 0),
(6, 0, 0, 0), (7, 0, 0, 0), (8, 0, 0, 0), (9, 0, 0, 0), (10, 0, 0, 0);

-- 현재 주간 랭킹 데이터 (샘플)
INSERT IGNORE INTO `weekly_rankings` (`product_id`, `seller_type`, `week_start`, `week_end`, `sales_count`, `click_count`, `ranking_score`, `rank_position`) VALUES
(3, 'individual', CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY, CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY + INTERVAL 6 DAY, 0, 1, 1.000, 1),
(4, 'individual', CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY, CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY + INTERVAL 6 DAY, 0, 1, 1.000, 2),
(5, 'individual', CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY, CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY + INTERVAL 6 DAY, 0, 1, 1.000, 3),
(2, 'individual', CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY, CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY + INTERVAL 6 DAY, 0, 0, 0.000, 4);

-- 샘플 클릭 데이터
INSERT IGNORE INTO `product_clicks` (`product_id`, `user_id`, `ip_address`, `user_agent`, `clicked_at`) VALUES
(3, 1, '192.168.1.1', 'Mozilla/5.0', NOW()),
(4, NULL, '192.168.1.2', 'Mozilla/5.0', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(5, 1, '192.168.1.3', 'Mozilla/5.0', DATE_SUB(NOW(), INTERVAL 2 HOUR));

-- ============================================
-- 인덱스 최적화 및 설정
-- ============================================

-- 외래키 체크 재활성화
SET FOREIGN_KEY_CHECKS = 1;

-- 완료 메시지
SELECT 'Complete Cloud SQL database deployment completed successfully!' as result,
       COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'pinto';