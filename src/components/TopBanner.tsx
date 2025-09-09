// TopBanner.tsx
// This component renders the top banner section of the page.
// It fetches banner data from the API and displays it as a carousel.

'use client';

import { useEffect, useState } from 'react';
import { fetchBannersByType, BannerType } from '@/lib/banner';
import type { Banner as HeroBanner } from '@/lib/banner-types';

export function TopBanner() {
  // State to store the fetched banners
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  // State to track the current banner index for the carousel
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch banners of type TOP_BANNER from the API
    async function loadBanners() {
      try {
        console.log('Loading TOP_BANNER data...');
        const data = await fetchBannersByType(BannerType.TOP_BANNER);
        console.log('Loaded banners:', data);
        setBanners(data);
      } catch (error) {
        console.error('Failed to load top banners:', error);
      }
    }
    
    loadBanners();
  }, []);

  // Automatically slide banners every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // If no banners are available, return null
  if (banners.length === 0) {
    return null;
  }

  // Get the current banner to display
  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full h-[970px] overflow-hidden">
      {/* Banner link wrapper */}
      <a 
        href={currentBanner.href || '#'} 
        className="block relative w-full h-full"
      >
        {/* Banner image */}
        <img
          src={currentBanner.imgSrc} // Image source URL
          alt={currentBanner.alt || currentBanner.title || 'Banner'} // Alt text for accessibility
          style={{ 
            width: '100%', // Set width to 80% of the container
            height: '80%', // Set height to 80% of the container
            objectFit: 'cover', // Cover the container without distortion
            display: 'block', // Ensure the image is displayed as a block element
            margin: 'auto' // Center the image within the container
          }}
          loading="eager" // Load the image eagerly
          onLoad={() => console.log(`✅ Banner loaded: ${currentBanner.imgSrc}`)}
          onError={(e) => {
            console.error(`❌ Failed to load: ${currentBanner.imgSrc}`);
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,...'; // Fallback image
          }}
        />
        
        {/* Text overlay positioned at the center */}
        <div className="absolute inset-0 flex items-center justify-center z-10" style={{ top: '-160px' }}>
          <div className="text-center" style={{ color: '#505050' }}>
            {/* Main title with adjusted size */}
            {currentBanner.mainTitle && (
              <h1 className="text-[35px] font-bold mb-4 drop-shadow-2xl">
                {currentBanner.mainTitle}
              </h1>
            )}
            {/* Subtitle with further adjusted position when only the subtitle is present */}
            {currentBanner.subTitle && !currentBanner.mainTitle && (
              <p
                className="text-lg md:text-2xl mb-8 drop-shadow-lg max-w-2xl md-auto"
                style={{ marginTop: '165px' }} // Increased margin to push subtitle further down
              >
                {currentBanner.subTitle}
              </p>
            )}
            {/* Subtitle with default position */}
            {currentBanner.subTitle && currentBanner.mainTitle && (
              <p
                className="text-lg md:text-2xl mb-8 drop-shadow-lg max-w-2xl md-auto"
                style={{ marginTop: currentBanner.mainTitle ? '0' : '50px' }} // Adjusted margin only when main title is absent
              >
                {currentBanner.subTitle}
              </p>
            )}
            
            {/* MORE button */}
            {currentBanner.moreButtonLink && (
              <a
                href={currentBanner.moreButtonLink}
                className="inline-block bg-[#F1F2F4] px-16 py-1.5 rounded-full font-semibold text-lg hover:bg-gray-300 transition-colors shadow-sm"
                style={{ color: '#505050', width: 'auto', textAlign: 'center' }}
                onClick={(e) => e.stopPropagation()} // Prevent conflict with banner link
              >
                MORE
              </a>
            )}
          </div>
        </div>
      </a>
      
      {/* Indicators for multiple banners */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TopBanner;

