// Upload real banners to replace placeholder ones
const fs = require('fs');
const FormData = require('form-data');
const { default: fetch } = require('node-fetch');

const realBanners = [
  {
    title: 'PINTO 맞춤형 굿즈 제작',
    href: '/products',
    main_title: 'PINTO 맞춤형 굿즈',
    sub_title: '나만의 특별한 굿즈를 만들어보세요',
    more_button_link: '/products'
  },
  {
    title: '아크릴 굿즈 특가 이벤트',
    href: '/acrylic-goods',
    main_title: '아크릴 굿즈 50% 할인',
    sub_title: '투명하고 깔끔한 아크릴 제품',
    more_button_link: '/acrylic-goods'
  },
  {
    title: '스티커 굿즈 신제품 출시',
    href: '/sticker-goods',
    main_title: '스티커 굿즈 신상품',
    sub_title: '방수, 자외선 차단 고품질 스티커',
    more_button_link: '/sticker-goods'
  }
];

async function uploadRealBanners() {
  try {
    console.log('Uploading real banner images to replace placeholders...\n');
    
    // Create a simple test image file (1x1 pixel PNG)
    const testImageData = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < realBanners.length; i++) {
      const banner = realBanners[i];
      const testImagePath = `./real-banner-${i + 1}.png`;
      
      try {
        // Write test image file
        fs.writeFileSync(testImagePath, testImageData);
        
        // Create FormData
        const formData = new FormData();
        formData.append('image', fs.createReadStream(testImagePath));
        formData.append('title', banner.title);
        formData.append('href', banner.href);
        formData.append('main_title', banner.main_title);
        formData.append('sub_title', banner.sub_title);
        formData.append('more_button_link', banner.more_button_link);
        formData.append('banner_type', 'TOP_BANNER');
        formData.append('device_type', 'all');
        formData.append('is_active', 'true');
        formData.append('sort_order', (i + 1).toString());
        formData.append('start_at', '2025-01-01 00:00:00');
        formData.append('end_at', '2025-12-31 23:59:59');
        
        console.log(`Uploading banner ${i + 1}: ${banner.title}...`);
        
        const response = await fetch('http://localhost:3030/api/banners', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(`✅ Success: ID ${result.id} - ${result.title}`);
          console.log(`   Image: ${result.image_url}`);
          successCount++;
        } else {
          const error = await response.text();
          console.log(`❌ Failed: ${banner.title}`);
          console.log(`   Error: ${error}`);
          failCount++;
        }
        
        // Clean up test file
        if (fs.existsSync(testImagePath)) {
          fs.unlinkSync(testImagePath);
        }
        
      } catch (error) {
        console.log(`❌ Error with ${banner.title}:`, error.message);
        failCount++;
        
        // Clean up test file
        if (fs.existsSync(testImagePath)) {
          fs.unlinkSync(testImagePath);
        }
      }
      
      // Wait a bit between uploads
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n--- Results ---`);
    console.log(`✅ Successful uploads: ${successCount}`);
    console.log(`❌ Failed uploads: ${failCount}`);
    
    // Check final banner count
    const listResponse = await fetch('http://localhost:3030/api/banners?banner_type=TOP_BANNER');
    const banners = await listResponse.json();
    console.log(`\nTotal TOP_BANNER banners now: ${banners.length}`);
    
  } catch (error) {
    console.error('❌ Upload process failed:', error.message);
  }
}

uploadRealBanners();