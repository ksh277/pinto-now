// Upload new top banner images to Google Cloud Storage
const fs = require('fs');
const FormData = require('form-data');
const { default: fetch } = require('node-fetch');

const newTopBanners = [
  {
    filename: 'top1.jpg',
    title: 'PINTO 신규 서비스 런칭',
    main_title: 'PINTO 신규 서비스',
    sub_title: '더 많은 굿즈 옵션을 만나보세요',
    href: '/new-service',
    more_button_link: '/new-service'
  },
  {
    filename: 'top2.jpg', 
    title: 'PINTO 특별 이벤트',
    main_title: 'PINTO 특별 이벤트',
    sub_title: '한정 기간 특가 혜택을 놓치지 마세요',
    href: '/event',
    more_button_link: '/event'
  }
];

async function uploadNewTopBanners() {
  try {
    console.log('새로운 탑배너 이미지들을 구글 클라우드 스토리지에 업로드 중...\n');
    
    const uploadedBanners = [];
    
    for (let i = 0; i < newTopBanners.length; i++) {
      const banner = newTopBanners[i];
      const imagePath = `./images/${banner.filename}`;
      
      // 파일 존재 확인
      if (!fs.existsSync(imagePath)) {
        console.log(`❌ 파일을 찾을 수 없음: ${imagePath}`);
        continue;
      }
      
      try {
        console.log(`${i + 1}. ${banner.title} (${banner.filename}) 업로드 중...`);
        
        // FormData 생성
        const formData = new FormData();
        formData.append('image', fs.createReadStream(imagePath));
        formData.append('title', banner.title);
        formData.append('href', banner.href);
        formData.append('main_title', banner.main_title);
        formData.append('sub_title', banner.sub_title);
        formData.append('more_button_link', banner.more_button_link);
        formData.append('banner_type', 'TOP_BANNER');
        formData.append('device_type', 'all');
        formData.append('is_active', 'true');
        formData.append('sort_order', (i + 9).toString()); // 기존 7개 + 2개 추가
        formData.append('start_at', '2025-01-01 00:00:00');
        formData.append('end_at', '2025-12-31 23:59:59');
        
        const response = await fetch('http://localhost:3030/api/banners', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(`✅ 성공: ${banner.title}`);
          console.log(`   이미지 URL: ${result.image_url}`);
          console.log(`   배너 ID: ${result.id}`);
          
          uploadedBanners.push({
            ...banner,
            id: result.id,
            image_url: result.image_url
          });
        } else {
          const error = await response.text();
          console.log(`❌ 실패: ${banner.title} - ${error}`);
        }
        
      } catch (error) {
        console.log(`❌ 에러: ${banner.title} - ${error.message}`);
      }
      
      // 업로드 간 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n--- 업로드 결과 ---`);
    console.log(`✅ 성공한 업로드: ${uploadedBanners.length}개`);
    console.log(`❌ 실패한 업로드: ${newTopBanners.length - uploadedBanners.length}개`);
    
    if (uploadedBanners.length > 0) {
      console.log('\n--- 업로드된 탑배너 정보 ---');
      uploadedBanners.forEach((banner, index) => {
        console.log(`${index + 1}. ${banner.title}`);
        console.log(`   ID: ${banner.id}`);
        console.log(`   이미지 URL: ${banner.image_url}`);
        console.log(`   페이지 링크: ${banner.href}`);
        console.log('');
      });
      
      // 현재 탑배너 총 개수 확인
      const listResponse = await fetch('http://localhost:3030/api/banners?banner_type=TOP_BANNER');
      const allBanners = await listResponse.json();
      console.log(`현재 총 TOP_BANNER 개수: ${allBanners.length}개`);
    }
    
  } catch (error) {
    console.error('❌ 업로드 과정 실패:', error.message);
  }
}

uploadNewTopBanners();