import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

interface Params { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const items = await query('SELECT * FROM banners WHERE id = ?', [parseInt(id)]) as any[];
    
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const item = items[0];
    const result = {
      id: item.id.toString(),
      href: item.href || '#',
      imgSrc: item.image_url,
      alt: item.title,
      title: item.title,
      mainTitle: item.main_title,
      subTitle: item.sub_title,
      moreButtonLink: item.more_button_link,
      bannerType: item.banner_type,
      deviceType: item.device_type,
      isActive: item.is_active,
      sortOrder: item.sort_order,
      startAt: item.start_at ? new Date(item.start_at).toISOString() : null,
      endAt: item.end_at ? new Date(item.end_at).toISOString() : null,
      createdAt: item.created_at ? new Date(item.created_at).toISOString() : null,
      updatedAt: item.updated_at ? new Date(item.updated_at).toISOString() : null,
    };
    
    return NextResponse.json(result);
  } catch (e: any) {
    console.error('Banner GET Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const bannerId = parseInt(id);
    
    const data = await req.json();

    // Check if banner exists
    const existingItems = await query('SELECT * FROM banners WHERE id = ?', [bannerId]) as any[];
    if (!existingItems || existingItems.length === 0) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    // Build update query
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    
    if (data.title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(data.title);
    }
    if (data.image_url !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(data.image_url);
    }
    if (data.href !== undefined) {
      updateFields.push('href = ?');
      updateValues.push(data.href);
    }
    if (data.main_title !== undefined) {
      updateFields.push('main_title = ?');
      updateValues.push(data.main_title);
    }
    if (data.sub_title !== undefined) {
      updateFields.push('sub_title = ?');
      updateValues.push(data.sub_title);
    }
    if (data.more_button_link !== undefined) {
      updateFields.push('more_button_link = ?');
      updateValues.push(data.more_button_link);
    }
    if (data.banner_type !== undefined) {
      updateFields.push('banner_type = ?');
      updateValues.push(data.banner_type);
    }
    if (data.device_type !== undefined) {
      updateFields.push('device_type = ?');
      updateValues.push(data.device_type);
    }
    if (data.is_active !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(Boolean(data.is_active));
    }
    if (data.sort_order !== undefined) {
      updateFields.push('sort_order = ?');
      updateValues.push(parseInt(data.sort_order));
    }
    if (data.start_at !== undefined) {
      updateFields.push('start_at = ?');
      updateValues.push(new Date(data.start_at));
    }
    if (data.end_at !== undefined) {
      updateFields.push('end_at = ?');
      updateValues.push(new Date(data.end_at));
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Add updated_at
    updateFields.push('updated_at = ?');
    updateValues.push(new Date());
    
    // Add id for WHERE clause
    updateValues.push(bannerId);

    await query(
      `UPDATE banners SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Get updated banner
    const updatedItems = await query('SELECT * FROM banners WHERE id = ?', [bannerId]) as any[];
    const updatedItem = updatedItems[0];
    
    const result = {
      id: updatedItem.id.toString(),
      href: updatedItem.href || '#',
      imgSrc: updatedItem.image_url,
      alt: updatedItem.title,
      title: updatedItem.title,
      mainTitle: updatedItem.main_title,
      subTitle: updatedItem.sub_title,
      moreButtonLink: updatedItem.more_button_link,
      bannerType: updatedItem.banner_type,
      deviceType: updatedItem.device_type,
      isActive: updatedItem.is_active,
      sortOrder: updatedItem.sort_order,
      startAt: updatedItem.start_at ? new Date(updatedItem.start_at).toISOString() : null,
      endAt: updatedItem.end_at ? new Date(updatedItem.end_at).toISOString() : null,
      createdAt: updatedItem.created_at ? new Date(updatedItem.created_at).toISOString() : null,
      updatedAt: updatedItem.updated_at ? new Date(updatedItem.updated_at).toISOString() : null,
    };
    
    return NextResponse.json(result);
  } catch (e: any) {
    console.error('Banner PUT Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const bannerId = parseInt(id);

    // Check if banner exists
    const existingItems = await query('SELECT * FROM banners WHERE id = ?', [bannerId]) as any[];
    if (!existingItems || existingItems.length === 0) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    // Delete banner
    await query('DELETE FROM banners WHERE id = ?', [bannerId]);
    
    return NextResponse.json({ 
      message: 'Banner deleted successfully',
      deletedId: id 
    });
  } catch (e: any) {
    console.error('Banner DELETE Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
