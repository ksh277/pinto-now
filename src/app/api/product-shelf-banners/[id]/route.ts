import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyToken } from '@/lib/auth/jwt';

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

    const bannerId = params.id;
    const updates = await request.json();

    // Build dynamic update query based on provided fields
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (updates.title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(updates.title);
    }
    if (updates.description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(updates.description);
    }
    if (updates.imageUrl !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(updates.imageUrl);
    }
    // more_link 컬럼이 없으므로 주석 처리
    // if (updates.moreLink !== undefined) {
    //   updateFields.push('more_link = ?');
    //   updateValues.push(updates.moreLink);
    // }
    if (updates.sortOrder !== undefined) {
      updateFields.push('sort_order = ?');
      updateValues.push(updates.sortOrder);
    }
    if (updates.isActive !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(updates.isActive ? 1 : 0);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    updateValues.push(bannerId);

    const sql = `
      UPDATE product_shelf_banners 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;

    await query(sql, updateValues);

    // Handle product associations if provided
    if (updates.productIds !== undefined && Array.isArray(updates.productIds)) {
      // Delete existing associations
      await query('DELETE FROM product_shelf_banner_products WHERE banner_id = ?', [bannerId]);

      // Add new associations
      if (updates.productIds.length > 0) {
        const productAssociations = updates.productIds.map((productId: string, index: number) => [
          bannerId,
          productId,
          index
        ]);

        const productSql = `
          INSERT INTO product_shelf_banner_products (banner_id, product_id, sort_order)
          VALUES ${productAssociations.map(() => '(?, ?, ?)').join(', ')}
        `;

        await query(productSql, productAssociations.flat());
      }
    }

    return NextResponse.json({ 
      message: 'Banner updated successfully',
      id: bannerId 
    });
  } catch (error) {
    console.error('Failed to update banner:', error);
    return NextResponse.json(
      { error: 'Failed to update banner' },
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

    const bannerId = params.id;

    // Delete product associations first
    await query('DELETE FROM product_shelf_banner_products WHERE banner_id = ?', [bannerId]);

    // Delete the banner
    await query('DELETE FROM product_shelf_banners WHERE id = ?', [bannerId]);

    return NextResponse.json({ 
      message: 'Banner deleted successfully',
      id: bannerId 
    });
  } catch (error) {
    console.error('Failed to delete banner:', error);
    return NextResponse.json(
      { error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
}