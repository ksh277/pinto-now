// Upload local top banners using public folder images
const fs = require('fs');
const FormData = require('form-data');
const { default: fetch } = require('node-fetch');

const localTopBanners = [
  {
    title: 'PINTO 로컬 테스트 배너 1',
    main_title: 'PINTO 신규 서비스',
    sub_title: '더 많은 굿즈 옵션을 만나보세요',
    href: '/new-service',
    more_button_link: '/new-service',
    image_url: '/banners/top1.jpg'  // public 폴더 경로
  },
  {
    title: 'PINTO 로컬 테스트 배너 2', 
    main_title: 'PINTO 특별 이벤트',
    sub_title: '한정 기간 특가 혜택을 놓치지 마세요',
    href: '/event',
    more_button_link: '/event',
    image_url: '/banners/top2.jpg'  // public 폴더 경로
  }
];

async function uploadLocalTopBanners() {
  try {
    console.log('로컬 이미지 URL을 사용해서 배너 데이터 등록 중...\n');
    
    const uploadedBanners = [];
    
    for (let i = 0; i < localTopBanners.length; i++) {
      const banner = localTopBanners[i];
      
      try {
        console.log(`${i + 1}. ${banner.title} 등록 중...`);
        
        // JSON으로 데이터 전송 (이미지 파일 업로드 없이)
        const response = await fetch('http://localhost:3030/api/banners', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: banner.title,
            image_url: banner.image_url,  // 로컬 public 경로
            href: banner.href,
            main_title: banner.main_title,
            sub_title: banner.sub_title,
            more_button_link: banner.more_button_link,
            banner_type: 'TOP_BANNER',
            device_type: 'all',
            is_active: true,
            sort_order: (i + 20),  // 높은 순서로 설정
            start_at: '2025-01-01 00:00:00',
            end_at: '2025-12-31 23:59:59'
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(`✅ 성공: ${banner.title}`);
          console.log(`   배너 ID: ${result.id}`);
          console.log(`   로컬 이미지: ${banner.image_url}`);
          
          uploadedBanners.push({
            ...banner,
            id: result.id
          });
        } else {
          const error = await response.text();
          console.log(`❌ 실패: ${banner.title} - ${error}`);
        }
        
      } catch (error) {
        console.log(`❌ 에러: ${banner.title} - ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(`\n--- 등록 결과 ---`);
    console.log(`✅ 성공한 등록: ${uploadedBanners.length}개`);
    console.log(`❌ 실패한 등록: ${localTopBanners.length - uploadedBanners.length}개`);
    
    // 현재 탑배너 총 개수 확인
    const listResponse = await fetch('http://localhost:3030/api/banners?banner_type=TOP_BANNER');
    const allBanners = await listResponse.json();
    console.log(`\n현재 총 TOP_BANNER 개수: ${allBanners.length}개`);
    
    if (uploadedBanners.length > 0) {
      console.log('\n--- 등록된 로컬 배너들 ---');
      uploadedBanners.forEach((banner, index) => {
        console.log(`${index + 1}. ${banner.title} - ${banner.image_url}`);
      });
    }
    
  } catch (error) {
    console.error('❌ 등록 과정 실패:', error.message);
  }
}

uploadLocalTopBanners();