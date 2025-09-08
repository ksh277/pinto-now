'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ko' | 'en' | 'ja' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
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

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
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