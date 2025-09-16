'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const testProductTemplates = {
  acrylic: {
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
  },
  paper: {
    nameKo: "테스트 지류 포스터",
    nameEn: "Test Paper Poster",
    descriptionKo: "테스트용 지류 포스터입니다. 다양한 종이 옵션과 가격 계산을 테스트하기 위한 상품입니다.",
    descriptionEn: "Test paper poster for testing various paper options and price calculations.",
    imageUrl: "/components/img/placeholder-product.jpg",
    categoryId: "paper-goods",
    subcategory: "poster",
    isPublished: true,
    isFeatured: false,
    status: "active",
    stockQuantity: 1000,
    enablePrintTypes: true,
    printTypes: [
      { id: "matte", name: "무광 인쇄", multiplier: 1.0 },
      { id: "glossy", name: "유광 인쇄", multiplier: 1.1 },
      { id: "premium", name: "프리미엄 인쇄", multiplier: 1.3 }
    ],
    sizes: [
      { id: "a4", name: "A4", dimension: "210x297mm" },
      { id: "a3", name: "A3", dimension: "297x420mm" },
      { id: "a2", name: "A2", dimension: "420x594mm" },
      { id: "b2", name: "B2", dimension: "515x728mm" }
    ],
    pricingTiers: [
      {
        quantityRange: "1~9개",
        minQuantity: 1,
        maxQuantity: 9,
        prices: {
          "matte-a4": 3000,
          "matte-a3": 5000,
          "matte-a2": 8000,
          "matte-b2": 12000,
          "glossy-a4": 3300,
          "glossy-a3": 5500,
          "glossy-a2": 8800,
          "glossy-b2": 13200,
          "premium-a4": 3900,
          "premium-a3": 6500,
          "premium-a2": 10400,
          "premium-b2": 15600
        }
      },
      {
        quantityRange: "10~99개",
        minQuantity: 10,
        maxQuantity: 99,
        prices: {
          "matte-a4": 2500,
          "matte-a3": 4200,
          "matte-a2": 6800,
          "matte-b2": 10200,
          "glossy-a4": 2750,
          "glossy-a3": 4620,
          "glossy-a2": 7480,
          "glossy-b2": 11220,
          "premium-a4": 3250,
          "premium-a3": 5460,
          "premium-a2": 8840,
          "premium-b2": 13260
        }
      },
      {
        quantityRange: "100~499개",
        minQuantity: 100,
        maxQuantity: 499,
        prices: {
          "matte-a4": 2000,
          "matte-a3": 3500,
          "matte-a2": 5600,
          "matte-b2": 8400,
          "glossy-a4": 2200,
          "glossy-a3": 3850,
          "glossy-a2": 6160,
          "glossy-b2": 9240,
          "premium-a4": 2600,
          "premium-a3": 4550,
          "premium-a2": 7280,
          "premium-b2": 10920
        }
      },
      {
        quantityRange: "500~999개",
        minQuantity: 500,
        maxQuantity: 999,
        prices: {
          "matte-a4": 1500,
          "matte-a3": 2800,
          "matte-a2": 4400,
          "matte-b2": 6600,
          "glossy-a4": 1650,
          "glossy-a3": 3080,
          "glossy-a2": 4840,
          "glossy-b2": 7260,
          "premium-a4": 1950,
          "premium-a3": 3640,
          "premium-a2": 5720,
          "premium-b2": 8580
        }
      }
    ],
    customOptions: [
      { name: "라미네이팅", price: 1000 },
      { name: "코팅", price: 500 },
      { name: "접착 옵션", price: 300 }
    ]
  }
};

export default function TestProductPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductType, setSelectedProductType] = useState<'acrylic' | 'paper'>('paper');

  const createTestProduct = async (productType: 'acrylic' | 'paper') => {
    setIsCreating(true);
    setMessage('');

    const testProductData = testProductTemplates[productType];

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testProductData)
      });

      if (response.ok) {
        const result = await response.json();
        setCreatedProductId(result.id);
        setMessage(`✅ 테스트 상품이 성공적으로 생성되었습니다! ID: ${result.id}`);
        fetchProducts(); // 상품 목록 새로고침
      } else {
        const error = await response.json();
        setMessage(`❌ 상품 생성 실패: ${error.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      setMessage(`❌ 요청 실패: ${error}`);
    } finally {
      setIsCreating(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage(`✅ 상품 ID ${productId}가 성공적으로 삭제되었습니다!`);
        setCreatedProductId(null);
        fetchProducts(); // 상품 목록 새로고침
      } else {
        const error = await response.json();
        setMessage(`❌ 상품 삭제 실패: ${error.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      setMessage(`❌ 삭제 요청 실패: ${error}`);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const result = await response.json();
        setProducts(result.products || []);
      }
    } catch (error) {
      console.error('상품 조회 실패:', error);
    }
  };

  // 컴포넌트 마운트 시 상품 목록 조회
  useState(() => {
    fetchProducts();
  });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>테스트 상품 관리</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">테스트 상품 생성</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Button
                onClick={() => createTestProduct('acrylic')}
                disabled={isCreating}
                variant="outline"
              >
                {isCreating ? '생성 중...' : '아크릴 테스트 상품 생성'}
              </Button>
              <Button
                onClick={() => createTestProduct('paper')}
                disabled={isCreating}
                className="bg-green-600 hover:bg-green-700"
              >
                {isCreating ? '생성 중...' : '지류 테스트 상품 생성'}
              </Button>
            </div>

            {message && (
              <div className={`p-4 rounded ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message}
              </div>
            )}
          </div>

          {createdProductId && (
            <div>
              <h3 className="text-lg font-semibold mb-4">생성된 테스트 상품</h3>
              <div className="flex gap-4">
                <Button
                  onClick={() => window.open(`/products/${createdProductId}`, '_blank')}
                  variant="outline"
                >
                  상품 페이지 보기
                </Button>
                <Button
                  onClick={() => deleteProduct(createdProductId)}
                  variant="destructive"
                >
                  테스트 상품 삭제
                </Button>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-4">현재 상품 목록</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {products.map((product) => (
                <div key={product.id} className="flex justify-between items-center p-2 border rounded">
                  <span>{product.nameKo} (ID: {product.id})</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`/products/${product.id}`, '_blank')}
                    >
                      보기
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteProduct(product.id)}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded">
            <h4 className="font-semibold mb-2">지류 상품 테스트 방법:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li><strong>"지류 테스트 상품 생성"</strong> 버튼을 클릭하여 상품을 생성합니다</li>
              <li>"상품 페이지 보기"를 클릭하여 상품 상세페이지로 이동합니다</li>
              <li><strong>인쇄 방식 선택:</strong> 무광/유광/프리미엄 중 선택</li>
              <li><strong>사이즈 선택:</strong> A4/A3/A2/B2 중 선택</li>
              <li><strong>수량을 101개로 설정</strong> (100개 이상 할인 가격 적용 확인)</li>
              <li>가격이 올바르게 계산되는지 확인합니다</li>
              <li>추가 옵션 (라미네이팅, 코팅, 접착 옵션) 테스트</li>
              <li>장바구니에 담기를 테스트합니다</li>
              <li>테스트 완료 후 "테스트 상품 삭제" 버튼으로 정리합니다</li>
            </ol>

            <div className="mt-4 p-3 bg-green-50 rounded">
              <h5 className="font-medium text-green-800 mb-1">지류 상품 특징:</h5>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• 인쇄 방식: 무광(1.0배), 유광(1.1배), 프리미엄(1.3배)</li>
                <li>• 사이즈: A4부터 B2까지 4가지</li>
                <li>• 수량별 할인: 100개 이상 최대 25% 할인</li>
                <li>• 추가 옵션: 라미네이팅(+1000원), 코팅(+500원), 접착(+300원)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}