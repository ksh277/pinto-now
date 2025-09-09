// Shared types for banner functionality
export enum BannerType {
  TOP_BANNER = 'TOP_BANNER',
  STRIP_BANNER = 'STRIP_BANNER', 
  HOME_SLIDER_PC = 'HOME_SLIDER_PC',
  HOME_SLIDER_MOBILE = 'HOME_SLIDER_MOBILE',
  IMAGE_BANNER = 'IMAGE_BANNER',
  PLATFORM_BANNER = 'PLATFORM_BANNER'
}

export type DeviceType = 'pc' | 'mobile' | 'all';

export type Banner = {
  id: string;
  href: string;
  imgSrc: string;
  alt: string;
  title?: string;
  mainTitle?: string;  // 대제목
  subTitle?: string;   // 소제목
  moreButtonLink?: string; // More 버튼 링크
  bannerType?: BannerType;
  deviceType?: DeviceType;
  isActive?: boolean;
  sortOrder?: number;
  startAt?: string | null;
  endAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export const BANNER_LIMITS = {
  [BannerType.TOP_BANNER]: 8,
  [BannerType.STRIP_BANNER]: 1,
  [BannerType.HOME_SLIDER_PC]: 2,
  [BannerType.HOME_SLIDER_MOBILE]: 1,
  [BannerType.IMAGE_BANNER]: 12,
  [BannerType.PLATFORM_BANNER]: 1
} as const;

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