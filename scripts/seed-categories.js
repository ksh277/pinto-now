// 카테고리를 데이터베이스에 삽입하는 스크립트
const mysql = require('mysql2/promise');

// 카테고리 데이터
const categories = [
  {
    id: 1,
    nameKo: '아크릴',
    nameEn: 'Acrylic',
    description: '투명하고 견고한 프리미엄 아크릴 제품들',
    isActive: 1
  },
  {
    id: 2,
    nameKo: '의류',
    nameEn: 'Clothing',
    description: '맞춤 티셔츠, 후드티 등 다양한 의류 제품들',
    isActive: 1
  },
  {
    id: 3,
    nameKo: '스티커',
    nameEn: 'Sticker',
    description: '다양한 용도의 맞춤 스티커 제품들',
    isActive: 1
  },
  {
    id: 4,
    nameKo: '문구/오피스',
    nameEn: 'Stationery/Office',
    description: '맞춤 노트, 펜, 마우스패드 등 다양한 문구용품들',
    isActive: 1
  }
];

async function seedCategories() {
  let connection;

  try {
    // 환경변수 로드
    require('dotenv').config({ path: '.env.local' });

    // 데이터베이스 연결 (DATABASE_URL 사용)
    let connectionConfig;

    if (process.env.DATABASE_URL) {
      // PlanetScale 연결
      const url = process.env.DATABASE_URL;
      const m = url.match(/^mysql:\/\/([^:]+):([^@]+)@([^:/]+)(?::(\d+))?\/([^?]+)(\?.*)?$/);
      if (!m) throw new Error('Invalid DATABASE_URL');

      connectionConfig = {
        host: m[3],
        port: m[4] ? Number(m[4]) : 3306,
        user: m[1],
        password: m[2],
        database: m[5],
        charset: 'utf8mb4',
        ssl: {
          rejectUnauthorized: false
        }
      };
    } else {
      // 로컬 연결
      connectionConfig = {
        host: process.env.MYSQL_HOST || process.env.DB_HOST || '127.0.0.1',
        port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : (process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306),
        user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
        password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
        database: process.env.MYSQL_DB || process.env.DB_NAME || 'pinto',
        charset: 'utf8mb4'
      };
    }

    connection = await mysql.createConnection(connectionConfig);

    console.log('데이터베이스에 연결되었습니다.');

    // categories 테이블이 있는지 확인하고 없으면 생성
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name_ko VARCHAR(255) NOT NULL,
        name_en VARCHAR(255) NOT NULL,
        description TEXT,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    await connection.execute(createTableSql);
    console.log('categories 테이블을 확인/생성했습니다.');

    // 기존 카테고리들 삭제
    await connection.execute('DELETE FROM categories WHERE id BETWEEN 1 AND 10');
    console.log('기존 카테고리들을 삭제했습니다.');

    // 새 카테고리들 삽입
    for (const category of categories) {
      const sql = `
        INSERT INTO categories (
          id, name_ko, name_en, description, is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      `;

      await connection.execute(sql, [
        category.id,
        category.nameKo,
        category.nameEn,
        category.description,
        category.isActive
      ]);

      console.log(`${category.nameKo} 카테고리가 추가되었습니다. (ID: ${category.id})`);
    }

    console.log('모든 카테고리가 성공적으로 추가되었습니다!');

  } catch (error) {
    console.error('오류가 발생했습니다:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('데이터베이스 연결이 종료되었습니다.');
    }
  }
}

// 스크립트 실행
if (require.main === module) {
  seedCategories();
}

module.exports = { seedCategories };