import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { put } from '@vercel/blob';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get('include_inactive') === 'true';
    const sortBy = searchParams.get('sort') || 'created_at';
    const sortOrder = searchParams.get('order') === 'asc' ? 'asc' : 'desc';
    const limit = parseInt(searchParams.get('limit') || '50');
    const bannerType = searchParams.get('banner_type');
    const deviceType = searchParams.get('device_type');

    // Build SQL query
    let sql = 'SELECT * FROM banners';
    let params: any[] = [];
    let conditions: string[] = [];
    
    if (!includeInactive) {
      conditions.push('is_active = ?');
      params.push(true);
    }
    
    if (bannerType) {
      conditions.push('banner_type = ?');
      params.push(bannerType);
    }
    
    if (deviceType) {
      conditions.push('(device_type = ? OR device_type = ?)');
      params.push(deviceType, 'all');
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    if (sortBy === 'sort_order') {
      sql += ` ORDER BY sort_order ${sortOrder.toUpperCase()}, created_at DESC`;
    } else {
      sql += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    }
    
    sql += ` LIMIT ${Math.min(limit, 100)}`;
    
    const items = await query(sql, params);

    const transformedItems = (items as any[]).map((item: any) => ({
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
    }));

    return NextResponse.json(transformedItems, { status: 200 });
  } catch (e: any) {
    console.error('Banner API Error:', e);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    console.log('Content-Type:', contentType);
    
    let data: any;
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await req.formData();
      data = {};
      
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`File field ${key}:`, value.name, value.size, value.type);
          
          // Upload to Vercel Blob
          const timestamp = Date.now();
          const filename = `banners/${timestamp}-${value.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          
          const blob = await put(filename, value, {
            access: 'public',
          });
          
          console.log(`File uploaded to Vercel Blob: ${blob.url}`);
          
          if (key === 'image' || key === 'file') {
            data['image_url'] = blob.url;
          } else {
            data[key] = blob.url;
          }
        } else {
          data[key] = value;
        }
      }
    } else {
      // Handle JSON
      data = await req.json();
    }
    
    console.log('Received data:', JSON.stringify(data, null, 2));

    if (!data.title || !data.image_url) {
      return NextResponse.json(
        { error: 'Title and image_url are required' }, 
        { status: 400 }
      );
    }

    const bannerType = data.banner_type || 'IMAGE_BANNER';
    const deviceType = data.device_type || 'all';
    const sortOrder = data.sort_order !== undefined ? parseInt(data.sort_order) : 0;
    const isActive = data.is_active !== undefined ? Boolean(data.is_active) : true;

    console.log('About to insert with params:', [
      data.title.trim(),
      data.image_url.trim(),
      data.href?.trim() || '#',
      data.main_title?.trim() || '',
      data.sub_title?.trim() || '',
      data.more_button_link?.trim() || '',
      bannerType,
      deviceType,
      isActive ? 1 : 0,
      sortOrder,
      data.start_at || new Date(),
      data.end_at || new Date('2025-12-31')
    ]);

    const insertResult = await query(
      `INSERT INTO banners (
        title, image_url, href, main_title, sub_title, more_button_link, 
        banner_type, device_type, is_active, sort_order, start_at, end_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title.trim(),
        data.image_url.trim(),
        data.href?.trim() || '#',
        data.main_title?.trim() || '',
        data.sub_title?.trim() || '',
        data.more_button_link?.trim() || '',
        bannerType,
        deviceType,
        isActive ? 1 : 0,
        sortOrder,
        data.start_at || new Date(),
        data.end_at || new Date('2025-12-31')
      ]
    ) as any;

    const result = {
      id: insertResult.insertId.toString(),
      title: data.title.trim(),
      image_url: data.image_url.trim(),
      href: data.href?.trim() || '',
      main_title: data.main_title?.trim() || '',
      sub_title: data.sub_title?.trim() || '',
      more_button_link: data.more_button_link?.trim() || '',
      banner_type: bannerType,
      device_type: deviceType,
      is_active: isActive,
      sort_order: sortOrder,
    };

    return NextResponse.json(result, { status: 201 });
  } catch (e: any) {
    console.error('Banner POST Error:', e);
    return NextResponse.json({ 
      error: 'Failed to create banner', 
      details: e.message 
    }, { status: 500 });
  }
}