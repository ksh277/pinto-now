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
    { id: '100x50', name: '100x50', dimension: '100x50mm' },
    { id: '100x80', name: '100x80', dimension: '100x80mm' },
    { id: '140x50', name: '140x50', dimension: '140x50mm' },
    { id: '140x80', name: '140x80', dimension: '140x80mm' },
    { id: '200x50', name: '200x50', dimension: '200x50mm' },
    { id: '200x80', name: '200x80', dimension: '200x80mm' },
    { id: '230x50', name: '230x50', dimension: '230x50mm' },
    { id: '230x80', name: '230x80', dimension: '230x80mm' },
    { id: '270x50', name: '270x50', dimension: '270x50mm' },
    { id: '270x80', name: '270x80', dimension: '270x80mm' }
  ],
  pricingTiers: [
    {
      quantityRange: '1~9개',
      minQuantity: 1,
      maxQuantity: 9,
      prices: {
        '100x50': 5000,
        '100x80': 6000,
        '140x50': 5500,
        '140x80': 7000,
        '200x50': 7000,
        '200x80': 9200,
        '230x50': 7500,
        '230x80': 9000,
        '270x50': 8000,
        '270x80': 10000
      }
    },
    {
      quantityRange: '10~99개',
      minQuantity: 10,
      maxQuantity: 99,
      prices: {
        '100x50': 3500,
        '100x80': 4500,
        '140x50': 4000,
        '140x80': 5500,
        '200x50': 5500,
        '200x80': 8400,
        '230x50': 6000,
        '230x80': 7500,
        '270x50': 6500,
        '270x80': 8500
      }
    },
    {
      quantityRange: '100~499개',
      minQuantity: 100,
      maxQuantity: 499,
      prices: {
        '100x50': 2700,
        '100x80': 3700,
        '140x50': 3200,
        '140x80': 4700,
        '200x50': 4700,
        '200x80': 6900,
        '230x50': 5200,
        '230x80': 6700,
        '270x50': 5700,
        '270x80': 7700
      }
    },
    {
      quantityRange: '500~999개',
      minQuantity: 500,
      maxQuantity: 999,
      prices: {
        '100x50': 2000,
        '100x80': 3000,
        '140x50': 2500,
        '140x80': 4000,
        '200x50': 4000,
        '200x80': 6200,
        '230x50': 4500,
        '230x80': 6000,
        '270x50': 5000,
        '270x80': 7000
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
    { id: '100x50', name: '100x50', dimension: '100x50mm' },
    { id: '100x80', name: '100x80', dimension: '100x80mm' },
    { id: '140x50', name: '140x50', dimension: '140x50mm' },
    { id: '140x80', name: '140x80', dimension: '140x80mm' },
    { id: '200x50', name: '200x50', dimension: '200x50mm' },
    { id: '200x80', name: '200x80', dimension: '200x80mm' },
    { id: '230x50', name: '230x50', dimension: '230x50mm' },
    { id: '230x80', name: '230x80', dimension: '230x80mm' },
    { id: '270x50', name: '270x50', dimension: '270x50mm' },
    { id: '270x80', name: '270x80', dimension: '270x80mm' }
  ],
  pricingTiers: [
    {
      quantityRange: '1~9개',
      minQuantity: 1,
      maxQuantity: 9,
      prices: {
        '100x50': 6200,
        '100x80': 7500,
        '140x50': 6600,
        '140x80': 9000,
        '200x50': 8600,
        '200x80': 11000,
        '230x50': 9700,
        '230x80': 13000,
        '270x50': 10200,
        '270x80': 14000
      }
    },
    {
      quantityRange: '10~99개',
      minQuantity: 10,
      maxQuantity: 99,
      prices: {
        '100x50': 4700,
        '100x80': 6000,
        '140x50': 5100,
        '140x80': 7500,
        '200x50': 7100,
        '200x80': 9500,
        '230x50': 8200,
        '230x80': 11500,
        '270x50': 8700,
        '270x80': 12500
      }
    },
    {
      quantityRange: '100~499개',
      minQuantity: 100,
      maxQuantity: 499,
      prices: {
        '100x50': 3900,
        '100x80': 5200,
        '140x50': 4300,
        '140x80': 6700,
        '200x50': 6300,
        '200x80': 8700,
        '230x50': 7400,
        '230x80': 10700,
        '270x50': 7900,
        '270x80': 11700
      }
    },
    {
      quantityRange: '500~999개',
      minQuantity: 500,
      maxQuantity: 999,
      prices: {
        '100x50': 3200,
        '100x80': 4500,
        '140x50': 3600,
        '140x80': 6000,
        '200x50': 5600,
        '200x80': 8000,
        '230x50': 6700,
        '230x80': 10000,
        '270x50': 7200,
        '270x80': 11000
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
    { id: '35x50', name: '35x50', dimension: '35x50mm' },
    { id: '35x75', name: '35x75', dimension: '35x75mm' },
    { id: '50x50', name: '50x50', dimension: '50x50mm' },
    { id: '50x100', name: '50x100', dimension: '50x100mm' },
    { id: '70x70', name: '70x70', dimension: '70x70mm' },
    { id: '70x130', name: '70x130', dimension: '70x130mm' },
    { id: '70x150', name: '70x150', dimension: '70x150mm' },
    { id: '100x100', name: '100x100', dimension: '100x100mm' },
    { id: '100x150', name: '100x150', dimension: '100x150mm' },
    { id: '130x130', name: '130x130', dimension: '130x130mm' },
    { id: '150x150', name: '150x150', dimension: '150x150mm' }
  ],
  pricingTiers: [
    {
      quantityRange: '1~9개',
      minQuantity: 1,
      maxQuantity: 9,
      prices: {
        '35x50': 4300,
        '35x75': 4500,
        '50x50': 4500,
        '50x100': 4800,
        '70x70': 4800,
        '70x130': 6000,
        '70x150': 6500,
        '100x100': 6000,
        '100x150': 8000,
        '130x130': 8500,
        '150x150': 9000
      }
    },
    {
      quantityRange: '10~99개',
      minQuantity: 10,
      maxQuantity: 99,
      prices: {
        '35x50': 2200,
        '35x75': 2400,
        '50x50': 2400,
        '50x100': 2700,
        '70x70': 2700,
        '70x130': 3900,
        '70x150': 4400,
        '100x100': 3900,
        '100x150': 5900,
        '130x130': 6400,
        '150x150': 6900
      }
    },
    {
      quantityRange: '100~499개',
      minQuantity: 100,
      maxQuantity: 499,
      prices: {
        '35x50': 1700,
        '35x75': 1900,
        '50x50': 1900,
        '50x100': 2200,
        '70x70': 2200,
        '70x130': 3400,
        '70x150': 3900,
        '100x100': 3400,
        '100x150': 5400,
        '130x130': 5900,
        '150x150': 6400
      }
    },
    {
      quantityRange: '500~999개',
      minQuantity: 500,
      maxQuantity: 999,
      prices: {
        '35x50': 1300,
        '35x75': 1500,
        '50x50': 1500,
        '50x100': 1800,
        '70x70': 1800,
        '70x130': 3000,
        '70x150': 3500,
        '100x100': 3000,
        '100x150': 5000,
        '130x130': 5500,
        '150x150': 6000
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
        '20x20': 4300,
        '30x15': 4300,
        '30x30': 4500,
        '40x40': 4900,
        '50x30': 4900,
        '50x50': 5200,
        '60x30': 5000,
        '60x60': 5400,
        '70x35': 5200,
        '70x50': 5400,
        '70x70': 6100,
        '80x20': 4900,
        '80x40': 5300,
        '80x60': 6100,
        '90x30': 5300,
        '90x50': 5900,
        '90x70': 7000,
        '90x90': 7800,
        '100x20': 5300,
        '100x40': 6000
      }
    },
    {
      quantityRange: '10~99개',
      minQuantity: 10,
      maxQuantity: 99,
      prices: {
        '20x20': 2200,
        '30x15': 2200,
        '30x30': 2400,
        '40x40': 2800,
        '50x30': 2800,
        '50x50': 3100,
        '60x30': 2900,
        '60x60': 3300,
        '70x35': 3100,
        '70x50': 3300,
        '70x70': 4000,
        '80x20': 2800,
        '80x40': 3200,
        '80x60': 4000,
        '90x30': 3200,
        '90x50': 3800,
        '90x70': 4900,
        '90x90': 5700,
        '100x20': 3200,
        '100x40': 3900
      }
    },
    {
      quantityRange: '100~499개',
      minQuantity: 100,
      maxQuantity: 499,
      prices: {
        '20x20': 1700,
        '30x15': 1700,
        '30x30': 1900,
        '40x40': 2300,
        '50x30': 2300,
        '50x50': 2600,
        '60x30': 2400,
        '60x60': 2800,
        '70x35': 2600,
        '70x50': 2800,
        '70x70': 3500,
        '80x20': 2300,
        '80x40': 2700,
        '80x60': 3500,
        '90x30': 2700,
        '90x50': 3300,
        '90x70': 4400,
        '90x90': 5200,
        '100x20': 2700,
        '100x40': 3400
      }
    },
    {
      quantityRange: '500~999개',
      minQuantity: 500,
      maxQuantity: 999,
      prices: {
        '20x20': 1300,
        '30x15': 1300,
        '30x30': 1500,
        '40x40': 1900,
        '50x30': 1900,
        '50x50': 2200,
        '60x30': 2000,
        '60x60': 2400,
        '70x35': 2200,
        '70x50': 2400,
        '70x70': 3100,
        '80x20': 1900,
        '80x40': 2300,
        '80x60': 3100,
        '90x30': 2300,
        '90x50': 2900,
        '90x70': 4000,
        '90x90': 4800,
        '100x20': 2300,
        '100x40': 3000
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
        '20x20': 6700,
        '30x15': 6700,
        '30x30': 6900,
        '40x40': 7400,
        '50x30': 7400,
        '50x50': 7700,
        '60x30': 7500,
        '60x60': 7900,
        '70x35': 7700,
        '70x50': 7900,
        '70x70': 8400,
        '80x20': 7400,
        '80x40': 7800,
        '80x60': 8600,
        '90x30': 7800,
        '90x50': 8400,
        '90x70': 9500,
        '90x90': 10300,
        '100x20': 7800,
        '100x40': 8500
      }
    },
    {
      quantityRange: '10~99개',
      minQuantity: 10,
      maxQuantity: 99,
      prices: {
        '20x20': 2600,
        '30x15': 2600,
        '30x30': 2800,
        '40x40': 3300,
        '50x30': 3300,
        '50x50': 3600,
        '60x30': 3400,
        '60x60': 3800,
        '70x35': 3600,
        '70x50': 3800,
        '70x70': 4000,
        '80x20': 3000,
        '80x40': 3700,
        '80x60': 4200,
        '90x30': 3700,
        '90x50': 4300,
        '90x70': 5400,
        '90x90': 6200,
        '100x20': 3700,
        '100x40': 4400
      }
    },
    {
      quantityRange: '100~499개',
      minQuantity: 100,
      maxQuantity: 499,
      prices: {
        '20x20': 2100,
        '30x15': 2100,
        '30x30': 2300,
        '40x40': 2800,
        '50x30': 2800,
        '50x50': 3100,
        '60x30': 2900,
        '60x60': 3300,
        '70x35': 3100,
        '70x50': 3300,
        '70x70': 3800,
        '80x20': 2800,
        '80x40': 3200,
        '80x60': 4000,
        '90x30': 3200,
        '90x50': 3800,
        '90x70': 4900,
        '90x90': 5700,
        '100x20': 3200,
        '100x40': 3900
      }
    },
    {
      quantityRange: '500~999개',
      minQuantity: 500,
      maxQuantity: 999,
      prices: {
        '20x20': 1700,
        '30x15': 1700,
        '30x30': 1900,
        '40x40': 2400,
        '50x30': 2400,
        '50x50': 2700,
        '60x30': 2500,
        '60x60': 2900,
        '70x35': 2700,
        '70x50': 2900,
        '70x70': 3400,
        '80x20': 2400,
        '80x40': 2800,
        '80x60': 3600,
        '90x30': 2800,
        '90x50': 3400,
        '90x70': 4500,
        '90x90': 5300,
        '100x20': 2800,
        '100x40': 3500
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
    { id: '100x100', name: '100x100', dimension: '100x100mm' }
  ],
  pricingTiers: [
    {
      quantityRange: '기본',
      minQuantity: 1,
      maxQuantity: 999999,
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

        // 3T 인쇄 라미
        '3t-print-lami-50x30': 1300,
        '3t-print-lami-50x50': 1600,
        '3t-print-lami-70x30': 1600,
        '3t-print-lami-70x70': 2200,
        '3t-print-lami-50x100': 2200,
        '3t-print-lami-100x100': 3200
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
    { id: '30x50', name: '30x50', dimension: '30x50mm' },
    { id: '35x75', name: '35x75', dimension: '35x75mm' },
    { id: '50x50', name: '50x50', dimension: '50x50mm' },
    { id: '50x85', name: '50x85', dimension: '50x85mm' },
    { id: '65x65', name: '65x65', dimension: '65x65mm' },
    { id: '70x140', name: '70x140', dimension: '70x140mm' },
    { id: '90x90', name: '90x90', dimension: '90x90mm' },
    { id: '90x140', name: '90x140', dimension: '90x140mm' },
    { id: '140x140', name: '140x140', dimension: '140x140mm' }
  ],
  pricingTiers: [
    {
      quantityRange: '1~9개',
      minQuantity: 1,
      maxQuantity: 9,
      prices: {
        '30x50': 4600,
        '35x75': 4900,
        '50x50': 4900,
        '50x85': 5500,
        '65x65': 5500,
        '70x140': 7200,
        '90x90': 7200,
        '90x140': 9600,
        '140x140': 11500
      }
    },
    {
      quantityRange: '10~99개',
      minQuantity: 10,
      maxQuantity: 99,
      prices: {
        '30x50': 2500,
        '35x75': 2800,
        '50x50': 2800,
        '50x85': 3400,
        '65x65': 3400,
        '70x140': 5100,
        '90x90': 5100,
        '90x140': 7500,
        '140x140': 9400
      }
    },
    {
      quantityRange: '100~499개',
      minQuantity: 100,
      maxQuantity: 499,
      prices: {
        '30x50': 2000,
        '35x75': 2300,
        '50x50': 2300,
        '50x85': 2900,
        '65x65': 2900,
        '70x140': 4600,
        '90x90': 4600,
        '90x140': 7000,
        '140x140': 8900
      }
    },
    {
      quantityRange: '500~999개',
      minQuantity: 500,
      maxQuantity: 999,
      prices: {
        '30x50': 1600,
        '35x75': 1900,
        '50x50': 1900,
        '50x85': 2500,
        '65x65': 2500,
        '70x140': 4200,
        '90x90': 4200,
        '90x140': 6600,
        '140x140': 8500
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

// 모든 아크릴 상품 목록 가져오기 (admin에서 사용)
export function getAllAcrylicProducts() {
  const products = Array.from(productPricingMap.entries()).map(([productId, pricingId]) => {
    const pricingData = availableProducts.find(p => p.id === pricingId);
    if (!pricingData) {
      console.error(`Pricing data not found for productId: ${productId}, pricingId: ${pricingId}`);
      return null;
    }

    return {
      id: productId,
      nameKo: pricingData.name,
      nameEn: pricingData.name,
      descriptionKo: `고품질 ${pricingData.name}를 다양한 사이즈와 옵션으로 제작합니다.`,
      descriptionEn: `High-quality ${pricingData.name} available in various sizes and options.`,
      imageUrl: "/components/img/placeholder-product.jpg",
      categoryId: "1", // 아크릴 굿즈 카테고리
      categoryKo: "아크릴 굿즈",
      categoryEn: "Acrylic Goods",
      subcategory: '',
      isPublished: true,
      isFeatured: false,
      status: 'ACTIVE',
      stockQuantity: 999,
      pricingData: pricingData,
      priceKrw: pricingData.pricingTiers[0]?.prices ? Math.min(...Object.values(pricingData.pricingTiers[0].prices).filter(p => p > 0)) : 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }).filter(Boolean);

  console.log(`getAllAcrylicProducts: Found ${products.length} products out of ${productPricingMap.size} expected`);
  return products;
}