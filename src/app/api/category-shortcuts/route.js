import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

/**
 * 카테고리 숏컷 API
 * GET /api/category-shortcuts
 */
export async function GET() {
  try {
    const shortcuts = await query(
      'SELECT * FROM category_shortcuts WHERE is_active = ? ORDER BY sort_order ASC',
      [1]
    );

    const transformedShortcuts = shortcuts.map(shortcut => ({
      id: shortcut.id.toString(),
      title: shortcut.title,
      image_url: shortcut.image_url,
      href: shortcut.href,
      sort_order: shortcut.sort_order,
      is_active: shortcut.is_active
    }));

    return NextResponse.json(transformedShortcuts);
    
  } catch (error) {
    console.error('Category shortcuts API error:', error);
    return NextResponse.json([]);
  }
}

/**
 * 카테고리 숏컷 추가
 * POST /api/category-shortcuts
 */
export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.title || !data.image_url || !data.href) {
      return NextResponse.json(
        { error: '제목, 이미지 URL, 링크 URL은 필수입니다.' },
        { status: 400 }
      );
    }

    // 활성화된 카테고리 개수 확인
    const countResult = await query(
      'SELECT COUNT(*) as count FROM category_shortcuts WHERE is_active = ?',
      [1]
    );
    const activeCount = countResult[0].count;

    if (activeCount >= 12) {
      return NextResponse.json(
        { error: '카테고리 숏컷은 최대 12개까지만 등록 가능합니다.' },
        { status: 400 }
      );
    }

    // 다음 sort_order 계산
    const maxResult = await query(
      'SELECT MAX(sort_order) as max_sort FROM category_shortcuts'
    );
    const nextSortOrder = (maxResult[0].max_sort || 0) + 1;

    const insertResult = await query(
      'INSERT INTO category_shortcuts (title, image_url, href, sort_order, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        data.title.trim(),
        data.image_url.trim(),
        data.href.trim(),
        nextSortOrder,
        1,
        new Date().toISOString().slice(0, 19).replace('T', ' '),
        new Date().toISOString().slice(0, 19).replace('T', ' ')
      ]
    );

    return NextResponse.json({
      id: insertResult.insertId.toString(),
      title: data.title.trim(),
      image_url: data.image_url.trim(),
      href: data.href.trim(),
      sort_order: nextSortOrder,
      is_active: true
    }, { status: 201 });

  } catch (error) {
    console.error('Category shortcuts POST error:', error);
    return NextResponse.json(
      { error: '카테고리 숏컷 추가에 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 카테고리 숏컷 수정
 * PUT /api/category-shortcuts
 */
export async function PUT(request) {
  try {
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json(
        { error: 'ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const shortcutId = parseInt(data.id);
    
    const existingResult = await query(
      'SELECT * FROM category_shortcuts WHERE id = ?',
      [shortcutId]
    );

    if (existingResult.length === 0) {
      return NextResponse.json(
        { error: '카테고리 숏컷을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const updateData = {
      title: data.title?.trim() || existingResult[0].title,
      image_url: data.image_url?.trim() || existingResult[0].image_url,
      href: data.href?.trim() || existingResult[0].href,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    await query(
      'UPDATE category_shortcuts SET title = ?, image_url = ?, href = ?, updated_at = ? WHERE id = ?',
      [updateData.title, updateData.image_url, updateData.href, updateData.updated_at, shortcutId]
    );

    return NextResponse.json({
      id: shortcutId.toString(),
      title: updateData.title,
      image_url: updateData.image_url,
      href: updateData.href,
      sort_order: existingResult[0].sort_order,
      is_active: existingResult[0].is_active
    });

  } catch (error) {
    console.error('Category shortcuts PUT error:', error);
    return NextResponse.json(
      { error: '카테고리 숏컷 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 카테고리 숏컷 삭제 (비활성화)
 * DELETE /api/category-shortcuts?id=123
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const shortcutId = parseInt(id);
    
    const existingResult = await query(
      'SELECT * FROM category_shortcuts WHERE id = ?',
      [shortcutId]
    );

    if (existingResult.length === 0) {
      return NextResponse.json(
        { error: '카테고리 숏컷을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 소프트 삭제 (비활성화)
    await query(
      'UPDATE category_shortcuts SET is_active = ?, updated_at = ? WHERE id = ?',
      [0, new Date().toISOString().slice(0, 19).replace('T', ' '), shortcutId]
    );

    return NextResponse.json({ 
      message: '카테고리 숏컷이 삭제되었습니다.',
      deletedId: id 
    });

  } catch (error) {
    console.error('Category shortcuts DELETE error:', error);
    return NextResponse.json(
      { error: '카테고리 숏컷 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}