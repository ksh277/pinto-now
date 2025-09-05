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

export async function GET() {
  try {
    const conn = 'url' in parseDb()
      ? await mysql.createConnection(parseDb().url as string)
      : await mysql.createConnection(parseDb() as any);

    const [items] = await conn.query(`
      SELECT id, title, image_url, href, sort_order 
      FROM category_shortcuts 
      WHERE is_active = TRUE 
      ORDER BY sort_order ASC 
      LIMIT 12
    `);

    await conn.end();

    const transformedItems = (items as any[]).map((item) => ({
      id: item.id.toString(),
      label: item.title,
      imgSrc: item.image_url,
      href: item.href,
      sortOrder: item.sort_order
    }));

    return NextResponse.json(transformedItems, { status: 200 });
  } catch (e: any) {
    console.error('Category Shortcuts API Error:', e);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const conn = 'url' in parseDb()
      ? await mysql.createConnection(parseDb().url as string)
      : await mysql.createConnection(parseDb() as any);

    // 현재 활성 카테고리 개수 확인 (최대 12개)
    const [countResult] = await conn.query('SELECT COUNT(*) as count FROM category_shortcuts WHERE is_active = TRUE');
    const currentCount = (countResult as any)[0].count;

    if (currentCount >= 12) {
      await conn.end();
      return NextResponse.json({ error: '최대 12개까지만 등록할 수 있습니다.' }, { status: 400 });
    }

    const created = await conn.query(`
      INSERT INTO category_shortcuts (title, image_url, href, sort_order, is_active) 
      VALUES (?, ?, ?, ?, ?)
    `, [
      data.title,
      data.image_url,
      data.href || '#',
      data.sort_order ?? currentCount + 1,
      data.is_active ?? true
    ]);

    await conn.end();

    return NextResponse.json({ 
      ok: true, 
      message: '카테고리 숏컷이 생성되었습니다.',
      id: (created as any)[0].insertId
    }, { status: 201 });
  } catch (e: any) {
    console.error('Category Shortcuts POST Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json({ error: 'ID가 필요합니다.' }, { status: 400 });
    }

    const conn = 'url' in parseDb()
      ? await mysql.createConnection(parseDb().url as string)
      : await mysql.createConnection(parseDb() as any);

    const updateFields = [];
    const updateValues = [];

    if (updateData.title) {
      updateFields.push('title = ?');
      updateValues.push(updateData.title);
    }
    if (updateData.image_url) {
      updateFields.push('image_url = ?');
      updateValues.push(updateData.image_url);
    }
    if (updateData.href) {
      updateFields.push('href = ?');
      updateValues.push(updateData.href);
    }
    if (updateData.sort_order !== undefined) {
      updateFields.push('sort_order = ?');
      updateValues.push(updateData.sort_order);
    }
    if (updateData.is_active !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(updateData.is_active);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    await conn.query(`
      UPDATE category_shortcuts 
      SET ${updateFields.join(', ')} 
      WHERE id = ?
    `, updateValues);

    await conn.end();

    return NextResponse.json({ ok: true, message: '카테고리 숏컷이 수정되었습니다.' });
  } catch (e: any) {
    console.error('Category Shortcuts PUT Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID가 필요합니다.' }, { status: 400 });
    }

    const conn = 'url' in parseDb()
      ? await mysql.createConnection(parseDb().url as string)
      : await mysql.createConnection(parseDb() as any);

    await conn.query('UPDATE category_shortcuts SET is_active = FALSE WHERE id = ?', [id]);

    await conn.end();

    return NextResponse.json({ ok: true, message: '카테고리 숏컷이 삭제되었습니다.' });
  } catch (e: any) {
    console.error('Category Shortcuts DELETE Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}