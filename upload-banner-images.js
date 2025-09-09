const fs = require('fs');
const path = require('path');

async function uploadBannerImages() {
  console.log('🚀 Starting banner image upload process...');
  
  // First, get existing TOP_BANNER entries to delete them
  try {
    console.log('🗑️  Getting existing TOP_BANNER entries...');
    const getResponse = await fetch('http://localhost:3000/api/banners?banner_type=TOP_BANNER&include_inactive=true');
    const existingBanners = await getResponse.json();
    
    // Delete each existing banner
    for (const banner of existingBanners) {
      try {
        const deleteResponse = await fetch(`http://localhost:3000/api/banners/${banner.id}`, {
          method: 'DELETE'
        });
        if (deleteResponse.ok) {
          console.log(`🗑️  Deleted existing banner: ${banner.id}`);
        }
      } catch (error) {
        console.log(`Failed to delete banner ${banner.id}:`, error.message);
      }
    }
  } catch (error) {
    console.log('No existing banners to clear or error:', error.message);
  }

  // Upload images 1-8 and create banners
  for (let i = 1; i <= 8; i++) {
    try {
      const imagePath = path.join(__dirname, 'images', `${i}.png`);
      
      if (!fs.existsSync(imagePath)) {
        console.log(`⚠️  Image ${i}.png not found, skipping...`);
        continue;
      }

      console.log(`📤 Processing image ${i}.png...`);
      
      // Read the image file
      const imageBuffer = fs.readFileSync(imagePath);
      
      // Create banner entry via API with multipart form data
      const FormData = require('form-data');
      const formData = new FormData();
      
      formData.append('image', imageBuffer, {
        filename: `${i}.png`,
        contentType: 'image/png'
      });
      formData.append('title', `Top Banner ${i}`);
      formData.append('banner_type', 'TOP_BANNER');
      formData.append('device_type', 'all');
      formData.append('is_active', 'true');
      formData.append('sort_order', (i - 1).toString()); // 0-based ordering, 1이 왼쪽부터
      
      const bannerResponse = await fetch('http://localhost:3000/api/banners', {
        method: 'POST',
        body: formData,
        headers: formData.getHeaders(),
      });
      
      if (bannerResponse.ok) {
        const bannerResult = await bannerResponse.json();
        console.log(`🎯 Created banner ${i}: ${bannerResult.id}`);
      } else {
        const error = await bannerResponse.json();
        console.error(`❌ Failed to create banner ${i}:`, error.error);
      }
      
    } catch (error) {
      console.error(`❌ Error processing image ${i}:`, error.message);
    }
  }
  
  console.log('🎉 Banner upload process completed!');
  
  // Verify the results
  try {
    const verifyResponse = await fetch('http://localhost:3000/api/banners?banner_type=TOP_BANNER&include_inactive=true&sort=sort_order&order=asc');
    const banners = await verifyResponse.json();
    console.log(`\n📊 Total TOP_BANNER entries: ${banners.length}`);
    banners.forEach((banner, index) => {
      console.log(`   ${index + 1}. ${banner.title} (sort: ${banner.sortOrder}) - ${banner.imgSrc}`);
    });
  } catch (error) {
    console.error('Error verifying results:', error.message);
  }
}

// Run the upload
uploadBannerImages().catch(console.error);