'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ko' | 'en' | 'ja' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateText: (text: string, targetLang?: Language) => Promise<string>;
}

const translations = {
  ko: {
    // Header
    'header.search.placeholder': '2,000여개의 커스텀 상품을 쉽게 찾아 보세요.',
    'header.cart': '주문조회',
    'header.menu': '메뉴 열기',
    'header.search': '검색',
    'nav.all': 'ALL',
    'nav.acrylic': '아크릴',
    'nav.paper': '지류',
    'nav.sticker': '스티커',
    'nav.clothing': '의류',
    'nav.frame': '액자',
    'nav.stationery': '문구/오피스',
    'nav.ipgoods': 'IP굿즈 상품개발',
    'nav.kit': '기업/웰컴 키트',
    'nav.group': '단체 판촉',
    'nav.reviews': '리뷰',
    'nav.support': '고객센터',
    'nav.notice': '공지사항',
    
    // Search
    'search.placeholder': '상품명을 입력하세요',
    'search.button': '검색',
    'search.loading': '검색 중...',
    'search.no_results': '검색 결과가 없습니다.',
    
    // Footer
    'footer.company': '회사정보',
    'footer.about': '회사소개',
    'footer.terms': '이용약관',
    'footer.privacy': '개인정보처리방침',
    'footer.support': '고객센터',
    'footer.notice': '공지사항',
    'footer.faq': '자주 묻는 질문',
    'footer.inquiry': '1:1 문의',
    'footer.guide': '이용 가이드',
    'footer.follow': 'Follow Us',
    'footer.language': '언어 설정',
    'footer.copyright': 'All rights reserved.',
    
    // Common
    'common.price_from': '부터',
    'common.won': '원',
    'common.loading': '로딩 중...',
    
    // Product
    'product.details': '상품 상세',
    'product.price': '가격',
    'product.size': '사이즈',
    'product.color': '색상',
    'product.quantity': '수량',
    'product.addToCart': '장바구니',
    'product.buyNow': '바로 구매',
    'product.description': '상품 설명',
    'product.reviews': '리뷰',
    'product.inquiry': '상품 문의',
    
    // Homepage
    'home.main_description': '온, 오프라인 어디에서나 쉽고 빠르게 만들 수 있어요!',
    'home.weekly_ranking_title': '창작자, 작가 참여 마켓 주간 랭킹보기',
    'home.more': '더보기',
    'home.benefits_title': '함께 성장해요. 고객별 혜택 확인하기',
    'home.creator_market': '창작마켓',
    'home.creator_market_desc': 'B2C 참여하기',
    'home.b2b_title': '관공서, 기업, 대량',
    'home.b2b_desc': 'B2B 문의하기',
    'home.personal_title': '개인',
    'home.personal_desc': 'B2C 문의하기',
    'home.creator_benefit': '나만의 창작물로 굿즈를 제작, 등록하여 판매를 할 수 있습니다.\n창작물 판매자에게는 소량제작 할인혜택 입점 수수료가 할인이 됩니다.',
    'home.b2b_benefit': '환경디자인,행사,축제,교육,대량 굿즈 제작이 가능합니다. 핀토는 자체 공장과 다양한 포트폴리오를 보유하고 있어 전문 상담가가 함께 합니다.',
    'home.personal_benefit': '구매별 등급이 나눠져 있으며 구매등급에 따라 월 할인 프로모션, 포인트 지급 등이 제공됩니다.',
    
    // Weekly Rankings
    'ranking.weekly_title': '주간 랭킹',
    'ranking.creator': '창작자',
    'ranking.author': '작가',
    'ranking.individual': '개인',
    'ranking.loading_failed': '랭킹을 불러오는데 실패했습니다',
    'ranking.retry': '다시 시도',
    'ranking.no_rankings': '이번 주 {type} 랭킹이 없습니다.',
    'ranking.from_price': '부터',
  },
  en: {
    // Header
    'header.search.placeholder': 'Easily find among 2,000+ custom products.',
    'header.cart': 'Order History',
    'header.menu': 'Open Menu',
    'header.search': 'Search',
    'nav.all': 'ALL',
    'nav.acrylic': 'Acrylic',
    'nav.paper': 'Paper Goods',
    'nav.sticker': 'Stickers',
    'nav.clothing': 'Clothing',
    'nav.frame': 'Frames',
    'nav.stationery': 'Stationery/Office',
    'nav.ipgoods': 'IP Goods Development',
    'nav.kit': 'Corporate/Welcome Kit',
    'nav.group': 'Group Promotion',
    'nav.reviews': 'Reviews',
    'nav.support': 'Customer Support',
    'nav.notice': 'Notice',
    
    // Search
    'search.placeholder': 'Enter product name',
    'search.button': 'Search',
    'search.loading': 'Searching...',
    'search.no_results': 'No search results found.',
    
    // Footer
    'footer.company': 'Company Info',
    'footer.about': 'About Us',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.support': 'Customer Support',
    'footer.notice': 'Notice',
    'footer.faq': 'FAQ',
    'footer.inquiry': '1:1 Inquiry',
    'footer.guide': 'User Guide',
    'footer.follow': 'Follow Us',
    'footer.language': 'Language',
    'footer.copyright': 'All rights reserved.',
    
    // Common
    'common.price_from': 'from',
    'common.won': '',
    'common.loading': 'Loading...',
    
    // Product
    'product.details': 'Product Details',
    'product.price': 'Price',
    'product.size': 'Size',
    'product.color': 'Color',
    'product.quantity': 'Quantity',
    'product.addToCart': 'Add to Cart',
    'product.buyNow': 'Buy Now',
    'product.description': 'Description',
    'product.reviews': 'Reviews',
    'product.inquiry': 'Product Inquiry',
    
    // Homepage
    'home.main_description': 'Create easily and quickly, online or offline!',
    'home.weekly_ranking_title': 'Creator, Author Market Weekly Ranking',
    'home.more': 'More',
    'home.benefits_title': 'Let\'s grow together. Check customer benefits',
    'home.creator_market': 'Creator Market',
    'home.creator_market_desc': 'Join B2C',
    'home.b2b_title': 'Government, Corporate, Bulk',
    'home.b2b_desc': 'B2B Inquiry',
    'home.personal_title': 'Individual',
    'home.personal_desc': 'B2C Inquiry',
    'home.creator_benefit': 'You can create, register and sell goods with your own creations.\nCreative sellers get small batch production discounts and reduced entry fees.',
    'home.b2b_benefit': 'Environmental design, events, festivals, education, and bulk goods production are possible. Pinto has its own factory and various portfolios, with professional consultants.',
    'home.personal_benefit': 'Purchase grades are divided according to purchase level, providing monthly discount promotions, points, etc.',
    
    // Weekly Rankings
    'ranking.weekly_title': 'Weekly Ranking',
    'ranking.creator': 'Creator',
    'ranking.author': 'Author',
    'ranking.individual': 'Individual',
    'ranking.loading_failed': 'Failed to load rankings',
    'ranking.retry': 'Retry',
    'ranking.no_rankings': 'No {type} rankings for this week.',
    'ranking.from_price': 'from',
  },
  ja: {
    // Header
    'header.search.placeholder': '2,000以上のカスタム商品を簡単に見つけよう。',
    'header.cart': '注文履歴',
    'header.menu': 'メニューを開く',
    'header.search': '検索',
    'nav.all': 'ALL',
    'nav.acrylic': 'アクリル',
    'nav.paper': '紙製品',
    'nav.sticker': 'ステッカー',
    'nav.clothing': '衣類',
    'nav.frame': 'フレーム',
    'nav.stationery': '文具/オフィス',
    'nav.ipgoods': 'IP商品開発',
    'nav.kit': '企業/ウェルカムキット',
    'nav.group': '団体プロモーション',
    'nav.reviews': 'レビュー',
    'nav.support': 'カスタマーサポート',
    'nav.notice': 'お知らせ',
    
    // Search
    'search.placeholder': '商品名を入力してください',
    'search.button': '検索',
    'search.loading': '検索中...',
    'search.no_results': '検索結果がありません。',
    
    // Footer
    'footer.company': '会社情報',
    'footer.about': '会社概要',
    'footer.terms': '利用規約',
    'footer.privacy': 'プライバシーポリシー',
    'footer.support': 'カスタマーサポート',
    'footer.notice': 'お知らせ',
    'footer.faq': 'よくある質問',
    'footer.inquiry': '1:1お問い合わせ',
    'footer.guide': '利用ガイド',
    'footer.follow': 'Follow Us',
    'footer.language': '言語設定',
    'footer.copyright': 'All rights reserved.',
    
    // Common
    'common.price_from': 'から',
    'common.won': '円',
    'common.loading': 'ローディング中...',
    
    // Product
    'product.details': '商品詳細',
    'product.price': '価格',
    'product.size': 'サイズ',
    'product.color': 'カラー',
    'product.quantity': '数量',
    'product.addToCart': 'カートに追加',
    'product.buyNow': '今すぐ購入',
    'product.description': '商品説明',
    'product.reviews': 'レビュー',
    'product.inquiry': '商品お問い合わせ',
    
    // Homepage
    'home.main_description': 'オンラインでもオフラインでも簡単に素早く作れます！',
    'home.weekly_ranking_title': 'クリエイター・作家参加マーケット週間ランキング',
    'home.more': '詳細',
    'home.benefits_title': '一緒に成長しましょう。お客様別特典確認',
    'home.creator_market': 'クリエイターマーケット',
    'home.creator_market_desc': 'B2C参加',
    'home.b2b_title': '官公庁・企業・大量',
    'home.b2b_desc': 'B2Bお問い合わせ',
    'home.personal_title': '個人',
    'home.personal_desc': 'B2Cお問い合わせ',
    'home.creator_benefit': '自分だけの創作物でグッズを制作・登録して販売できます。\nクリエイター販売者には少量製作割引特典入店手数料が割引されます。',
    'home.b2b_benefit': '環境デザイン、イベント、祭り、教育、大量グッズ製作が可能です。ピントは自社工場と多様なポートフォリオを保有し、専門相談員が一緒にサポートします。',
    'home.personal_benefit': '購入別グレードが分かれており、購入グレードに応じて月割引プロモーション、ポイント支給などが提供されます。',
    
    // Weekly Rankings
    'ranking.weekly_title': '週間ランキング',
    'ranking.creator': 'クリエイター',
    'ranking.author': '作家',
    'ranking.individual': '個人',
    'ranking.loading_failed': 'ランキングの読み込みに失敗しました',
    'ranking.retry': '再試行',
    'ranking.no_rankings': '今週の{type}ランキングはありません。',
    'ranking.from_price': 'から',
  },
  zh: {
    // Header
    'header.search.placeholder': '轻松找到2000+定制产品。',
    'header.cart': '订单历史',
    'header.menu': '打开菜单',
    'header.search': '搜索',
    'nav.all': '全部',
    'nav.acrylic': '丙烯酸',
    'nav.paper': '纸制品',
    'nav.sticker': '贴纸',
    'nav.clothing': '服装',
    'nav.frame': '相框',
    'nav.stationery': '文具/办公',
    'nav.ipgoods': 'IP商品开发',
    'nav.kit': '企业/欢迎套装',
    'nav.group': '团体促销',
    'nav.reviews': '评论',
    'nav.support': '客户支持',
    'nav.notice': '公告',
    
    // Search
    'search.placeholder': '请输入产品名称',
    'search.button': '搜索',
    'search.loading': '搜索中...',
    'search.no_results': '未找到搜索结果。',
    
    // Footer
    'footer.company': '公司信息',
    'footer.about': '关于我们',
    'footer.terms': '服务条款',
    'footer.privacy': '隐私政策',
    'footer.support': '客户支持',
    'footer.notice': '公告',
    'footer.faq': '常见问题',
    'footer.inquiry': '1:1咨询',
    'footer.guide': '使用指南',
    'footer.follow': 'Follow Us',
    'footer.language': '语言设置',
    'footer.copyright': 'All rights reserved.',
    
    // Common
    'common.price_from': '起',
    'common.won': '元',
    'common.loading': '加载中...',
    
    // Product
    'product.details': '产品详情',
    'product.price': '价格',
    'product.size': '尺寸',
    'product.color': '颜色',
    'product.quantity': '数量',
    'product.addToCart': '加入购物车',
    'product.buyNow': '立即购买',
    'product.description': '产品描述',
    'product.reviews': '评价',
    'product.inquiry': '产品咨询',
    
    // Homepage
    'home.main_description': '线上线下都能轻松快速制作！',
    'home.weekly_ranking_title': '创作者、作家参与市场周排行榜',
    'home.more': '更多',
    'home.benefits_title': '一起成长。查看客户福利',
    'home.creator_market': '创作市场',
    'home.creator_market_desc': 'B2C参与',
    'home.b2b_title': '政府机构、企业、大量',
    'home.b2b_desc': 'B2B咨询',
    'home.personal_title': '个人',
    'home.personal_desc': 'B2C咨询',
    'home.creator_benefit': '您可以用自己的创作物制作、注册并销售商品。\n创作销售者享有小批量制作折扣优惠，入驻手续费折扣。',
    'home.b2b_benefit': '可进行环境设计、活动、节庆、教育、大批量商品制作。Pinto拥有自己的工厂和丰富的作品集，专业顾问将与您合作。',
    'home.personal_benefit': '按购买等级划分，根据购买等级提供月度折扣促销、积分奖励等。',
    
    // Weekly Rankings
    'ranking.weekly_title': '周排行榜',
    'ranking.creator': '创作者',
    'ranking.author': '作家',
    'ranking.individual': '个人',
    'ranking.loading_failed': '排行榜加载失败',
    'ranking.retry': '重试',
    'ranking.no_rankings': '本周没有{type}排行榜。',
    'ranking.from_price': '起',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ko');

  useEffect(() => {
    // Check localStorage for saved language preference
    const savedLanguage = localStorage.getItem('locale') as Language;
    if (savedLanguage && ['ko', 'en', 'ja', 'zh'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('locale', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  // 간단한 자동 번역 함수 (실제로는 번역 API를 사용)
  const translateText = async (text: string, targetLang?: Language): Promise<string> => {
    const lang = targetLang || language;
    
    // 한국어면 원문 그대로 반환
    if (lang === 'ko') return text;
    
    // 간단한 키워드 기반 번역 (실제로는 Google Translate API 등 사용)
    const simpleTranslations: Record<string, Record<Language, string>> = {
      '상품': { en: 'Product', ja: '商品', zh: '产品', ko: '상품' },
      '가격': { en: 'Price', ja: '価格', zh: '价格', ko: '가격' },
      '수량': { en: 'Quantity', ja: '数量', zh: '数量', ko: '수량' },
      '사이즈': { en: 'Size', ja: 'サイズ', zh: '尺寸', ko: '사이즈' },
      '색상': { en: 'Color', ja: 'カラー', zh: '颜色', ko: '색상' },
      '장바구니': { en: 'Cart', ja: 'カート', zh: '购物车', ko: '장바구니' },
      '바로 구매': { en: 'Buy Now', ja: '今すぐ購入', zh: '立即购买', ko: '바로 구매' },
      '상품 상세': { en: 'Product Details', ja: '商品詳細', zh: '产品详情', ko: '상품 상세' },
      '리뷰': { en: 'Reviews', ja: 'レビュー', zh: '评价', ko: '리뷰' },
      '문의': { en: 'Inquiry', ja: 'お問い合わせ', zh: '咨询', ko: '문의' },
      '원': { en: '', ja: '円', zh: '元', ko: '원' },
      '부터': { en: 'from', ja: 'から', zh: '起', ko: '부터' },
    };

    // 간단한 키워드 치환
    let translated = text;
    Object.entries(simpleTranslations).forEach(([korean, translations]) => {
      if (translated.includes(korean)) {
        translated = translated.replace(new RegExp(korean, 'g'), translations[lang] || korean);
      }
    });

    return translated;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, translateText }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}