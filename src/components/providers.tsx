
'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from '@/contexts/i18n-context';
import { LanguageProvider } from '@/contexts/language-context';
import { CartProvider } from '@/contexts/cart-context';
import { ProductProvider } from '@/contexts/product-context';
import { AuthProvider } from '@/contexts/AuthContext';
import { CommunityProvider } from '@/contexts/community-context';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <LanguageProvider>
        <ProductProvider>
          <CommunityProvider>
            <AuthProvider>
              <CartProvider>{children}</CartProvider>
            </AuthProvider>
          </CommunityProvider>
        </ProductProvider>
      </LanguageProvider>
    </I18nProvider>
  );
}
