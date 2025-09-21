import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyRequestAuth } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const authUser = await verifyRequestAuth(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    console.log('🎯 아크릴 상품 마이그레이션 시작...');

    // 아크릴 상품들 조회 (카테고리 ID = 1)
    const products = await query(`
      SELECT id, name_ko
      FROM products
      WHERE category_id = 1
      ORDER BY id
      LIMIT 9
    `) as any[];

    console.log(`✅ 발견된 아크릴 상품: ${products.length}개`);

    const results = [];

    // 각 상품에 대해 업그레이드 수행
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`🔧 ${i + 1}/${products.length} 업그레이드 중: ${product.name_ko}`);

      // 상품별 이미지 URL 설정
      const imageUrls = {
        description: `https://picsum.photos/800/600?random=${product.id + 100}`,
        additional: [
          `https://picsum.photos/600/600?random=${product.id + 200}`,
          `https://picsum.photos/600/600?random=${product.id + 300}`
        ]
      };

      // 향상된 가격 데이터 구조
      const enhancedPricingData = {
        hasPrintOptions: true,
        printTypes: [
          { id: "single", name: "단면 인쇄", priceMultiplier: 1.0 },
          { id: "double", name: "양면 인쇄", priceMultiplier: 1.2 }
        ],
        sizes: [
          { id: "40x40", name: "40x40mm" },
          { id: "50x50", name: "50x50mm" },
          { id: "60x60", name: "60x60mm" },
          { id: "80x80", name: "80x80mm" }
        ],
        pricingTiers: [
          {
            quantityRange: "1-10개",
            minQuantity: 1,
            maxQuantity: 10,
            prices: {
              "40x40": 2000,
              "50x50": 2500,
              "60x60": 3000,
              "80x80": 4000
            }
          },
          {
            quantityRange: "11-50개",
            minQuantity: 11,
            maxQuantity: 50,
            prices: {
              "40x40": 1800,
              "50x50": 2200,
              "60x60": 2700,
              "80x80": 3600
            }
          },
          {
            quantityRange: "51-100개",
            minQuantity: 51,
            maxQuantity: 100,
            prices: {
              "40x40": 1600,
              "50x50": 2000,
              "60x60": 2400,
              "80x80": 3200
            }
          }
        ],
        defaultOptions: [
          {
            id: "uv_print",
            name: "UV 인쇄",
            description: "내구성이 뛰어난 UV 인쇄",
            price: 500,
            unit: "per_item"
          },
          {
            id: "opp_packaging",
            name: "OPP 포장",
            description: "개별 OPP 포장",
            price: 200,
            unit: "per_item"
          },
          {
            id: "design_cost",
            name: "디자인 비용",
            description: "전문 디자인 작업",
            price: 50000,
            unit: "per_order"
          },
          {
            id: "shipping_fee",
            name: "배송비",
            description: "전국 배송비",
            price: 3000,
            unit: "per_order"
          }
        ]
      };

      // product_details 테이블에 향상된 데이터 삽입/업데이트
      const detailData = {
        descriptionImageUrl: imageUrls.description,
        additionalImages: imageUrls.additional,
        pricingData: enhancedPricingData,
        lastUpdated: new Date().toISOString()
      };

      // 기존 product_details 확인
      const existingDetail = await query(
        'SELECT id FROM product_details WHERE product_id = ?',
        [product.id]
      ) as any[];

      if (existingDetail.length > 0) {
        // 업데이트
        await query(
          'UPDATE product_details SET detail_data = ? WHERE product_id = ?',
          [JSON.stringify(detailData), product.id]
        );
        console.log(`   ✅ product_details 업데이트 완료`);
      } else {
        // 새로 삽입
        await query(
          'INSERT INTO product_details (product_id, detail_data) VALUES (?, ?)',
          [product.id, JSON.stringify(detailData)]
        );
        console.log(`   ✅ product_details 신규 생성 완료`);
      }

      results.push({
        productId: product.id,
        productName: product.name_ko,
        status: 'updated',
        features: {
          descriptionImage: true,
          additionalImages: imageUrls.additional.length,
          printOptions: true,
          pricingTiers: enhancedPricingData.pricingTiers.length,
          defaultOptions: enhancedPricingData.defaultOptions.length
        }
      });

      // 짧은 대기 시간
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('🎉 모든 아크릴 상품 마이그레이션 완료!');

    return NextResponse.json({
      success: true,
      message: '아크릴 상품 마이그레이션이 완료되었습니다.',
      results: {
        totalProcessed: products.length,
        successful: results.length,
        products: results
      },
      addedFeatures: [
        '📸 설명 이미지 (각 상품별 고유)',
        '🖼️ 추가 이미지 2개 (갤러리)',
        '💰 복잡한 가격 계산 (사이즈 × 수량)',
        '🎨 인쇄 옵션 (단면/양면)',
        '⭐ 추가 옵션 (UV인쇄, OPP포장, 디자인비용, 배송비)',
        '📊 3단계 가격 구간 (1-10, 11-50, 51-100개)',
        '🔧 4가지 사이즈 옵션'
      ]
    });

  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';