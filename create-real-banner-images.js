// Create real banner images and upload them
const fs = require('fs');
const FormData = require('form-data');
const { default: fetch } = require('node-fetch');
const { createCanvas } = require('canvas');

// Create a proper banner image using canvas
function createBannerImage(text, bgColor, textColor, width = 1200, height = 400) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // Main text
  ctx.fillStyle = textColor;
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  // Subtitle
  ctx.font = '24px Arial';
  ctx.fillText('PINTO 맞춤형 굿즈 제작 서비스', width / 2, height / 2 + 60);
  
  return canvas.toBuffer('image/png');
}

const bannerConfigs = [
  {
    title: 'PINTO 맞춤형 굿즈 제작',
    text: 'PINTO CUSTOM GOODS',
    bgColor: '#FF6B6B',
    textColor: '#FFFFFF',
    href: '/products',
    main_title: 'PINTO 맞춤형 굿즈',
    sub_title: '나만의 특별한 굿즈를 만들어보세요',
    more_button_link: '/products'
  },
  {
    title: '아크릴 굿즈 특가 이벤트',
    text: 'ACRYLIC GOODS SALE',
    bgColor: '#4ECDC4',
    textColor: '#FFFFFF',
    href: '/acrylic-goods',
    main_title: '아크릴 굿즈 50% 할인',
    sub_title: '투명하고 깔끔한 아크릴 제품',
    more_button_link: '/acrylic-goods'
  },
  {
    title: '스티커 굿즈 신제품 출시',
    text: 'NEW STICKER GOODS',
    bgColor: '#45B7D1',
    textColor: '#FFFFFF',
    href: '/sticker-goods',
    main_title: '스티커 굿즈 신상품',
    sub_title: '방수, 자외선 차단 고품질 스티커',
    more_button_link: '/sticker-goods'
  },
  {
    title: '키링 굿즈 컬렉션',
    text: 'KEYRING COLLECTION',
    bgColor: '#96CEB4',
    textColor: '#2C3E50',
    href: '/keyring-goods',
    main_title: '키링 굿즈 컬렉션',
    sub_title: '개성있는 키링으로 포인트를',
    more_button_link: '/keyring-goods'
  },
  {
    title: '뱃지 굿즈 신상품',
    text: 'BADGE COLLECTION',
    bgColor: '#FECA57',
    textColor: '#2C3E50',
    href: '/badge-goods',
    main_title: '뱃지 굿즈 신상품',
    sub_title: '다양한 디자인의 뱃지 컬렉션',
    more_button_link: '/badge-goods'
  }
];

async function uploadRealBannerImages() {
  try {
    console.log('Creating and uploading real banner images...\n');
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < bannerConfigs.length; i++) {
      const config = bannerConfigs[i];
      const imagePath = `./banner-${i + 1}.png`;
      
      try {
        console.log(`Creating banner ${i + 1}: ${config.title}...`);
        
        // Create the image
        const imageBuffer = createBannerImage(config.text, config.bgColor, config.textColor);
        fs.writeFileSync(imagePath, imageBuffer);
        
        // Upload to server
        const formData = new FormData();
        formData.append('image', fs.createReadStream(imagePath));
        formData.append('title', config.title);
        formData.append('href', config.href);
        formData.append('main_title', config.main_title);
        formData.append('sub_title', config.sub_title);
        formData.append('more_button_link', config.more_button_link);
        formData.append('banner_type', 'TOP_BANNER');
        formData.append('device_type', 'all');
        formData.append('is_active', 'true');
        formData.append('sort_order', (i + 1).toString());
        formData.append('start_at', '2025-01-01 00:00:00');
        formData.append('end_at', '2025-12-31 23:59:59');
        
        console.log(`Uploading ${config.title}...`);
        
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
          console.log(`❌ Failed: ${config.title}`);
          console.log(`   Error: ${error}`);
          failCount++;
        }
        
        // Clean up image file
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
        
      } catch (error) {
        console.log(`❌ Error with ${config.title}:`, error.message);
        failCount++;
        
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      // Wait between uploads
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
    console.log('Note: You may need to install canvas: npm install canvas');
  }
}

uploadRealBannerImages();