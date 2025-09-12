import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    let sql = `
      SELECT id, title, description, image_url, sort_order, is_active
      FROM info_cards 
    `;
    
    if (!includeInactive) {
      sql += ` WHERE is_active = 1 `;
    }
    
    sql += ` ORDER BY sort_order ASC, id ASC`;
    
    const results = await query(sql) as any[];
    
    const infoCards = results.map((row) => ({
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      imageUrl: row.image_url,
      sortOrder: row.sort_order,
      isActive: Boolean(row.is_active)
    }));

    return NextResponse.json({ infoCards });
  } catch (error) {
    console.error('Failed to fetch info cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch info cards' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { title, description, imageUrl, sortOrder } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO info_cards (title, description, image_url, sort_order)
      VALUES (?, ?, ?, ?)
    `;

    const result = await query(sql, [
      title,
      description,
      imageUrl || null,
      sortOrder || 0
    ]) as any;

    return NextResponse.json({
      id: result.insertId.toString(),
      title,
      description,
      imageUrl: imageUrl || null,
      sortOrder: sortOrder || 0
    });
  } catch (error) {
    console.error('Failed to create info card:', error);
    return NextResponse.json(
      { error: 'Failed to create info card' },
      { status: 500 }
    );
  }
}