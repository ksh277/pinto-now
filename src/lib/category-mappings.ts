export interface CategoryMapping {
  slug: string;
  categoryKo: string;
  type: 'category' | 'service' | 'board';
  subtitle: string;
  description: string;
  usp: Array<{ icon: string; title: string; desc: string }>;
  heroImagePath: string;
  sampleProducts?: Array<{
    id: string;
    name: string;
    tags: string[];
    price: number;
    image: string;
  }>;
}

export const categoryMappings: Record<string, CategoryMapping> = {
  'all': {
    slug: 'all',
    categoryKo: 'ALL',
    type: 'category',
    subtitle: '모든 굿즈를 한 곳에서',
    description: '핀토의 모든 제품들을 둘러보고 나만의 특별한 굿즈를 찾아보세요.',
    usp: [
      { icon: '🎨', title: '다양한 선택', desc: '수백 가지 제품 옵션' },
      { icon: '⚡', title: '빠른 제작', desc: '신속한 생산과 배송' },
      { icon: '💎', title: '품질 보장', desc: '엄선된 고품질 재료 사용' }
    ],
    heroImagePath: '/components/img/placeholder-product.jpg',
    sampleProducts: []
  },
  'custom-product-view': {
    slug: 'custom-product-view',
    categoryKo: '커스텀상품(제품뷰)',
    type: 'category',
    subtitle: '나만의 특별한 맞춤 제품',
    description: '원하는 대로 디자인하고 제작하는 완전 맞춤형 굿즈를 만나보세요.',
    usp: [
      { icon: '✨', title: '완전 맞춤', desc: '100% 개인화된 제품 제작' },
      { icon: '🎯', title: '정확한 구현', desc: '디자인 의도를 정확히 반영' },
      { icon: '🔧', title: '전문 상담', desc: '1:1 전문가 맞춤 서비스' }
    ],
    heroImagePath: '/components/img/placeholder-product.jpg'
  },
  'promo-product-view': {
    slug: 'promo-product-view', 
    categoryKo: '단체판촉상품(제품뷰)',
    type: 'category',
    subtitle: '대량 주문 전용 판촉 상품',
    description: '기업, 단체를 위한 대량 주문 전문 판촉용 굿즈를 합리적인 가격에 제작하세요.',
    usp: [
      { icon: '📦', title: '대량 할인', desc: '수량별 단계별 할인 혜택' },
      { icon: '🏢', title: '기업 전용', desc: 'B2B 전문 서비스' },
      { icon: '⏰', title: '일정 관리', desc: '납기 일정 보장' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  // promo-product-view/hero.png' // If needed, add as a separate property or update the value
  },
  'ip-goods-dev': {
    slug: 'ip-goods-dev',
    categoryKo: 'IP굿즈 상품개발',
    type: 'service',
    subtitle: '지적재산권 기반 굿즈 개발',
    description: '캐릭터, 브랜드 IP를 활용한 라이선스 굿즈 개발 서비스를 제공합니다.',
    usp: [
      { icon: '©️', title: 'IP 라이선스', desc: '정식 라이선스 굿즈 개발' },
      { icon: '🎭', title: '캐릭터 굿즈', desc: '인기 캐릭터 기반 제품' },
      { icon: '💼', title: '상품기획', desc: '전문 기획팀의 상품 개발' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'brand-request': {
    slug: 'brand-request',
    categoryKo: '브랜드의뢰',
    type: 'service',
    subtitle: '브랜드 맞춤 굿즈 제작 의뢰',
    description: '브랜드 아이덴티티에 맞는 전문적인 굿즈 제작을 의뢰하세요.',
    usp: [
      { icon: '🏆', title: '브랜드 맞춤', desc: 'BI에 최적화된 굿즈 제작' },
      { icon: '👥', title: '전담팀', desc: '브랜드 전담 프로젝트 팀' },
      { icon: '📋', title: '체계적 관리', desc: '프로젝트 전과정 관리' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'reviews': {
    slug: 'reviews',
    categoryKo: '리뷰',
    type: 'board',
    subtitle: '고객 리뷰 & 후기',
    description: '실제 고객들의 솔직한 리뷰와 제작 후기를 확인해보세요.',
    usp: [
      { icon: '⭐', title: '실제 후기', desc: '검증된 고객 리뷰만 게시' },
      { icon: '📸', title: '포토 리뷰', desc: '실제 제작물 사진 공유' },
      { icon: '💬', title: '상호 소통', desc: '리뷰 댓글과 Q&A' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'guide': {
    slug: 'guide',
    categoryKo: '상품주문 가이드',
    type: 'service',
    subtitle: '주문부터 배송까지 완벽 가이드',
    description: '처음 주문하시는 분도 쉽게 따라할 수 있는 상세한 주문 가이드입니다.',
    usp: [
      { icon: '📖', title: '단계별 설명', desc: '주문 과정 자세한 안내' },
      { icon: '🎨', title: '디자인 팁', desc: '효과적인 디자인 가이드' },
      { icon: '📞', title: '상담 지원', desc: '전문 상담사 도움' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'fan-goods': {
    slug: 'fan-goods',
    categoryKo: '팬굿즈',
    type: 'category',
    subtitle: '덕질을 위한 특별한 굿즈',
    description: '최애를 응원하는 마음을 담은 다양한 팬굿즈를 만들어보세요.',
    usp: [
      { icon: '💕', title: '팬심 표현', desc: '최애에 대한 사랑 표현' },
      { icon: '🎪', title: '이벤트용', desc: '콘서트, 팬미팅 전용' },
      { icon: '👥', title: '단체 주문', desc: '팬클럽 공동 주문 가능' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'paper-goods': {
    slug: 'paper-goods',
    categoryKo: '지류 굿즈',
    type: 'category',
    subtitle: '종이로 만드는 다양한 굿즈',
    description: '포스터, 스티커, 엽서 등 종이 기반의 실용적인 굿즈들을 제작하세요.',
    usp: [
      { icon: '📄', title: '다양한 종이', desc: '고급 용지부터 특수지까지' },
      { icon: '🖨️', title: '고품질 인쇄', desc: '선명하고 정확한 컬러 인쇄' },
      { icon: '💰', title: '합리적 가격', desc: '저렴한 단가의 대량 제작' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'sticker-deco': {
    slug: 'sticker-deco',
    categoryKo: '스티커(다꾸)',
    type: 'category',
    subtitle: '다이어리 꾸미기 전용 스티커',
    description: '다꾸족들을 위한 예쁜 스티커와 데코 아이템들을 만나보세요.',
    usp: [
      { icon: '🌈', title: '다양한 디자인', desc: '트렌디한 다꾸 스티커' },
      { icon: '✂️', title: '정밀 재단', desc: '깔끔한 다이컷 스티커' },
      { icon: '📔', title: '다꾸 최적화', desc: '다이어리 꾸미기 전용' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'pin-button': {
    slug: 'pin-button',
    categoryKo: '핀버튼/버튼',
    type: 'category',
    subtitle: '작지만 임팩트 있는 핀버튼',
    description: '가방, 옷, 모자에 포인트를 주는 개성 넘치는 핀버튼을 제작하세요.',
    usp: [
      { icon: '📌', title: '다양한 사이즈', desc: '25mm부터 75mm까지 선택' },
      { icon: '✨', title: '고급 마감', desc: '메탈 핀과 안전핀 옵션' },
      { icon: '💎', title: '특수 효과', desc: '홀로그램, 야광 등 특수 인쇄' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'life-size-standee': {
    slug: 'life-size-standee',
    categoryKo: '등신대',
    type: 'category',
    subtitle: '실물 크기 입체 등신대',
    description: '포토존, 이벤트, 매장 디스플레이용 등신대를 고품질로 제작합니다.',
    usp: [
      { icon: '📏', title: '실물 크기', desc: '정확한 실제 사이즈 제작' },
      { icon: '🏗️', title: '튼튼한 구조', desc: '골판지와 PVC 소재 선택' },
      { icon: '🎪', title: '이벤트 특화', desc: '포토존, 전시회 최적화' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'etc': {
    slug: 'etc',
    categoryKo: 'ETC',
    type: 'category',
    subtitle: '이색적이고 특별한 굿즈',
    description: '일반적이지 않은 특별하고 독창적인 굿즈들을 만나보세요.',
    usp: [
      { icon: '🔮', title: '독특한 아이템', desc: '남다른 개성을 표현' },
      { icon: '🎨', title: '창작 자유도', desc: '제한 없는 창작 가능' },
      { icon: '💡', title: '맞춤 제작', desc: '특별한 요구사항 반영' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'promo': {
    slug: 'promo',
    categoryKo: '단체 판촉상품',
    type: 'category',
    subtitle: '대량 주문 전용 판촉 굿즈',
    description: '기업, 단체 이벤트를 위한 대량 제작 전문 판촉용 굿즈입니다.',
    usp: [
      { icon: '📦', title: '대량 할인', desc: '수량별 단계적 할인 혜택' },
      { icon: '🏢', title: '기업 맞춤', desc: 'B2B 전문 서비스' },
      { icon: '⏱️', title: '빠른 납기', desc: '대량 주문도 신속 처리' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'mug-glass': {
    slug: 'mug-glass',
    categoryKo: '머그컵/유리컵',
    type: 'category',
    subtitle: '일상을 특별하게 만드는 컵',
    description: '매일 사용하는 컵에 나만의 디자인을 새겨 특별함을 더하세요.',
    usp: [
      { icon: '☕', title: '다양한 소재', desc: '도자기, 유리, 스테인리스' },
      { icon: '🔥', title: '내열성', desc: '뜨거운 음료도 안전하게' },
      { icon: '🎁', title: '선물 최적', desc: '기념품, 답례품으로 인기' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'tumbler': {
    slug: 'tumbler',
    categoryKo: '텀블러',
    type: 'category',
    subtitle: '친환경 개인 텀블러',
    description: '환경을 생각하는 마음과 개성을 담은 나만의 텀블러를 만들어보세요.',
    usp: [
      { icon: '🌱', title: '친환경', desc: '일회용컵 사용 줄이기' },
      { icon: '🧊', title: '보온보냉', desc: '온도 유지 기능 탁월' },
      { icon: '💧', title: '밀폐력', desc: '새지 않는 완벽한 밀폐' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'towel': {
    slug: 'towel',
    categoryKo: '수건',
    type: 'category',
    subtitle: '실용적인 맞춤 수건',
    description: '운동, 여행, 일상에서 사용하는 수건에 개성을 더해보세요.',
    usp: [
      { icon: '💨', title: '빠른 흡수', desc: '우수한 흡수력과 속건성' },
      { icon: '🏃', title: '운동용', desc: '스포츠, 헬스장 전용' },
      { icon: '🧼', title: '위생적', desc: '항균 처리 가능' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'clock': {
    slug: 'clock',
    categoryKo: '시계',
    type: 'category',
    subtitle: '시간을 알려주는 특별한 시계',
    description: '벽시계, 탁상시계에 나만의 디자인을 넣어 공간을 꾸며보세요.',
    usp: [
      { icon: '⏰', title: '정확한 시간', desc: '정밀한 시계 무브먼트' },
      { icon: '🏠', title: '인테리어', desc: '공간을 꾸미는 장식 효과' },
      { icon: '🎨', title: '맞춤 디자인', desc: '원하는 디자인으로 제작' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'umbrella': {
    slug: 'umbrella',
    categoryKo: '우산',
    type: 'category',
    subtitle: '비오는 날을 특별하게 만드는 우산',
    description: '실용적이면서도 개성 넘치는 나만의 우산을 제작해보세요.',
    usp: [
      { icon: '☔', title: '방수 기능', desc: '완벽한 방수 처리' },
      { icon: '💪', title: '튼튼함', desc: '강한 바람에도 끄떡없는 내구성' },
      { icon: '🌈', title: '다양한 타입', desc: '장우산, 접이식 선택 가능' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'tshirt': {
    slug: 'tshirt',
    categoryKo: '티셔츠',
    type: 'category',
    subtitle: '나만의 스타일을 입다',
    description: '편안한 착용감과 개성있는 디자인의 맞춤 티셔츠를 제작하세요.',
    usp: [
      { icon: '👕', title: '다양한 소재', desc: '면, 폴리, 혼방 등 선택' },
      { icon: '🎨', title: '프리미엄 인쇄', desc: '실크, DTG, 자수 등 다양한 방식' },
      { icon: '📏', title: '사이즈 완비', desc: 'XS부터 3XL까지' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'signage': {
    slug: 'signage',
    categoryKo: '광고물/사인',
    type: 'category',
    subtitle: '눈에 띄는 광고 사인물',
    description: '매장, 이벤트, 안내용 사인물을 전문적으로 제작합니다.',
    usp: [
      { icon: '🏪', title: '매장용', desc: '매장 간판, 메뉴판 제작' },
      { icon: '🎪', title: '이벤트용', desc: '현수막, 배너, X배너' },
      { icon: '🔍', title: '고해상도', desc: '선명하고 시인성 좋은 인쇄' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'led-neon': {
    slug: 'led-neon',
    categoryKo: 'LED 네온',
    type: 'category',
    subtitle: '화려한 LED 네온사인',
    description: '밤을 밝히는 아름다운 LED 네온사인으로 공간을 특별하게 만드세요.',
    usp: [
      { icon: '💡', title: '에너지 절약', desc: 'LED로 전력 소비 최소화' },
      { icon: '🌙', title: '야간 효과', desc: '밤에 더욱 돋보이는 조명' },
      { icon: '🎨', title: '맞춤 제작', desc: '원하는 모양과 색상으로' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'env-design': {
    slug: 'env-design',
    categoryKo: '환경디자인',
    type: 'category',
    subtitle: '공간을 변화시키는 환경 디자인',
    description: '실내외 공간을 디자인으로 새롭게 변화시키는 환경 디자인 서비스입니다.',
    usp: [
      { icon: '🏢', title: '공간 기획', desc: '전문적인 공간 디자인' },
      { icon: '🎨', title: '시각 효과', desc: '임팩트 있는 비주얼 연출' },
      { icon: '📐', title: '맞춤 설계', desc: '공간에 최적화된 설계' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'mini-sign': {
    slug: 'mini-sign',
    categoryKo: '미니간판',
    type: 'category',
    subtitle: '작지만 강한 미니 간판',
    description: '카페, 소상공인을 위한 아기자기하고 세련된 미니 간판입니다.',
    usp: [
      { icon: '🏠', title: '소상공인', desc: '개인 사업자 맞춤형' },
      { icon: '💎', title: '고급스러움', desc: '세련된 디자인과 마감' },
      { icon: '💰', title: '합리적 가격', desc: '부담 없는 제작 비용' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'pet': {
    slug: 'pet',
    categoryKo: '반려동물',
    type: 'category',
    subtitle: '우리 가족 반려동물 굿즈',
    description: '사랑하는 반려동물을 위한, 반려동물과 함께하는 특별한 굿즈입니다.',
    usp: [
      { icon: '🐕', title: '반려동물용', desc: '펫 전용 안전한 소재' },
      { icon: '❤️', title: '가족 사랑', desc: '반려동물 가족 맞춤' },
      { icon: '📸', title: '사진 활용', desc: '반려동물 사진으로 제작' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'frame-prop-name-tag': {
    slug: 'frame-prop-name-tag',
    categoryKo: '액자/소품/네임택',
    type: 'category',
    subtitle: '소중한 추억을 담는 소품들',
    description: '기념품, 선물용으로 인기 높은 액자, 소품, 네임택을 제작하세요.',
    usp: [
      { icon: '🖼️', title: '다양한 액자', desc: '탁상용, 벽걸이용 액자' },
      { icon: '🏷️', title: '맞춤 네임택', desc: '개인, 업체용 네임택' },
      { icon: '🎁', title: '선물 최적', desc: '기념품, 답례품으로 인기' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'cushion-fabric': {
    slug: 'cushion-fabric',
    categoryKo: '쿠션/방석/패브릭 제품',
    type: 'category',
    subtitle: '편안함을 더하는 패브릭 굿즈',
    description: '일상에 편안함과 개성을 더해주는 쿠션, 방석, 패브릭 제품입니다.',
    usp: [
      { icon: '🛋️', title: '편안함', desc: '부드럽고 편안한 착석감' },
      { icon: '🏠', title: '인테리어', desc: '공간을 꾸미는 장식 효과' },
      { icon: '🧵', title: '고급 원단', desc: '품질 좋은 패브릭 사용' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'funeral': {
    slug: 'funeral',
    categoryKo: '장례용품',
    type: 'category',
    subtitle: '고인을 기리는 추도 용품',
    description: '소중한 분을 기리고 추모하는 마음을 담은 정중한 장례용품입니다.',
    usp: [
      { icon: '🕊️', title: '정중한 디자인', desc: '격식에 맞는 디자인' },
      { icon: '💐', title: '추모 의미', desc: '고인을 기리는 마음' },
      { icon: '🤝', title: '신속 대응', desc: '급한 일정에 맞춘 제작' }
    ],
  heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'packing-supplies': {
    slug: 'packing-supplies',
    categoryKo: '포장 부자재',
    type: 'category',
    subtitle: '완벽한 포장을 위한 부자재',
    description: '제품 포장, 배송을 위한 다양한 포장 부자재를 제공합니다.',
    usp: [
      { icon: '📦', title: '포장 전문', desc: '안전한 포장 솔루션' },
      { icon: '🛡️', title: '보호 기능', desc: '제품 손상 방지' },
      { icon: '♻️', title: '친환경', desc: '재활용 가능한 소재' }
    ],
    heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'office': {
    slug: 'office',
    categoryKo: '문구/오피스 굿즈',
    type: 'category',
    subtitle: '업무와 학습을 위한 실용적인 맞춤 문구',
    description: '일상에서 유용하게 사용할 수 있는 고품질 문구 및 오피스 용품을 맞춤 제작합니다.',
    usp: [
      { icon: '✏️', title: '실용성', desc: '일상에서 유용하게 사용되는 실용적인 제품' },
      { icon: '🎨', title: '맞춤 디자인', desc: '브랜드와 개성을 반영한 맞춤 디자인' },
      { icon: '💼', title: '업무 효율', desc: '업무와 학습 효율을 높이는 기능성' }
    ],
    heroImagePath: '/components/img/placeholder-product.jpg',
  },
  'view-all': {
    slug: 'view-all',
    categoryKo: '전체보기',
    type: 'category',
    subtitle: '모든 상품을 한눈에',
    description: '핀토의 모든 제품 카테고리를 둘러보고 원하는 굿즈를 찾아보세요.',
    usp: [
      { icon: '🔍', title: '전체 탐색', desc: '모든 카테고리 한번에 확인' },
      { icon: '📋', title: '체계적 분류', desc: '카테고리별 정리된 목록' },
      { icon: '⚡', title: '빠른 검색', desc: '원하는 제품 빠른 탐색' }
    ],
    heroImagePath: '/components/img/placeholder-product.jpg',
  }
};

export const getCategoryMapping = (slug: string): CategoryMapping | null => {
  return categoryMappings[slug] || null;
};