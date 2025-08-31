export type Banner = {
  id: string;
  href: string;
  imgSrc: string;
  alt: string;
};

export type StripBannerData = {
  id: string;
  isOpen: boolean;
  bgType: 'color' | 'image' | 'gradient';
  bgValue: string;
  message: string;
  href?: string;
  canClose: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export async function fetchBanners(): Promise<Banner[]> {
  try {
    const res = await fetch('/api/banners', { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function addBanner(data: { imgSrc: string; alt: string; href?: string }) {
  await fetch('/api/banners', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imgSrc: data.imgSrc, alt: data.alt, href: data.href }),
  });
}

export async function removeBanner(id: string) {
  await fetch(`/api/banners/${id}`, { method: 'DELETE' });
}

export async function updateBanner(id: string, data: { imgSrc?: string; alt?: string; href?: string }) {
  await fetch(`/api/banners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
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
