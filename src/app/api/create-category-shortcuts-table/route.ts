import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

function parseDb() {
  const url = process.env.DATABASE_URL;
  if (url) return { url };
  const {
    DB_HOST='localhost', DB_PORT='3306',
    DB_USER='root', DB_PASSWORD='12345', DB_NAME='pinto'
  } = process.env;
  return { host: DB_HOST, port: Number(DB_PORT), user: DB_USER, password: DB_PASSWORD, database: DB_NAME };
}

export async function POST(req: NextRequest) {
  try {
    const conn = 'url' in parseDb()
      ? await mysql.createConnection(parseDb().url as string)
      : await mysql.createConnection(parseDb() as any);

    // category_shortcuts 테이블 생성
    await conn.query(`
      CREATE TABLE IF NOT EXISTS category_shortcuts (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        image_url TEXT NOT NULL,
        href VARCHAR(500) NOT NULL,
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 기본 데이터 삽입 (기존 shortcutCategories 데이터)
    const defaultData = [
      { title: '1인샵', image_url: 'https://placehold.co/100x100.png', href: '/category/1인샵', sort_order: 1 },
      { title: '선물추천', image_url: 'https://placehold.co/100x100.png', href: '/category/선물추천', sort_order: 2 },
      { title: '겨울아이디어', image_url: 'https://placehold.co/100x100.png', href: '/category/겨울아이디어', sort_order: 3 },
      { title: '여행 굿즈', image_url: 'https://placehold.co/100x100.png', href: '/category/여행굿즈', sort_order: 4 },
      { title: '문구/미니', image_url: 'https://placehold.co/100x100.png', href: '/category/문구미니', sort_order: 5 },
      { title: '반려동물 굿즈', image_url: 'https://placehold.co/100x100.png', href: '/category/반려동물굿즈', sort_order: 6 },
      { title: '의류', image_url: 'https://placehold.co/100x100.png', href: '/category/의류', sort_order: 7 },
      { title: '개성 아이디어', image_url: 'https://placehold.co/100x100.png', href: '/category/개성아이디어', sort_order: 8 },
    ];

    // 기존 데이터가 있는지 확인
    const [existing] = await conn.query('SELECT COUNT(*) as count FROM category_shortcuts');
    const existingCount = (existing as any)[0].count;

    if (existingCount === 0) {
      // 기본 데이터 삽입
      for (const item of defaultData) {
        await conn.query(
          'INSERT INTO category_shortcuts (title, image_url, href, sort_order) VALUES (?, ?, ?, ?)',
          [item.title, item.image_url, item.href, item.sort_order]
        );
      }
    }

    await conn.end();

    return NextResponse.json({ 
      ok: true, 
      message: 'category_shortcuts 테이블이 생성되었습니다.',
      inserted: existingCount === 0 ? defaultData.length : 0
    });
  } catch (e: unknown) {
    console.error('Database error:', e);
    return NextResponse.json({ 
      ok: false, 
      error: e instanceof Error ? e.message : 'Unknown error' 
    }, { status: 500 });
  }
}