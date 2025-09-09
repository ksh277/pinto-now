// Add test banners directly to current database to test TopBanner functionality
require('dotenv').config({ path: '.env.local' });

const testBanners = [
  {
    title: 'Welcome to PINTO - 맞춤형 굿즈 제작',
    image_url: 'https://via.placeholder.com/1200x400/FF6B6B/FFFFFF?text=PINTO+CUSTOM+GOODS',
    href: '/products',
    main_title: 'PINTO 맞춤형 굿즈',
    sub_title: '나만의 특별한 굿즈를 만들어보세요',
    more_button_link: '/products',
    banner_type: 'TOP_BANNER',
    device_type: 'all',
    is_active: true,
    sort_order: 1,
    start_at: '2025-01-01 00:00:00',
    end_at: '2025-12-31 23:59:59'
  },
  {
    title: '아크릴 굿즈 특가 이벤트',
    image_url: 'https://via.placeholder.com/1200x400/4ECDC4/FFFFFF?text=ACRYLIC+GOODS+SALE',
    href: '/akril-goods',
    main_title: '아크릴 굿즈 50% 할인',
    sub_title: '투명하고 깔끔한 아크릴 제품',
    more_button_link: '/akril-goods',
    banner_type: 'TOP_BANNER',
    device_type: 'all',
    is_active: true,
    sort_order: 2,
    start_at: '2025-01-01 00:00:00',
    end_at: '2025-12-31 23:59:59'
  },
  {
    title: '스티커 굿즈 신제품',
    image_url: 'https://via.placeholder.com/1200x400/45B7D1/FFFFFF?text=NEW+STICKER+GOODS',
    href: '/sticker-goods',
    main_title: '스티커 굿즈 신상품',
    sub_title: '방수, 자외선 차단 고품질 스티커',
    more_button_link: '/sticker-goods',
    banner_type: 'TOP_BANNER',
    device_type: 'all',
    is_active: true,
    sort_order: 3,
    start_at: '2025-01-01 00:00:00',
    end_at: '2025-12-31 23:59:59'
  }
];

async function addTestBanners() {
  try {
    console.log('Adding test banners to database...\n');
    
    for (let i = 0; i < testBanners.length; i++) {
      const banner = testBanners[i];
      
      console.log(`Adding banner ${i + 1}: ${banner.title}`);
      
      const response = await fetch('http://localhost:3030/api/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(banner),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Banner ${i + 1} added successfully (ID: ${result.id})`);
      } else {
        const error = await response.text();
        console.log(`❌ Failed to add banner ${i + 1}: ${error}`);
      }
    }
    
    // Check all TOP_BANNER banners
    console.log('\n--- Fetching all TOP_BANNER banners ---');
    const bannersResponse = await fetch('http://localhost:3030/api/banners?banner_type=TOP_BANNER');
    
    if (bannersResponse.ok) {
      const banners = await bannersResponse.json();
      console.log(`Found ${banners.length} TOP_BANNER banners:`);
      banners.forEach((banner, index) => {
        console.log(`${index + 1}. ${banner.title} (Active: ${banner.isActive})`);
      });
    } else {
      console.log('Failed to fetch banners');
    }
    
    console.log('\n✅ Test banners setup completed!');
    console.log('Now you can test the TopBanner component.');
    
  } catch (error) {
    console.error('❌ Error adding test banners:', error);
  }
}

addTestBanners();