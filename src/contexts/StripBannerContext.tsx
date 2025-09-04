"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface StripBannerConfig {
  message: string;
  bgColor: string;
}

export const defaultConfig: StripBannerConfig = {
  message: '',
  bgColor: '#ffcc00',
};

const StripBannerContext = createContext<{
  config: StripBannerConfig;
  setConfig: (c: StripBannerConfig) => void;
}>({ config: defaultConfig, setConfig: () => {} });

export function useStripBanner() {
  return useContext(StripBannerContext);
}

export function StripBannerProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<StripBannerConfig>(defaultConfig);
  return (
    <StripBannerContext.Provider value={{ config, setConfig }}>
      {children}
    </StripBannerContext.Provider>
  );
}
