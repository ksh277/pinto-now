// 아크릴코롯 가격표 데이터
export interface PricingTier {
  quantityRange: string;
  minQuantity: number;
  maxQuantity: number;
  prices: Record<string, number>;
}

export interface ProductPricing {
  id: string;
  name: string;
  printTypes: {
    id: string;
    name: string;
    multiplier: number; // 기본 가격에 곱할 계수 (양면의 경우 약간 더 비쌈)
  }[];
  sizes: {
    id: string;
    name: string;
    dimension: string;
  }[];
  pricingTiers: PricingTier[];
}

// 아크릴코롯 가격표
export const acrylicCoasterPricing: ProductPricing = {
  id: 'acrylic-coaster',
  name: '아크릴코롯',
  printTypes: [
    { id: 'single', name: '단면 인쇄', multiplier: 1.0 },
    { id: 'double', name: '양면 인쇄', multiplier: 1.0 }
  ],
  sizes: [
    { id: '30x30', name: '30x30', dimension: '30x30mm' },
    { id: '40x40', name: '40x40', dimension: '40x40mm' },
    { id: '50x30', name: '50x30', dimension: '50x30mm' },
    { id: '50x50', name: '50x50', dimension: '50x50mm' },
    { id: '60x35', name: '60x35', dimension: '60x35mm' },
    { id: '60x60', name: '60x60', dimension: '60x60mm' },
    { id: '70x40', name: '70x40', dimension: '70x40mm' },
    { id: '70x50', name: '70x50', dimension: '70x50mm' },
    { id: '70x70', name: '70x70', dimension: '70x70mm' },
    { id: '80x20', name: '80x20', dimension: '80x20mm' },
    { id: '80x40', name: '80x40', dimension: '80x40mm' },
    { id: '80x60', name: '80x60', dimension: '80x60mm' }
  ],
  pricingTiers: [
    {
      quantityRange: '1~9개',
      minQuantity: 1,
      maxQuantity: 9,
      prices: {
        // 단면 인쇄 가격
        'single-30x30': 8300,
        'single-40x40': 9000,
        'single-50x30': 9000,
        'single-50x50': 9700,
        'single-60x35': 9700,
        'single-60x60': 10900,
        'single-70x40': 10200,
        'single-70x50': 10900,
        'single-70x70': 12400,
        'single-80x20': 9000,
        'single-80x40': 10900,
        'single-80x60': 12400,
        // 양면 인쇄 가격
        'double-30x30': 8600,
        'double-40x40': 9300,
        'double-50x30': 9300,
        'double-50x50': 10000,
        'double-60x35': 10000,
        'double-60x60': 11200,
        'double-70x40': 10500,
        'double-70x50': 11200,
        'double-70x70': 12700,
        'double-80x20': 9300,
        'double-80x40': 11200,
        'double-80x60': 12700
      }
    },
    {
      quantityRange: '10~99개',
      minQuantity: 10,
      maxQuantity: 99,
      prices: {
        // 단면 인쇄 가격
        'single-30x30': 3800,
        'single-40x40': 4500,
        'single-50x30': 4500,
        'single-50x50': 5200,
        'single-60x35': 5200,
        'single-60x60': 6400,
        'single-70x40': 5700,
        'single-70x50': 6400,
        'single-70x70': 7900,
        'single-80x20': 4500,
        'single-80x40': 6400,
        'single-80x60': 7900,
        // 양면 인쇄 가격
        'double-30x30': 4100,
        'double-40x40': 4800,
        'double-50x30': 4800,
        'double-50x50': 5500,
        'double-60x35': 5500,
        'double-60x60': 6700,
        'double-70x40': 6000,
        'double-70x50': 6700,
        'double-70x70': 8200,
        'double-80x20': 4800,
        'double-80x40': 6700,
        'double-80x60': 8200
      }
    },
    {
      quantityRange: '100~499개',
      minQuantity: 100,
      maxQuantity: 499,
      prices: {
        // 단면 인쇄 가격
        'single-30x30': 3000,
        'single-40x40': 3700,
        'single-50x30': 3700,
        'single-50x50': 4400,
        'single-60x35': 4400,
        'single-60x60': 5600,
        'single-70x40': 4900,
        'single-70x50': 5600,
        'single-70x70': 7100,
        'single-80x20': 3700,
        'single-80x40': 5600,
        'single-80x60': 7100,
        // 양면 인쇄 가격
        'double-30x30': 3300,
        'double-40x40': 4000,
        'double-50x30': 4000,
        'double-50x50': 4700,
        'double-60x35': 4700,
        'double-60x60': 5900,
        'double-70x40': 5200,
        'double-70x50': 5900,
        'double-70x70': 7400,
        'double-80x20': 4000,
        'double-80x40': 5900,
        'double-80x60': 7400
      }
    },
    {
      quantityRange: '500~999개',
      minQuantity: 500,
      maxQuantity: 999,
      prices: {
        // 단면 인쇄 가격
        'single-30x30': 2300,
        'single-40x40': 3000,
        'single-50x30': 3000,
        'single-50x50': 3700,
        'single-60x35': 3700,
        'single-60x60': 4900,
        'single-70x40': 4200,
        'single-70x50': 4900,
        'single-70x70': 6400,
        'single-80x20': 3000,
        'single-80x40': 4900,
        'single-80x60': 6400,
        // 양면 인쇄 가격
        'double-30x30': 2600,
        'double-40x40': 3300,
        'double-50x30': 3300,
        'double-50x50': 4000,
        'double-60x35': 4000,
        'double-60x60': 5200,
        'double-70x40': 4500,
        'double-70x50': 5200,
        'double-70x70': 6700,
        'double-80x20': 3300,
        'double-80x40': 5200,
        'double-80x60': 6700
      }
    }
  ]
};

// 아크릴키링 3T 가격표
export const acrylicKeyringPricing: ProductPricing = {
  id: 'acrylic-keyring-3t',
  name: '아크릴키링 3T',
  printTypes: [
    { id: 'single', name: '단면 인쇄', multiplier: 1.0 }
  ],
  sizes: [
    { id: '20x20', name: '20x20', dimension: '20x20mm' },
    { id: '30x15', name: '30x15', dimension: '30x15mm' },
    { id: '30x30', name: '30x30', dimension: '30x30mm' },
    { id: '40x40', name: '40x40', dimension: '40x40mm' },
    { id: '50x30', name: '50x30', dimension: '50x30mm' },
    { id: '50x50', name: '50x50', dimension: '50x50mm' },
    { id: '60x30', name: '60x30', dimension: '60x30mm' },
    { id: '60x60', name: '60x60', dimension: '60x60mm' },
    { id: '70x35', name: '70x35', dimension: '70x35mm' },
    { id: '70x50', name: '70x50', dimension: '70x50mm' },
    { id: '70x70', name: '70x70', dimension: '70x70mm' },
    { id: '80x20', name: '80x20', dimension: '80x20mm' },
    { id: '80x40', name: '80x40', dimension: '80x40mm' },
    { id: '80x60', name: '80x60', dimension: '80x60mm' },
    { id: '90x30', name: '90x30', dimension: '90x30mm' },
    { id: '90x50', name: '90x50', dimension: '90x50mm' },
    { id: '90x70', name: '90x70', dimension: '90x70mm' },
    { id: '90x90', name: '90x90', dimension: '90x90mm' },
    { id: '100x20', name: '100x20', dimension: '100x20mm' },
    { id: '100x40', name: '100x40', dimension: '100x40mm' }
  ],
  pricingTiers: [
    {
      quantityRange: '1~9개',
      minQuantity: 1,
      maxQuantity: 9,
      prices: {
        '20x20': 4200,
        '30x15': 4200,
        '30x30': 4300,
        '40x40': 4600,
        '50x30': 4600,
        '50x50': 4800,
        '60x30': 4700,
        '60x60': 5000,
        '70x35': 4800,
        '70x50': 5000,
        '70x70': 5700,
        '80x20': 4600,
        '80x40': 4900,
        '80x60': 5700,
        '90x30': 4900,
        '90x50': 5400,
        '90x70': 6300,
        '90x90': 6500,
        '100x20': 4900,
        '100x40': 5500
      }
    },
    {
      quantityRange: '10~99개',
      minQuantity: 10,
      maxQuantity: 99,
      prices: {
        '20x20': 2100,
        '30x15': 2100,
        '30x30': 2200,
        '40x40': 2500,
        '50x30': 2500,
        '50x50': 2700,
        '60x30': 2600,
        '60x60': 2900,
        '70x35': 2700,
        '70x50': 2900,
        '70x70': 3600,
        '80x20': 2500,
        '80x40': 2800,
        '80x60': 3600,
        '90x30': 2800,
        '90x50': 3300,
        '90x70': 4200,
        '90x90': 4400,
        '100x20': 2800,
        '100x40': 3400
      }
    },
    {
      quantityRange: '100~499개',
      minQuantity: 100,
      maxQuantity: 499,
      prices: {
        '20x20': 1600,
        '30x15': 1600,
        '30x30': 1700,
        '40x40': 2000,
        '50x30': 2000,
        '50x50': 2200,
        '60x30': 2100,
        '60x60': 2400,
        '70x35': 2200,
        '70x50': 2400,
        '70x70': 3100,
        '80x20': 2000,
        '80x40': 2300,
        '80x60': 3100,
        '90x30': 2300,
        '90x50': 2800,
        '90x70': 3700,
        '90x90': 3900,
        '100x20': 2300,
        '100x40': 2900
      }
    },
    {
      quantityRange: '500~999개',
      minQuantity: 500,
      maxQuantity: 999,
      prices: {
        '20x20': 1200,
        '30x15': 1200,
        '30x30': 1300,
        '40x40': 1600,
        '50x30': 1600,
        '50x50': 1800,
        '60x30': 1700,
        '60x60': 2000,
        '70x35': 1800,
        '70x50': 2000,
        '70x70': 2700,
        '80x20': 1600,
        '80x40': 1900,
        '80x60': 2700,
        '90x30': 1900,
        '90x50': 2400,
        '90x70': 3300,
        '90x90': 3500,
        '100x20': 1900,
        '100x40': 2500
      }
    }
  ]
};

// 포토프롭 3T 가격표
export const photoPropsThreeTierPricing: ProductPricing = {
  id: 'photo-props-3t',
  name: '포토프롭 3T',
  printTypes: [
    { id: 'single', name: '단면 인쇄', multiplier: 1.0 }
  ],
  sizes: [
    { id: '20x20', name: '20x20', dimension: '20x20mm' },
    { id: '30x30', name: '30x30', dimension: '30x30mm' },
    { id: '40x40', name: '40x40', dimension: '40x40mm' },
    { id: '50x50', name: '50x50', dimension: '50x50mm' }
  ],
  pricingTiers: [
    {
      quantityRange: '1~9개',
      minQuantity: 1,
      maxQuantity: 9,
      prices: {
        '20x20': 4200,
        '30x30': 4300,
        '40x40': 4600,
        '50x50': 4800
      }
    }
  ]
};

// 포토프(라미) 가격표
export const photoPropsLaminatedPricing: ProductPricing = {
  id: 'photo-props-laminated',
  name: '포토프(라미)',
  printTypes: [
    { id: 'single', name: '단면 인쇄', multiplier: 1.0 }
  ],
  sizes: [
    { id: '20x20', name: '20x20', dimension: '20x20mm' },
    { id: '30x30', name: '30x30', dimension: '30x30mm' },
    { id: '40x40', name: '40x40', dimension: '40x40mm' },
    { id: '50x50', name: '50x50', dimension: '50x50mm' }
  ],
  pricingTiers: [
    {
      quantityRange: '1~9개',
      minQuantity: 1,
      maxQuantity: 9,
      prices: {
        '20x20': 3500,
        '30x30': 3600,
        '40x40': 3900,
        '50x50': 4100
      }
    }
  ]
};

// 아크릴스탠드(본품) 가격표
export const acrylicStandMainPricing: ProductPricing = {
  id: 'acrylic-stand-main',
  name: '아크릴스탠드(본품)',
  printTypes: [
    { id: 'single', name: '단면 인쇄', multiplier: 1.0 }
  ],
  sizes: [
    { id: '50x50', name: '50x50', dimension: '50x50mm' },
    { id: '60x60', name: '60x60', dimension: '60x60mm' },
    { id: '70x70', name: '70x70', dimension: '70x70mm' },
    { id: '80x80', name: '80x80', dimension: '80x80mm' }
  ],
  pricingTiers: [
    {
      quantityRange: '1~9개',
      minQuantity: 1,
      maxQuantity: 9,
      prices: {
        '50x50': 5500,
        '60x60': 6200,
        '70x70': 7000,
        '80x80': 7800
      }
    }
  ]
};

// 라미키링 가격표
export const laminatedKeyringPricing: ProductPricing = {
  id: 'laminated-keyring',
  name: '라미키링',
  printTypes: [
    { id: 'single', name: '단면 인쇄', multiplier: 1.0 }
  ],
  sizes: [
    { id: '20x20', name: '20x20', dimension: '20x20mm' },
    { id: '30x30', name: '30x30', dimension: '30x30mm' },
    { id: '40x40', name: '40x40', dimension: '40x40mm' },
    { id: '50x50', name: '50x50', dimension: '50x50mm' }
  ],
  pricingTiers: [
    {
      quantityRange: '1~9개',
      minQuantity: 1,
      maxQuantity: 9,
      prices: {
        '20x20': 3000,
        '30x30': 3100,
        '40x40': 3400,
        '50x50': 3600
      }
    }
  ]
};

// 아크릴 자석 냉장고 마그네틱 가격표
export const acrylicMagneticPricing: ProductPricing = {
  id: 'acrylic-magnetic',
  name: '아크릴 자석 냉장고 마그네틱',
  printTypes: [
    { id: 'single', name: '단면 인쇄', multiplier: 1.0 }
  ],
  sizes: [
    { id: '30x30', name: '30x30', dimension: '30x30mm' },
    { id: '40x40', name: '40x40', dimension: '40x40mm' },
    { id: '50x50', name: '50x50', dimension: '50x50mm' },
    { id: '60x60', name: '60x60', dimension: '60x60mm' }
  ],
  pricingTiers: [
    {
      quantityRange: '1~9개',
      minQuantity: 1,
      maxQuantity: 9,
      prices: {
        '30x30': 4500,
        '40x40': 5000,
        '50x50': 5500,
        '60x60': 6000
      }
    }
  ]
};

// 아크릴 스탠드(바닥판) 가격표
export const acrylicStandBasePricing: ProductPricing = {
  id: 'acrylic-stand-base',
  name: '아크릴 스탠드(바닥판)',
  printTypes: [
    { id: '3t-clear', name: '3T 투명', multiplier: 1.0 },
    { id: '5t-clear', name: '5T 투명', multiplier: 1.0 },
    { id: '3t-print-back', name: '3T 인쇄 (배면)', multiplier: 1.0 },
    { id: '3t-print-lami', name: '3T 인쇄 라미', multiplier: 1.0 }
  ],
  sizes: [
    { id: '50x30', name: '50x30', dimension: '50x30mm' },
    { id: '50x50', name: '50x50', dimension: '50x50mm' },
    { id: '70x30', name: '70x30', dimension: '70x30mm' },
    { id: '70x70', name: '70x70', dimension: '70x70mm' },
    { id: '50x100', name: '50x100', dimension: '50x100mm' },
    { id: '100x100', name: '100x100', dimension: '100x100mm' },
    { id: '65x65', name: '65x65', dimension: '65x65mm' },
    { id: '50x90', name: '50x90', dimension: '50x90mm' },
    { id: '90x90', name: '90x90', dimension: '90x90mm' }
  ],
  pricingTiers: [
    {
      quantityRange: '1~9개',
      minQuantity: 1,
      maxQuantity: 9,
      prices: {
        // 3T 투명
        '3t-clear-50x30': 200,
        '3t-clear-50x50': 400,
        '3t-clear-70x30': 400,
        '3t-clear-70x70': 700,
        '3t-clear-50x100': 700,
        '3t-clear-100x100': 1000,
        
        // 5T 투명
        '5t-clear-50x30': 300,
        '5t-clear-50x50': 600,
        '5t-clear-70x30': 600,
        '5t-clear-70x70': 1000,
        '5t-clear-50x100': 1000,
        '5t-clear-100x100': 1300,
        
        // 3T 인쇄 (배면)
        '3t-print-back-50x30': 1000,
        '3t-print-back-50x50': 1200,
        '3t-print-back-70x30': 1200,
        '3t-print-back-70x70': 1500,
        '3t-print-back-50x100': 1500,
        '3t-print-back-100x100': 2000,
        
        // 3T 인쇄 라미 (라미 사이즈는 약간 다름)
        '3t-print-lami-50x30': 1300,
        '3t-print-lami-50x50': 1600,
        '3t-print-lami-70x30': 1600,
        '3t-print-lami-65x65': 2200,
        '3t-print-lami-50x90': 2200,
        '3t-print-lami-90x90': 3200
      }
    }
  ]
};

// 라미 가격표
export const laminatedPricing: ProductPricing = {
  id: 'laminated',
  name: '라미',
  printTypes: [
    { id: 'single', name: '단면 인쇄', multiplier: 1.0 }
  ],
  sizes: [
    { id: '30x30', name: '30x30', dimension: '30x30mm' },
    { id: '40x40', name: '40x40', dimension: '40x40mm' },
    { id: '50x50', name: '50x50', dimension: '50x50mm' },
    { id: '60x60', name: '60x60', dimension: '60x60mm' }
  ],
  pricingTiers: [
    {
      quantityRange: '1~9개',
      minQuantity: 1,
      maxQuantity: 9,
      prices: {
        '30x30': 2800,
        '40x40': 3000,
        '50x50': 3200,
        '60x60': 3500
      }
    }
  ]
};

// 가격 계산 함수
export function calculatePrice(
  productId: string,
  printTypeId: string,
  sizeId: string,
  quantity: number
): { unitPrice: number; totalPrice: number; tier: string } | null {
  let pricing: ProductPricing;
  
  switch (productId) {
    case 'acrylic-coaster':
      pricing = acrylicCoasterPricing;
      break;
    case 'acrylic-keyring-3t':
      pricing = acrylicKeyringPricing;
      break;
    case 'photo-props-3t':
      pricing = photoPropsThreeTierPricing;
      break;
    case 'photo-props-laminated':
      pricing = photoPropsLaminatedPricing;
      break;
    case 'acrylic-stand-main':
      pricing = acrylicStandMainPricing;
      break;
    case 'laminated-keyring':
      pricing = laminatedKeyringPricing;
      break;
    case 'acrylic-magnetic':
      pricing = acrylicMagneticPricing;
      break;
    case 'acrylic-stand-base':
      pricing = acrylicStandBasePricing;
      break;
    case 'laminated':
      pricing = laminatedPricing;
      break;
    case 'keyring':
      pricing = acrylicKeyringPricing;
      break;
    default:
      return null;
  }

  // 수량에 맞는 가격 구간 찾기
  const tier = pricing.pricingTiers.find(
    t => quantity >= t.minQuantity && quantity <= t.maxQuantity
  );

  if (!tier) return null;

  // 아크릴 코롯토와 아크릴 스탠드(바닥판)의 경우 printType-size 조합으로 가격 찾기
  let unitPrice: number;
  if (productId === 'acrylic-coaster' || productId === 'acrylic-stand-base') {
    const priceKey = `${printTypeId}-${sizeId}`;
    unitPrice = tier.prices[priceKey];
    if (!unitPrice) return null;
  } else {
    // 키링 등 기존 방식 (multiplier 사용)
    const basePrice = tier.prices[sizeId];
    if (!basePrice) return null;

    const printType = pricing.printTypes.find(pt => pt.id === printTypeId);
    if (!printType) return null;

    unitPrice = Math.round(basePrice * printType.multiplier);
  }

  const totalPrice = unitPrice * quantity;

  return {
    unitPrice,
    totalPrice,
    tier: tier.quantityRange
  };
}

export const availableProducts = [
  acrylicCoasterPricing,
  acrylicKeyringPricing,
  photoPropsThreeTierPricing,
  photoPropsLaminatedPricing,
  acrylicStandMainPricing,
  laminatedKeyringPricing,
  acrylicMagneticPricing,
  acrylicStandBasePricing,
  laminatedPricing
];

// 아크릴 상품 매핑 (9개 상품만)
export const productPricingMap = new Map<string, string>([
  // 아크릴코롯 10T
  ['1', 'acrylic-coaster'],
  
  // 아크릴키링 3T  
  ['2', 'acrylic-keyring-3t'],
  
  // 포토프롭 3T
  ['3', 'photo-props-3t'],
  
  // 포토프(라미)
  ['4', 'photo-props-laminated'],
  
  // 아크릴스탠드(본품)
  ['5', 'acrylic-stand-main'],
  
  // 라미키링
  ['6', 'laminated-keyring'],
  
  // 아크릴 자석 냉장고 마그네틱
  ['7', 'acrylic-magnetic'],
  
  // 아크릴 스탠드(바닥판)
  ['8', 'acrylic-stand-base'],
  
  // 라미
  ['9', 'laminated'],
]);

// 상품 ID로 가격 정보 가져오기
export function getPricingByProductId(productId: string): ProductPricing | null {
  const pricingId = productPricingMap.get(productId);
  if (!pricingId) return null;
  
  return availableProducts.find(p => p.id === pricingId) || null;
}

// 상품이 새로운 가격 시스템을 지원하는지 확인
export function hasAdvancedPricing(productId: string): boolean {
  return productPricingMap.has(productId);
}

// 아크릴 상품 Slug 매핑 (9개 상품만)
export const productSlugMap = new Map<string, string>([
  // 아크릴코롯 10T
  ['acrylic-coaster-10t', '1'],
  
  // 아크릴키링 3T
  ['acrylic-keyring-3t', '2'],
  
  // 포토프롭 3T
  ['photo-props-3t', '3'],
  
  // 포토프(라미)
  ['photo-props-laminated', '4'],
  
  // 아크릴스탠드(본품)
  ['acrylic-stand-main', '5'],
  
  // 라미키링
  ['laminated-keyring', '6'],
  
  // 아크릴 자석 냉장고 마그네틱
  ['acrylic-magnetic', '7'],
  
  // 아크릴 스탠드(바닥판)
  ['acrylic-stand-base', '8'],
  
  // 라미
  ['laminated', '9'],
]);

// Slug로 상품 ID 찾기
export function getProductIdBySlug(slug: string): string | null {
  return productSlugMap.get(slug) || null;
}