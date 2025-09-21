'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface BannerTemplate {
  title: string;
  description: string;
  imageUrl: string;
  productIds: number[];
}

const bannerTemplates: BannerTemplate[] = [
  {
    title: '아크릴 키링 | 다양한 스타일과 색상으로 제작 가능',
    description: '내 마음대로 커스텀! 고품질 아크릴 키링',
    imageUrl: 'https://placehold.co/400x260/FFB6C1/333?text=아크릴+키링',
    productIds: [2, 6] // 아크릴키링 3T, 라미키링
  },
  {
    title: '아크릴 스탠드 | 캐릭터와 굿즈를 멋지게 세워보세요',
    description: '완벽한 각도로 디스플레이! 자립형 아크릴 스탠드',
    imageUrl: 'https://placehold.co/400x260/87CEEB/333?text=아크릴+스탠드',
    productIds: [5, 8] // 아크릴스탠드(본품), 아크릴 스탠드(바닥판)
  },
  {
    title: '아크릴 코스터 | 테이블을 보호하면서 예쁘게',
    description: '실용성과 아름다움을 동시에! 프리미엄 아크릴 코스터',
    imageUrl: 'https://placehold.co/400x260/98FB98/333?text=아크릴+코스터',
    productIds: [1, 7] // 아크릴코롯 10T, 아크릴 자석 냉장고 마그네틱
  }
];

export default function TestBannersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createBanners = async () => {
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "배너 생성을 위해 관리자 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      for (let i = 0; i < bannerTemplates.length; i++) {
        const template = bannerTemplates[i];

        const response = await fetch('/api/product-shelf-banners', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            title: template.title,
            description: template.description,
            imageUrl: template.imageUrl,
            sortOrder: i,
            productIds: template.productIds
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || `배너 ${i + 1} 생성 실패`);
        }

        console.log(`배너 ${i + 1} 생성 성공:`, result);
      }

      toast({
        title: "배너 생성 완료",
        description: `${bannerTemplates.length}개의 제품 선반 배너가 생성되었습니다.`,
      });

      // 페이지 새로고침을 제안
      setTimeout(() => {
        toast({
          title: "새로고침 권장",
          description: "메인 페이지로 이동하여 배너를 확인해보세요.",
        });
      }, 1000);

    } catch (error) {
      console.error('Banner creation error:', error);
      toast({
        title: "배너 생성 실패",
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const clearBanners = async () => {
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "배너 삭제를 위해 관리자 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      // 모든 배너 조회 후 삭제
      const response = await fetch('/api/product-shelf-banners');
      const result = await response.json();

      if (result.banners && result.banners.length > 0) {
        for (const banner of result.banners) {
          await fetch(`/api/product-shelf-banners/${banner.id}`, {
            method: 'DELETE',
            credentials: 'include'
          });
        }
      }

      toast({
        title: "배너 삭제 완료",
        description: "모든 제품 선반 배너가 삭제되었습니다.",
      });
    } catch (error) {
      toast({
        title: "배너 삭제 실패",
        description: "배너 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">관리자 로그인이 필요합니다</h2>
            <p className="text-gray-600 mb-6">제품 선반 배너를 관리하려면 관리자로 로그인해주세요.</p>
            <Button>로그인하기</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>제품 선반 배너 테스트</CardTitle>
          <p className="text-sm text-gray-600">
            메인 페이지 "단체 굿즈 합리적인 가격으로 예쁘게 만들어 드릴게요" 섹션의 배너를 관리합니다.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <Button
              onClick={createBanners}
              disabled={isCreating}
              className="flex-1"
            >
              {isCreating ? '생성 중...' : '테스트 배너 생성 (3개)'}
            </Button>
            <Button
              onClick={clearBanners}
              variant="destructive"
              disabled={isCreating}
            >
              모든 배너 삭제
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">생성될 배너 목록:</h3>
            {bannerTemplates.map((template, index) => (
              <Card key={index} className="p-4">
                <h4 className="font-medium text-sm mb-2">{template.title}</h4>
                <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                <p className="text-xs text-blue-600">
                  포함 상품 ID: {template.productIds.join(', ')}
                </p>
              </Card>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">📋 사용 방법:</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>관리자로 로그인된 상태에서 "테스트 배너 생성" 클릭</li>
              <li>메인 페이지로 이동하여 결과 확인</li>
              <li>각 배너는 2개의 상품을 표시합니다</li>
              <li>테스트 완료 후 "모든 배너 삭제"로 정리</li>
            </ol>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">⚠️ 주의사항:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>관리자 권한이 필요합니다</li>
              <li>데이터베이스에 배너가 없으면 mock 데이터로 fallback됩니다</li>
              <li>배너 생성 후 메인 페이지에서 확인하세요</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}