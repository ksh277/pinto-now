

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
  { href: '/akril-goods', label: '아크릴키링', id: 'keyring' },
  { href: '/akril-goods', label: '코롯토', id: 'korotto' },
  { href: '/akril-goods', label: '스마트톡', id: 'smarttok' },
  { href: '/life-size-standee', label: '스탠드/디오라마', id: 'stand' },
  { href: '/frame-prop-name-tag', label: '포카홀더/포토액자', id: 'holder' },
  { href: '/akril-goods', label: '아크릴쉐이커', id: 'shaker' },
  { href: '/akril-goods', label: '아크릴카라비너', id: 'carabiner' },
  { href: '/akril-goods', label: '거울', id: 'mirror' },
  { href: '/pin-button', label: '자석/뱃지/코스터', id: 'magnet' },
  { href: '/paper-goods', label: '문구류(집게, 볼펜 등)', id: 'stationery' },
  { href: '/akril-goods', label: '아크릴 재단', id: 'cutting' },
];

const woodSubNav: SubCategory[] = [
  { href: '/akril-goods', label: '우드키링', id: 'keyring' },
  { href: '/pin-button', label: '우드마그넷', id: 'magnet' },
  { href: '/life-size-standee', label: '우드스탠드', id: 'stand' },
];

const packagingSubNav: SubCategory[] = [
  { href: '/sticker-deco', label: '스와치', id: 'swatch' },
  { href: '/packing-supplies', label: '부자재', id: 'supplies' },
  { href: '/packing-supplies', label: '포장재', id: 'packaging' },
];

// ALL subcategories for mega menu
const allSubNav: SubCategory[] = [
  ...acrylicSubNav,
  ...woodSubNav,
  ...packagingSubNav,
  // 추가적으로 다른 카테고리 subnav도 여기에 합칠 수 있음
];

export const mainNavItems: MainCategory[] = [
  {
    id: 'all',
    href: '/all',
    label: 'ALL',
    subnav: allSubNav
  },
  // { 
  //   id: 'acrylic',
  //   href: '/akril-goods', 
  //   label: '아크릴',
  //   subnav: acrylicSubNav
  // },
  { 
    id: 'wood', 
    href: '/akril-goods', 
    label: '우드',
    subnav: woodSubNav
  },
  { id: 'lanyard', href: '/akril-goods', label: '랜야드' },
  { id: 'clothing', href: '/tshirt', label: '의류' },
  { 
    id: 'packaging', 
    href: '/packing-supplies', 
    label: '포장/부자재',
    subnav: packagingSubNav
  },
  { id: 'stationery', href: '/paper-goods', label: '문구/오피스' },
  { id: 'ipGoods', href: '/ip-goods-dev', label: 'IP굿즈 상품개발' },
  { id: 'welcomeKit', href: '/custom-product-view', label: '기업/웰컴 키트' },
  { id: 'promotional', href: '/promo-product-view', label: '단체 판촉' },
  { id: 'fanGoods', href: '/fan-goods', label: '팬굿즈' },
  { id: 'reviews', href: '/reviews', label: '리뷰' },
  { id: 'guide', href: '/guide', label: '주문가이드' },
  { id: 'brandRequest', href: '/brand-request', label: '브랜드의뢰' },
];

export const categoriesMap: Record<string, { name: string; subCategories: Omit<SubCategory, 'href'>[] }> = {
  acrylic: { name: '아크릴굿즈', subCategories: acrylicSubNav.map(s => ({label: s.label, id: s.id})) },
  wood: { name: '우드굿즈', subCategories: woodSubNav.map(s => ({label: s.label, id: s.id})) },
  packaging: { name: '포장/부자재', subCategories: packagingSubNav.map(s => ({label: s.label, id: s.id})) },
  lanyard: { name: '랜야드', subCategories: [] },
};
