-- 리뷰 좋아요 테이블 추가
CREATE TABLE review_likes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    review_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review_like (review_id, user_id),
    INDEX idx_review (review_id),
    INDEX idx_user (user_id),
    INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 리뷰 댓글 테이블 추가
CREATE TABLE review_comments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    review_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    parent_id BIGINT UNSIGNED NULL,
    content TEXT NOT NULL,
    is_hidden TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES review_comments(id) ON DELETE CASCADE,
    INDEX idx_review (review_id),
    INDEX idx_user (user_id),
    INDEX idx_parent (parent_id),
    INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 리뷰 테이블에 좋아요 카운트와 댓글 카운트 컬럼 추가
ALTER TABLE reviews 
ADD COLUMN like_count INT DEFAULT 0,
ADD COLUMN comment_count INT DEFAULT 0,
ADD INDEX idx_like_count (like_count DESC),
ADD INDEX idx_comment_count (comment_count DESC);

-- 리뷰 좋아요 카운트 업데이트 트리거
DELIMITER //
CREATE TRIGGER update_review_like_count_after_insert
AFTER INSERT ON review_likes
FOR EACH ROW
BEGIN
    UPDATE reviews 
    SET like_count = (
        SELECT COUNT(*) 
        FROM review_likes 
        WHERE review_id = NEW.review_id
    )
    WHERE id = NEW.review_id;
END//

CREATE TRIGGER update_review_like_count_after_delete
AFTER DELETE ON review_likes
FOR EACH ROW
BEGIN
    UPDATE reviews 
    SET like_count = (
        SELECT COUNT(*) 
        FROM review_likes 
        WHERE review_id = OLD.review_id
    )
    WHERE id = OLD.review_id;
END//

-- 리뷰 댓글 카운트 업데이트 트리거
CREATE TRIGGER update_review_comment_count_after_insert
AFTER INSERT ON review_comments
FOR EACH ROW
BEGIN
    UPDATE reviews 
    SET comment_count = (
        SELECT COUNT(*) 
        FROM review_comments 
        WHERE review_id = NEW.review_id AND is_hidden = 0
    )
    WHERE id = NEW.review_id;
END//

CREATE TRIGGER update_review_comment_count_after_update
AFTER UPDATE ON review_comments
FOR EACH ROW
BEGIN
    UPDATE reviews 
    SET comment_count = (
        SELECT COUNT(*) 
        FROM review_comments 
        WHERE review_id = NEW.review_id AND is_hidden = 0
    )
    WHERE id = NEW.review_id;
END//

CREATE TRIGGER update_review_comment_count_after_delete
AFTER DELETE ON review_comments
FOR EACH ROW
BEGIN
    UPDATE reviews 
    SET comment_count = (
        SELECT COUNT(*) 
        FROM review_comments 
        WHERE review_id = OLD.review_id AND is_hidden = 0
    )
    WHERE id = OLD.review_id;
END//
DELIMITER ;