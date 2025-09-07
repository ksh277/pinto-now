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
      href: shortcut.href,
      label: shortcut.title,
      imgSrc: shortcut.image_url,
      sortOrder: shortcut.sort_order
    }));

    return NextResponse.json(transformedShortcuts);
    
  } catch (error) {
    console.error('Category shortcuts API error:', error);
    
    // 데이터베이스 오류 시 기본 데이터 반환
    const fallbackShortcuts = [
      { id: '1', href: '/category/1만원이하굿즈', label: '1만원 이하 굿즈', imgSrc: 'https://placehold.co/100x100/FFB6C1/333?text=💰' },
      { id: '2', href: '/category/야구굿즈', label: '야구 굿즈', imgSrc: 'https://placehold.co/100x100/87CEEB/333?text=⚾' },
      { id: '3', href: '/category/여행굿즈', label: '여행 굿즈', imgSrc: 'https://placehold.co/100x100/98FB98/333?text=✈️' },
      { id: '4', href: '/category/팬굿즈', label: '팬 굿즈', imgSrc: 'https://placehold.co/100x100/DDA0DD/333?text=💜' },
      { id: '5', href: '/category/폰꾸미기', label: '폰꾸미기', imgSrc: 'https://placehold.co/100x100/FFE4B5/333?text=📱' },
      { id: '6', href: '/category/반려동물굿즈', label: '반려동물 굿즈', imgSrc: 'https://placehold.co/100x100/F0E68C/333?text=🐾' },
      { id: '7', href: '/category/선물추천', label: '선물 추천', imgSrc: 'https://placehold.co/100x100/F5DEB3/333?text=🎁' },
      { id: '8', href: '/category/커스텀아이디어', label: '커스텀 아이디어', imgSrc: 'https://placehold.co/100x100/E6E6FA/333?text=💡' }
    ];
    
    return NextResponse.json(fallbackShortcuts);
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
      href: created.href,
      label: created.title,
      imgSrc: created.image_url,
      sortOrder: created.sort_order
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
      href: updated.href,
      label: updated.title,
      imgSrc: updated.image_url,
      sortOrder: updated.sort_order
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