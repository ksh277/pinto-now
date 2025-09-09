// Check PlanetScale banners table structure
require('dotenv').config({ path: '.env.local' });

async function checkBannerTable() {
  try {
    console.log('Checking PlanetScale banners table structure...\n');
    
    // Check table structure via API
    const response = await fetch('http://localhost:3030/api/banners?limit=1&include_inactive=true');
    
    if (response.ok) {
      const banners = await response.json();
      
      if (banners.length > 0) {
        console.log('✅ Banners table accessible via API');
        console.log('Sample banner structure:');
        console.log(JSON.stringify(banners[0], null, 2));
        
        // Check required fields
        const requiredFields = [
          'id', 'title', 'imgSrc', 'href', 'bannerType', 
          'deviceType', 'isActive', 'sortOrder', 'startAt', 'endAt'
        ];
        
        const banner = banners[0];
        console.log('\n--- Field Check ---');
        requiredFields.forEach(field => {
          const exists = banner.hasOwnProperty(field) && banner[field] !== undefined;
          console.log(`${field}: ${exists ? '✅' : '❌'} ${exists ? banner[field] : 'MISSING'}`);
        });
        
      } else {
        console.log('⚠️  No banners found in database');
      }
      
      // Check total count
      const allResponse = await fetch('http://localhost:3030/api/banners?include_inactive=true&limit=100');
      const allBanners = await allResponse.json();
      console.log(`\nTotal banners in database: ${allBanners.length}`);
      
      // Check TOP_BANNER specifically
      const topResponse = await fetch('http://localhost:3030/api/banners?banner_type=TOP_BANNER&include_inactive=true');
      const topBanners = await topResponse.json();
      console.log(`TOP_BANNER banners: ${topBanners.length}`);
      
    } else {
      console.log('❌ Failed to access banners API');
      console.log(`Status: ${response.status}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking banner table:', error.message);
  }
}

checkBannerTable();