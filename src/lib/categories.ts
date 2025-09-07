

import type { ProductSubcategory } from './types';

export interface SubCategory {
  href: string;
  label: string;
  id: ProductSubcategory;
}

export interface MainCategory {
  id: string;
  href: string;
  label: string;
  subnav?: SubCategory[];
}

const acrylicSubNav: SubCategory[] = [
  { href: '/acrylic', label: '아크릴키링', id: 'keyring' },
  { href: '/acrylic', label: '코롯토', id: 'korotto' },
  { href: '/acrylic', label: '스마트톡', id: 'smarttok' },
  { href: '/life-size-standee', label: '스탠드/디오라마', id: 'stand' },
  { href: '/frame-prop-name-tag', label: '포카홀더/포토액자', id: 'holder' },
  { href: '/acrylic', label: '아크릴쉐이커', id: 'shaker' },
  { href: '/acrylic', label: '아크릴카라비너', id: 'carabiner' },
  { href: '/acrylic', label: '거울', id: 'mirror' },
  { href: '/pin-button', label: '자석/뱃지/코스터', id: 'magnet' },
  { href: '/paper-goods', label: '문구류(집게, 볼펜 등)', id: 'stationery' },
  { href: '/acrylic', label: '아크릴 재단', id: 'cutting' },
];

const woodSubNav: SubCategory[] = [
  { href: '/wood', label: '우드키링', id: 'keyring' },
  { href: '/pin-button', label: '우드마그넷', id: 'magnet' },
  { href: '/life-size-standee', label: '우드스탠드', id: 'stand' },
];

const packagingSubNav: SubCategory[] = [
  { href: '/sticker-deco', label: '스와치', id: 'swatch' },
  { href: '/packing-supplies', label: '부자재', id: 'supplies' },
  { href: '/packing-supplies', label: '포장재', id: 'packaging' },
];

const paperSubNav: SubCategory[] = [
  { href: '/paper-goods', label: '포스터', id: 'poster' },
  { href: '/paper-goods', label: '스티커', id: 'sticker' },
  { href: '/paper-goods', label: '엽서', id: 'postcard' },
  { href: '/paper-goods', label: '문구류', id: 'stationery' },
  { href: '/paper-goods', label: '명함', id: 'business-card' },
  { href: '/paper-goods', label: '리플릿', id: 'leaflet' },
];

// ALL subcategories for mega menu
const allSubNav: SubCategory[] = [
  ...acrylicSubNav,
  ...woodSubNav,
  ...packagingSubNav,
  ...paperSubNav,
  // 추가적으로 다른 카테고리 subnav도 여기에 합칠 수 있음
];

export const mainNavItems: MainCategory[] = [
  { 
    id: 'all',
    href: '/', 
    label: 'ALL',
    subnav: allSubNav
  },
  { id: 'acrylic', href: '/acrylic', label: '아크릴' },
  { id: 'lanyard', href: '/lanyard', label: '랜야드' },
  { id: 'paper-goods', href: '/paper-goods', label: '지류' },
  { id: 'sticker', href: '/sticker', label: '스티커' },
  { id: 'clothing', href: '/clothing', label: '의류' },
  { id: 'frame', href: '/frame', label: '액자' },
  { id: 'office', href: '/office', label: '문구/오피스' },
  { id: 'ipGoods', href: '/ip-goods-dev', label: 'IP굿즈 상품개발' },
  { id: 'welcomeKit', href: '/custom-product-view', label: '기업/웰컴 키트' },
  { id: 'promotional', href: '/promo-product-view', label: '단체 판촉' },
];

export const categoriesMap: Record<string, { name: string; subCategories: Omit<SubCategory, 'href'>[] }> = {
  acrylic: { name: '아크릴굿즈', subCategories: acrylicSubNav.map(s => ({label: s.label, id: s.id})) },
  lanyard: { name: '랜야드', subCategories: [] },
  'paper-goods': { name: '지류 굿즈', subCategories: paperSubNav.map(s => ({label: s.label, id: s.id})) },
  sticker: { name: '스티커', subCategories: [] },
  clothing: { name: '의류', subCategories: [] },
  frame: { name: '액자', subCategories: [] },
  office: { name: '문구/오피스', subCategories: [] },
};
