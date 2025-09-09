
'use client';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { useState } from 'react';

export function Footer() {
  const { language, setLanguage, t } = useLanguage();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const handleLanguageChange = (lang: 'ko' | 'en' | 'ja' | 'zh') => {
    setLanguage(lang);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <footer className="border-t bg-secondary/50">
      <div className="container mx-auto px-4 py-8 text-sm text-muted-foreground">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-bold text-lg text-foreground">Pinto</h3>
            <div className="space-y-1">
                <p><strong>대표:</strong> 김핀토</p>
                <p><strong>사업자등록번호:</strong> 123-45-67890</p>
                <p><strong>주소:</strong> 서울특별시 중구 핀토로 123, 4층</p>
                <p><strong>전화:</strong> 02-1234-5678</p>
                <p><strong>이메일:</strong> contact@pinto.com</p>
            </div>
          </div>
          <div>
            <h3 className="mb-4 font-bold text-foreground">{t('footer.support')}</h3>
            <ul className="space-y-2">
              <li><Link href="/support/notice" className="hover:underline">{t('footer.notice')}</Link></li>
              <li><Link href="/support/faq" className="hover:underline">{t('footer.faq')}</Link></li>
              <li><Link href="/mypage/inquiries" className="hover:underline">{t('footer.inquiry')}</Link></li>
              <li><Link href="/support/guide" className="hover:underline">{t('footer.guide')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-bold text-foreground">{t('footer.company')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">{t('footer.about')}</a></li>
              <li><a href="#" className="hover:underline">{t('footer.terms')}</a></li>
              <li><a href="#" className="hover:underline">{t('footer.privacy')}</a></li>
            </ul>
          </div>
          <div>
      <h3 className="font-bold text-foreground mb-4">{t('footer.follow')}</h3>
      <ul className="space-y-2">
        <li><a href="#" className="hover:underline">Instagram</a></li>
        <li><a href="#" className="hover:underline">Facebook</a></li>
        <li><a href="#" className="hover:underline">Twitter</a></li>
      </ul>
      <div className="mt-6">
        <h4 className="font-semibold mb-2">{t('footer.language')}</h4>
        {/* 언어 선택 드롭다운 */}
        <div className="relative">
          <button 
            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:border-gray-400 transition-colors bg-background"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
            </svg>
            <span>
              {language === 'ko' && '한국어'}
              {language === 'en' && 'English'}  
              {language === 'ja' && '日本語'}
              {language === 'zh' && '中文'}
            </span>
            <svg className={`w-4 h-4 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {isLanguageDropdownOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-40 bg-background border border-gray-300 rounded-md shadow-lg z-50">
              <div className="py-1">
                <button
                  onClick={() => handleLanguageChange('ko')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${language === 'ko' ? 'text-primary bg-gray-100' : ''}`}
                >
                  🇰🇷 한국어
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${language === 'en' ? 'text-primary bg-gray-100' : ''}`}
                >
                  🇺🇸 English
                </button>
                <button
                  onClick={() => handleLanguageChange('ja')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${language === 'ja' ? 'text-primary bg-gray-100' : ''}`}
                >
                  🇯🇵 日本語
                </button>
                <button
                  onClick={() => handleLanguageChange('zh')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${language === 'zh' ? 'text-primary bg-gray-100' : ''}`}
                >
                  🇨🇳 中文
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Pinto. {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
