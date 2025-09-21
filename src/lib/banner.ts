import { Banner, BannerType, DeviceType, BANNER_LIMITS, StripBannerData } from './banner-types';

// Re-export types for compatibility
export { BannerType, BANNER_LIMITS };
export type { Banner, DeviceType, StripBannerData };

export async function fetchBanners(options?: {
  includeInactive?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
  limit?: number;
  bannerType?: BannerType;
  deviceType?: DeviceType;
}): Promise<Banner[]> {
  try {
    const params = new URLSearchParams();
    if (options?.includeInactive) params.append('include_inactive', 'true');
    if (options?.sort) params.append('sort', options.sort);
    if (options?.order) params.append('order', options.order);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.bannerType) params.append('banner_type', options.bannerType);
    if (options?.deviceType) params.append('device_type', options.deviceType);

    // Use absolute URL for server-side rendering, relative URL for client-side
    const baseUrl = typeof window === 'undefined' 
      ? process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'
      : '';
    const url = `${baseUrl}/api/banners${params.toString() ? '?' + params.toString() : ''}`;
    console.log('Fetching banners from:', url);
    const res = await fetch(url, { cache: 'no-store' });
    
    console.log('Banner fetch response status:', res.status);
    
    if (!res.ok) {
      console.error('Failed to fetch banners:', res.status, res.statusText);
      return [];
    }
    
    const data = await res.json();
    console.log('Banner fetch response data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
}


export async function fetchBannersByType(bannerType: BannerType, deviceType?: DeviceType): Promise<Banner[]> {
  // Always use API call for client-side code
  return fetchBanners({ 
    bannerType, 
    deviceType,
    sort: 'sort_order',
    order: 'asc' 
  });
}

export async function checkBannerLimit(bannerType: BannerType): Promise<{ canAdd: boolean; current: number; limit: number }> {
  const current = await fetchBannersByType(bannerType);
  const limit = BANNER_LIMITS[bannerType];
  
  return {
    canAdd: current.length < limit,
    current: current.length,
    limit
  };
}

export async function addBanner(data: { 
  imgSrc: string; 
  alt: string; 
  href?: string;
  mainTitle?: string;
  subTitle?: string;
  moreButtonLink?: string;
  bannerType?: BannerType;
  deviceType?: DeviceType;
  isActive?: boolean;
  sortOrder?: number;
  startAt?: Date;
  endAt?: Date;
}): Promise<Banner | null> {
  try {
    // 배너 타입 제한 확인
    if (data.bannerType) {
      const limitCheck = await checkBannerLimit(data.bannerType);
      if (!limitCheck.canAdd) {
        throw new Error(`${data.bannerType} 타입의 배너는 최대 ${limitCheck.limit}개까지만 등록 가능합니다. (현재: ${limitCheck.current}개)`);
      }
    }

    const response = await fetch('/api/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: data.alt,
        image_url: data.imgSrc,
        href: data.href,
        main_title: data.mainTitle,
        sub_title: data.subTitle,
        more_button_link: data.moreButtonLink,
        banner_type: data.bannerType || BannerType.IMAGE_BANNER,
        device_type: data.deviceType || 'all',
        is_active: data.isActive,
        sort_order: data.sortOrder,
        start_at: data.startAt?.toISOString(),
        end_at: data.endAt?.toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create banner');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding banner:', error);
    throw error;
  }
}

export async function removeBanner(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/banners/${id}`, { 
      method: 'DELETE' 
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete banner');
    }

    return true;
  } catch (error) {
    console.error('Error removing banner:', error);
    throw error;
  }
}

export async function updateBanner(id: string, data: { 
  imgSrc?: string; 
  alt?: string; 
  href?: string;
  mainTitle?: string;
  subTitle?: string;
  moreButtonLink?: string;
  bannerType?: BannerType;
  deviceType?: DeviceType;
  isActive?: boolean;
  sortOrder?: number;
  startAt?: Date;
  endAt?: Date;
}): Promise<Banner | null> {
  try {
    const updateData: any = {};
    
    if (data.alt !== undefined) updateData.title = data.alt;
    if (data.imgSrc !== undefined) updateData.image_url = data.imgSrc;
    if (data.href !== undefined) updateData.href = data.href;
    if (data.mainTitle !== undefined) updateData.main_title = data.mainTitle;
    if (data.subTitle !== undefined) updateData.sub_title = data.subTitle;
    if (data.moreButtonLink !== undefined) updateData.more_button_link = data.moreButtonLink;
    if (data.bannerType !== undefined) updateData.banner_type = data.bannerType;
    if (data.deviceType !== undefined) updateData.device_type = data.deviceType;
    if (data.isActive !== undefined) updateData.is_active = data.isActive;
    if (data.sortOrder !== undefined) updateData.sort_order = data.sortOrder;
    if (data.startAt !== undefined) updateData.start_at = data.startAt.toISOString();
    if (data.endAt !== undefined) updateData.end_at = data.endAt.toISOString();

    const response = await fetch(`/api/banners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update banner');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
}

const HIDE_PREFIX = 'banner:';
const HIDE_SUFFIX = ':hideUntil';
const SESSION_SUFFIX = ':closed';

function hideKey(id: string): string {
  return `${HIDE_PREFIX}${id}${HIDE_SUFFIX}`;
}

function sessionKey(id: string): string {
  return `${HIDE_PREFIX}${id}${SESSION_SUFFIX}`;
}

export function getHideUntil(id: string): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(hideKey(id));
    if (!stored) return null;
    const ts = Date.parse(stored);
    if (isNaN(ts) || ts <= Date.now()) {
      window.localStorage.removeItem(hideKey(id));
      return null;
    }
    return ts;
  } catch {
    return null;
  }
}

export function setHideUntil(id: string, until: Date): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(hideKey(id), until.toISOString());
  } catch {
    // ignore
  }
}

export function setSessionClosed(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(sessionKey(id), '1');
  } catch {
    // ignore
  }
}

function isSessionClosed(id: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(sessionKey(id)) === '1';
  } catch {
    return false;
  }
}

export function isHidden(id: string): boolean {
  const ts = getHideUntil(id);
  return (ts !== null && ts > Date.now()) || isSessionClosed(id);
}

export { hideKey as getHideKey };
