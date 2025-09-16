// 아크릴 상품 9개를 데이터베이스에 삽입하는 스크립트
const mysql = require('mysql2/promise');

// 9개 아크릴 상품 데이터
const acrylicProducts = [
  {
    id: 1,
    name: '아크릴코롯',
    description: '고품질 아크릴 코스터로 투명하고 견고한 제품입니다.',
    price: 2500,
    categoryId: 1,
    thumbnailUrl: '/components/img/placeholder-product.jpg'
  },
  {
    id: 2,
    name: '아크릴키링 3T',
    description: '3T 두께의 아크릴 키링으로 다양한 크기 제작 가능합니다.',
    price: 4200,
    categoryId: 1,
    thumbnailUrl: '/components/img/placeholder-product.jpg'
  },
  {
    id: 3,
    name: '포토프롭 3T',
    description: '3T 아크릴 포토프롭으로 사진 촬영용 소품입니다.',
    price: 3500,
    categoryId: 1,
    thumbnailUrl: '/components/img/placeholder-product.jpg'
  },
  {
    id: 4,
    name: '포토프(라미)',
    description: '라미네이트 처리된 포토프롭으로 내구성이 뛰어납니다.',
    price: 3000,
    categoryId: 1,
    thumbnailUrl: '/components/img/placeholder-product.jpg'
  },
  {
    id: 5,
    name: '아크릴스탠드(본품)',
    description: '아크릴 스탠드 본체로 견고하고 투명한 디스플레이 제품입니다.',
    price: 5500,
    categoryId: 1,
    thumbnailUrl: '/components/img/placeholder-product.jpg'
  },
  {
    id: 6,
    name: '라미키링',
    description: '라미네이트 처리된 키링으로 방수 기능이 있습니다.',
    price: 2000,
    categoryId: 1,
    thumbnailUrl: '/components/img/placeholder-product.jpg'
  },
  {
    id: 7,
    name: '아크릴 자석 냉장고 마그네틱',
    description: '냉장고에 붙이는 아크릴 자석으로 실용적인 제품입니다.',
    price: 4500,
    categoryId: 1,
    thumbnailUrl: '/components/img/placeholder-product.jpg'
  },
  {
    id: 8,
    name: '아크릴 스탠드(바닥판)',
    description: '아크릴 스탠드의 바닥판으로 안정적인 지지를 제공합니다.',
    price: 8300,
    categoryId: 1,
    thumbnailUrl: '/components/img/placeholder-product.jpg'
  },
  {
    id: 9,
    name: '라미',
    description: '라미네이트 처리된 제품으로 다양한 용도로 활용 가능합니다.',
    price: 1500,
    categoryId: 1,
    thumbnailUrl: '/components/img/placeholder-product.jpg'
  }
];

async function seedAcrylicProducts() {
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

    // 기존 테스트 상품들 삭제 (ID 1-9)
    await connection.execute('DELETE FROM products WHERE id BETWEEN 1 AND 9');
    console.log('기존 테스트 상품들을 삭제했습니다.');

    // 새 아크릴 상품들 삽입
    for (const product of acrylicProducts) {
      const sql = `
        INSERT INTO products (
          id, seller_id, category_id, name, slug, description,
          price, stock, status, thumbnail_url, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const slug = `${product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')}-${product.id}`;

      await connection.execute(sql, [
        product.id,
        1, // seller_id (관리자)
        product.categoryId,
        product.name,
        slug,
        product.description,
        product.price,
        100, // stock
        'ACTIVE',
        product.thumbnailUrl
      ]);

      console.log(`${product.name} 상품이 추가되었습니다. (ID: ${product.id})`);
    }

    console.log('모든 아크릴 상품이 성공적으로 추가되었습니다!');

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
  seedAcrylicProducts();
}

module.exports = { seedAcrylicProducts };