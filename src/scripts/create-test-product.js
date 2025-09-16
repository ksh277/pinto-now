// 테스트 상품 생성 스크립트
const testProductData = {
  nameKo: "테스트 아크릴 키링",
  nameEn: "Test Acrylic Keyring",
  descriptionKo: "테스트용 아크릴 키링입니다. 다양한 옵션과 가격 계산을 테스트하기 위한 상품입니다.",
  descriptionEn: "Test acrylic keyring for testing various options and price calculations.",
  imageUrl: "/components/img/placeholder-product.jpg",
  categoryId: "akril-goods",
  subcategory: "keyring",
  isPublished: true,
  isFeatured: false,
  status: "active",
  stockQuantity: 1000,
  enablePrintTypes: true,
  printTypes: [
    { id: "single", name: "단면 인쇄", multiplier: 1.0 },
    { id: "double", name: "양면 인쇄", multiplier: 1.2 }
  ],
  sizes: [
    { id: "30x30", name: "30x30", dimension: "30x30mm" },
    { id: "50x50", name: "50x50", dimension: "50x50mm" },
    { id: "70x70", name: "70x70", dimension: "70x70mm" }
  ],
  pricingTiers: [
    {
      quantityRange: "1~9개",
      minQuantity: 1,
      maxQuantity: 9,
      prices: {
        "single-30x30": 5000,
        "single-50x50": 7000,
        "single-70x70": 9000,
        "double-30x30": 6000,
        "double-50x50": 8400,
        "double-70x70": 10800
      }
    },
    {
      quantityRange: "10~99개",
      minQuantity: 10,
      maxQuantity: 99,
      prices: {
        "single-30x30": 4500,
        "single-50x50": 6300,
        "single-70x70": 8100,
        "double-30x30": 5400,
        "double-50x50": 7560,
        "double-70x70": 9720
      }
    },
    {
      quantityRange: "100~499개",
      minQuantity: 100,
      maxQuantity: 499,
      prices: {
        "single-30x30": 4000,
        "single-50x50": 5600,
        "single-70x70": 7200,
        "double-30x30": 4800,
        "double-50x50": 6720,
        "double-70x70": 8640
      }
    },
    {
      quantityRange: "500~999개",
      minQuantity: 500,
      maxQuantity: 999,
      prices: {
        "single-30x30": 3500,
        "single-50x50": 4900,
        "single-70x70": 6300,
        "double-30x30": 4200,
        "double-50x50": 5880,
        "double-70x70": 7560
      }
    }
  ],
  customOptions: [
    { name: "홀로그램 효과", price: 500 },
    { name: "UV 코팅", price: 300 }
  ]
};

async function createTestProduct() {
  try {
    const response = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 실제 환경에서는 인증 토큰이 필요할 수 있습니다
      },
      body: JSON.stringify(testProductData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ 테스트 상품이 성공적으로 생성되었습니다!');
      console.log('상품 ID:', result.id);
      return result.id;
    } else {
      const error = await response.json();
      console.error('❌ 상품 생성 실패:', error);
      return null;
    }
  } catch (error) {
    console.error('❌ 요청 실패:', error);
    return null;
  }
}

// Node.js 환경에서 실행 시
if (typeof window === 'undefined') {
  createTestProduct();
}

// 브라우저에서 사용할 수 있도록 export
if (typeof module !== 'undefined') {
  module.exports = { createTestProduct, testProductData };
}