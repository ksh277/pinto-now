-- Create inquiries table if it doesn't exist
CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  type VARCHAR(50) NOT NULL COMMENT 'order, shipping, product, etc',
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status ENUM('received', 'in_progress', 'answered', 'closed') DEFAULT 'received',
  answer TEXT DEFAULT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='1:1 문의 테이블';

-- Insert sample data for testing
INSERT INTO inquiries (userId, type, title, content, status, answer) VALUES
(1, 'order', '주문 관련 문의입니다.', '주문번호 ORD-12345 관련하여 배송지 변경이 가능할까요?', 'answered', '안녕하세요, 핀토입니다. 배송지 변경 가능합니다. 변경하실 주소를 알려주세요.'),
(1, 'product', '상품 불량 문의', '받은 상품에 불량이 있어서 교환 요청드립니다.', 'in_progress', NULL),
(1, 'shipping', '배송 언제 되나요?', '주문한지 일주일이 지났는데 아직 배송이 시작되지 않았습니다.', 'received', NULL)
ON DUPLICATE KEY UPDATE id=id;