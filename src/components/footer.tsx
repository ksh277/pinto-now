
'use client';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';

export function Footer() {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (lang: 'ko' | 'en' | 'ja' | 'zh') => {
    setLanguage(lang);
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
        <div className="flex gap-2">
          <button 
            type="button" 
            className={`px-3 py-1 rounded border hover:bg-primary/10 ${language === 'ko' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
            onClick={() => handleLanguageChange('ko')}
          >
            한국어
          </button>
          <button 
            type="button" 
            className={`px-3 py-1 rounded border hover:bg-primary/10 ${language === 'en' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
            onClick={() => handleLanguageChange('en')}
          >
            English
          </button>
          <button 
            type="button" 
            className={`px-3 py-1 rounded border hover:bg-primary/10 ${language === 'ja' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
            onClick={() => handleLanguageChange('ja')}
          >
            日本語
          </button>
          <button 
            type="button" 
            className={`px-3 py-1 rounded border hover:bg-primary/10 ${language === 'zh' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
            onClick={() => handleLanguageChange('zh')}
          >
            中文
          </button>
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
