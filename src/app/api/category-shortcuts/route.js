import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * 카테고리 숏컷 API
 * GET /api/category-shortcuts
 */
export async function GET() {
  try {
    const shortcuts = await prisma.category_shortcuts.findMany({
      where: { is_active: true },
      orderBy: { sort_order: 'asc' }
    });

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
    const activeCount = await prisma.category_shortcuts.count({
      where: { is_active: true }
    });

    if (activeCount >= 12) {
      return NextResponse.json(
        { error: '카테고리 숏컷은 최대 12개까지만 등록 가능합니다.' },
        { status: 400 }
      );
    }

    // 다음 sort_order 계산
    const maxSortOrder = await prisma.category_shortcuts.findFirst({
      select: { sort_order: true },
      orderBy: { sort_order: 'desc' }
    });
    
    const nextSortOrder = (maxSortOrder?.sort_order || 0) + 1;

    const created = await prisma.category_shortcuts.create({
      data: {
        title: data.title.trim(),
        image_url: data.image_url.trim(),
        href: data.href.trim(),
        sort_order: nextSortOrder,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    return NextResponse.json({
      id: created.id.toString(),
      title: created.title,
      image_url: created.image_url,
      href: created.href,
      sort_order: created.sort_order,
      is_active: created.is_active
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

    const shortcutId = BigInt(data.id);
    
    const existingShortcut = await prisma.category_shortcuts.findUnique({
      where: { id: shortcutId }
    });

    if (!existingShortcut) {
      return NextResponse.json(
        { error: '카테고리 숏컷을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const updateData = {};
    if (data.title) updateData.title = data.title.trim();
    if (data.image_url) updateData.image_url = data.image_url.trim();
    if (data.href) updateData.href = data.href.trim();
    updateData.updated_at = new Date();

    const updated = await prisma.category_shortcuts.update({
      where: { id: shortcutId },
      data: updateData
    });

    return NextResponse.json({
      id: updated.id.toString(),
      title: updated.title,
      image_url: updated.image_url,
      href: updated.href,
      sort_order: updated.sort_order,
      is_active: updated.is_active
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

    const shortcutId = BigInt(id);
    
    const existingShortcut = await prisma.category_shortcuts.findUnique({
      where: { id: shortcutId }
    });

    if (!existingShortcut) {
      return NextResponse.json(
        { error: '카테고리 숏컷을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 소프트 삭제 (비활성화)
    await prisma.category_shortcuts.update({
      where: { id: shortcutId },
      data: { 
        is_active: false,
        updated_at: new Date()
      }
    });

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