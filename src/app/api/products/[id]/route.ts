import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    const sql = `DELETE FROM products WHERE id = ?`;
    await query(sql, [productId]);
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    const sql = `
      SELECT 
        id,
        name as nameKo,
        price as priceKrw,
        thumbnail_url as imageUrl,
        status,
        description,
        category_id as categoryId,
        stock_quantity as stockQuantity
      FROM products 
      WHERE id = ?
    `;
    
    const results = await query(sql, [productId]) as any[];
    
    if (results.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    const product = {
      id: results[0].id.toString(),
      nameKo: results[0].nameKo,
      priceKrw: results[0].priceKrw,
      imageUrl: results[0].imageUrl,
      status: results[0].status,
      description: results[0].description,
      categoryId: results[0].categoryId,
      stockQuantity: results[0].stockQuantity
    };

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const body = await request.json();
    
    const sql = `
      UPDATE products 
      SET 
        name = ?,
        price = ?,
        thumbnail_url = ?,
        description = ?,
        stock_quantity = ?,
        updated_at = NOW()
      WHERE id = ?
    `;
    
    await query(sql, [
      body.nameKo,
      body.priceKrw,
      body.imageUrl,
      body.description,
      body.stockQuantity,
      productId
    ]);
    
    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}