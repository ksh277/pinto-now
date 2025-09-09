// Test banner upload functionality
const fs = require('fs');
const FormData = require('form-data');
const { default: fetch } = require('node-fetch');

async function testBannerUpload() {
  try {
    console.log('Testing banner upload functionality...\n');
    
    // Create a simple test image file (1x1 pixel PNG)
    const testImageData = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    const testImagePath = './test-banner.png';
    fs.writeFileSync(testImagePath, testImageData);
    
    // Create FormData
    const formData = new FormData();
    formData.append('image', fs.createReadStream(testImagePath));
    formData.append('title', 'Test Upload Banner');
    formData.append('href', '/test-page');
    formData.append('main_title', 'Test Main Title');
    formData.append('sub_title', 'Test Sub Title');
    formData.append('banner_type', 'TOP_BANNER');
    formData.append('device_type', 'all');
    formData.append('is_active', 'true');
    formData.append('sort_order', '0');
    formData.append('start_at', '2025-01-01 00:00:00');
    formData.append('end_at', '2025-12-31 23:59:59');
    
    console.log('Uploading test banner...');
    const response = await fetch('http://localhost:3030/api/banners', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Banner uploaded successfully:');
      console.log(`ID: ${result.id}`);
      console.log(`Title: ${result.title}`);
      console.log(`Image URL: ${result.image_url}`);
      console.log(`Banner Type: ${result.banner_type}`);
      
      // Clean up test file
      fs.unlinkSync(testImagePath);
      
      // Check if banner appears in list
      console.log('\n--- Checking banner list ---');
      const listResponse = await fetch('http://localhost:3030/api/banners?banner_type=TOP_BANNER');
      const banners = await listResponse.json();
      console.log(`Total TOP_BANNER banners: ${banners.length}`);
      
      const newBanner = banners.find(b => b.id === result.id);
      if (newBanner) {
        console.log('✅ New banner found in list');
      } else {
        console.log('❌ New banner not found in list');
      }
      
    } else {
      const error = await response.text();
      console.log('❌ Banner upload failed:');
      console.log(`Status: ${response.status}`);
      console.log(`Error: ${error}`);
      
      // Clean up test file
      if (fs.existsSync(testImagePath)) {
        fs.unlinkSync(testImagePath);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBannerUpload();