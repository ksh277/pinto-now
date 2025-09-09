// Create a test banner directly in database to check if TopBanner works
require('dotenv').config({ path: '.env.local' });

async function createTestBanner() {
  try {
    console.log('Creating test banner via API...\n');
    
    // Create a test banner using the API
    const testBanner = {
      title: 'Test Top Banner',
      image_url: 'https://via.placeholder.com/1200x400/ff6b6b/ffffff?text=TEST+TOP+BANNER',
      href: '#',
      main_title: 'Test Main Title',
      sub_title: 'Test Sub Title', 
      more_button_link: '#more',
      banner_type: 'TOP_BANNER',
      device_type: 'all',
      is_active: true,
      sort_order: 0,
      start_at: new Date().toISOString(),
      end_at: new Date('2025-12-31').toISOString()
    };
    
    const response = await fetch('http://localhost:3010/api/banners', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBanner),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Test banner created successfully:');
      console.log(result);
      
      // Now fetch all TOP_BANNER banners
      console.log('\n--- Fetching TOP_BANNER banners ---');
      const bannersResponse = await fetch('http://localhost:3010/api/banners?banner_type=TOP_BANNER');
      const banners = await bannersResponse.json();
      console.log(`Found ${banners.length} TOP_BANNER banners:`);
      console.log(banners);
      
    } else {
      console.error('❌ Failed to create test banner:');
      console.error('Status:', response.status);
      const error = await response.text();
      console.error('Error:', error);
    }
    
  } catch (error) {
    console.error('❌ Error creating test banner:', error.message);
  }
}

createTestBanner();