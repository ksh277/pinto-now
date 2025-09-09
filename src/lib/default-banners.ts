// 기본 배너 데이터 - Blob에 업로드된 이미지를 사용
export const defaultBanners = [
  {
    type: 'TOP_BANNER',
    title: 'TOP 배너 1 - 메인 창작 플랫폼',
    image_url: '', // Blob URL로 업데이트 필요
    href: 'https://pinto-now.vercel.app/editor',
    main_title: '창작자, 작가 모두가 참여하는 플랫폼',
    sub_title: '핀토에서 나만의 굿즈를 만들어보세요',
    more_button_link: 'https://pinto-now.vercel.app/editor',
    device_type: 'all',
    is_active: true,
    sort_order: 1
  },
  {
    type: 'TOP_BANNER',
    title: 'TOP 배너 2 - 제작 서비스',
    image_url: '', // Blob URL로 업데이트 필요
    href: '/products',
    main_title: '소량 제작부터 대량 주문까지',
    sub_title: '다양한 굿즈 제작 서비스를 만나보세요',
    more_button_link: '/products',
    device_type: 'all',
    is_active: true,
    sort_order: 2
  },
  {
    type: 'TOP_BANNER',
    title: 'TOP 배너 3 - 반려동물 굿즈',
    image_url: '', // Blob URL로 업데이트 필요
    href: '/category/pet',
    main_title: '반려동물과 함께하는 특별한 순간',
    sub_title: '사랑하는 반려동물을 위한 맞춤 굿즈를 만들어보세요',
    more_button_link: '/category/pet',
    device_type: 'all',
    is_active: true,
    sort_order: 3
  },
  {
    type: 'HOME_SLIDER_PC',
    title: 'PC 슬라이더 배너 1 - 창작자 모집',
    image_url: '', // Blob URL로 업데이트 필요
    href: '/creator-join',
    device_type: 'pc',
    is_active: true,
    sort_order: 1
  },
  {
    type: 'HOME_SLIDER_PC',
    title: 'PC 슬라이더 배너 2 - 인기 상품',
    image_url: '', // Blob URL로 업데이트 필요
    href: '/products/popular',
    device_type: 'pc',
    is_active: true,
    sort_order: 2
  },
  {
    type: 'PLATFORM_BANNER',
    title: '창작자 참여 플랫폼 배너',
    image_url: '', // 이미지 없이도 작동 (기본 텍스트 사용)
    href: '/creator-market',
    main_title: '창작자, 작가 모두가 참여하는 플랫폼',
    sub_title: '다양한 창작자와 작가들이 함께 만드는 특별한 굿즈를 만나보세요',
    device_type: 'all',
    is_active: true,
    sort_order: 1
  }
];

// 배너 데이터베이스에 기본 배너들을 등록하는 함수
export async function insertDefaultBanners() {
  try {
    for (const banner of defaultBanners) {
      const response = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner)
      });

      if (response.ok) {
        console.log(`✅ ${banner.title} 등록 성공`);
      } else {
        const error = await response.json();
        console.error(`❌ ${banner.title} 등록 실패:`, error.error);
      }
    }
    console.log('🎉 모든 기본 배너 등록 완료!');
  } catch (error) {
    console.error('배너 등록 중 오류:', error);
  }
}

// Blob URL 업데이트 함수
export function updateBannerBlobUrls(blobUrls: Record<string, string>) {
  const keys = Object.keys(blobUrls);
  keys.forEach((key, index) => {
    if (defaultBanners[index]) {
      defaultBanners[index].image_url = blobUrls[key];
    }
  });
}