import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sql = `
      SELECT id, title, description, image_url, sort_order, is_active
      FROM info_cards 
      WHERE id = ?
    `;
    
    const results = await query(sql, [params.id]) as any[];
    
    if (results.length === 0) {
      return NextResponse.json(
        { error: 'Info card not found' },
        { status: 404 }
      );
    }

    const row = results[0];
    const infoCard = {
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      imageUrl: row.image_url,
      sortOrder: row.sort_order,
      isActive: Boolean(row.is_active)
    };

    return NextResponse.json({ infoCard });
  } catch (error) {
    console.error('Failed to fetch info card:', error);
    return NextResponse.json(
      { error: 'Failed to fetch info card' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { title, description, imageUrl, sortOrder, isActive } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const sql = `
      UPDATE info_cards 
      SET title = ?, description = ?, image_url = ?, sort_order = ?, is_active = ?
      WHERE id = ?
    `;

    const result = await query(sql, [
      title,
      description,
      imageUrl || null,
      sortOrder || 0,
      isActive ? 1 : 0,
      params.id
    ]) as any;

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Info card not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: params.id,
      title,
      description,
      imageUrl: imageUrl || null,
      sortOrder: sortOrder || 0,
      isActive: Boolean(isActive)
    });
  } catch (error) {
    console.error('Failed to update info card:', error);
    return NextResponse.json(
      { error: 'Failed to update info card' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const sql = `DELETE FROM info_cards WHERE id = ?`;
    const result = await query(sql, [params.id]) as any;

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Info card not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete info card:', error);
    return NextResponse.json(
      { error: 'Failed to delete info card' },
      { status: 500 }
    );
  }
}