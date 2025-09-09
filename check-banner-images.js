// Check all banner image URLs to see storage distribution
require('dotenv').config({ path: '.env.local' });

async function checkBannerImages() {
  try {
    console.log('Checking all banner image URLs...\n');
    
    // Get all banners from API
    const response = await fetch('http://localhost:3030/api/banners?include_inactive=true&limit=100');
    
    if (response.ok) {
      const banners = await response.json();
      
      console.log(`Total banners found: ${banners.length}\n`);
      
      let gcsCount = 0;
      let placeholderCount = 0;
      let otherCount = 0;
      
      banners.forEach((banner, index) => {
        const imageUrl = banner.imgSrc || '';
        let type = '';
        
        if (imageUrl.includes('storage.googleapis.com')) {
          type = '🟢 GCS';
          gcsCount++;
        } else if (imageUrl.includes('via.placeholder.com')) {
          type = '🟡 Placeholder';
          placeholderCount++;
        } else {
          type = '🔴 Other';
          otherCount++;
        }
        
        console.log(`${index + 1}. [${banner.bannerType}] ${banner.title || banner.alt}`);
        console.log(`   ${type}: ${imageUrl}`);
        console.log(`   ID: ${banner.id}, Active: ${banner.isActive}`);
        console.log('');
      });
      
      console.log('--- Summary ---');
      console.log(`🟢 Google Cloud Storage images: ${gcsCount}`);
      console.log(`🟡 Placeholder images: ${placeholderCount}`);
      console.log(`🔴 Other images: ${otherCount}`);
      console.log(`Total: ${banners.length}`);
      
      // Check TOP_BANNER specifically
      const topBanners = banners.filter(b => b.bannerType === 'TOP_BANNER');
      console.log(`\nTOP_BANNER count: ${topBanners.length}`);
      
      let topGcs = 0, topPlaceholder = 0, topOther = 0;
      topBanners.forEach(banner => {
        const imageUrl = banner.imgSrc || '';
        if (imageUrl.includes('storage.googleapis.com')) {
          topGcs++;
        } else if (imageUrl.includes('via.placeholder.com')) {
          topPlaceholder++;
        } else {
          topOther++;
        }
      });
      
      console.log(`TOP_BANNER - GCS: ${topGcs}, Placeholder: ${topPlaceholder}, Other: ${topOther}`);
      
    } else {
      console.log('❌ Failed to fetch banners');
      console.log(`Status: ${response.status}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking banner images:', error.message);
  }
}

checkBannerImages();