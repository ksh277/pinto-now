// Server-only banner functions that use direct database access
import { query } from '@/lib/mysql';
import { Banner, BannerType, DeviceType } from './banner-types';

// Server-side function to fetch banners directly from database
export async function fetchBannersFromDB(options?: {
  includeInactive?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
  limit?: number;
  bannerType?: BannerType;
  deviceType?: DeviceType;
}): Promise<Banner[]> {
  try {
    let sql = 'SELECT * FROM banners';
    let params: any[] = [];
    let conditions: string[] = [];
    
    if (!options?.includeInactive) {
      conditions.push('is_active = ?');
      params.push(true);
    }
    
    if (options?.bannerType) {
      conditions.push('banner_type = ?');
      params.push(options.bannerType);
    }
    
    if (options?.deviceType) {
      conditions.push('(device_type = ? OR device_type = ?)');
      params.push(options.deviceType, 'all');
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    const sortBy = options?.sort || 'created_at';
    const sortOrder = options?.order === 'asc' ? 'asc' : 'desc';
    
    if (sortBy === 'sort_order') {
      sql += ` ORDER BY sort_order ${sortOrder.toUpperCase()}, created_at DESC`;
    } else {
      sql += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    }
    
    const limit = Math.min(options?.limit || 50, 100);
    sql += ` LIMIT ${limit}`;
    
    console.log('Executing banner query:', sql, params);
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

    console.log(`Found ${transformedItems.length} banners from DB`);
    return transformedItems;
  } catch (error) {
    console.error('Error fetching banners from DB:', error);
    return [];
  }
}