'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableIcon, ExternalLink } from 'lucide-react';

interface PricingTier {
  name: string;
  type: string;
  minQuantity?: number;
  maxQuantity?: number;
  prices: Record<string, Record<string, number>>;
}

interface Size {
  id: string;
  name: string;
  dimension: string;
}

interface PricingTableModalProps {
  productName: string;
  sizes: Size[];
  pricingTiers: PricingTier[];
  printTypes?: Array<{ id: string; name: string; multiplier: number }>;
}

export default function PricingTableModal({
  productName,
  sizes,
  pricingTiers,
  printTypes
}: PricingTableModalProps) {
  const [selectedPrintType, setSelectedPrintType] = useState(printTypes?.[0]?.id || pricingTiers?.[0]?.type || 'single');

  // 수량 구간 정의 (pricing-data.ts와 일치)
  const quantityRanges = [
    { key: '1~9개', label: '1~9개', min: 1, max: 9 },
    { key: '10~99개', label: '10~99개', min: 10, max: 99 },
    { key: '100~499개', label: '100~499개', min: 100, max: 499 },
    { key: '500~999개', label: '500~999개', min: 500, max: 999 }
  ];

  const getPriceForSizeAndQuantity = (sizeId: string, quantityKey: string) => {
    // 수량 범위에 해당하는 티어 찾기 (새로운 구조)
    const quantityTier = pricingTiers.find(t =>
      t.quantityRange === quantityKey ||
      t.name === quantityKey ||
      (t.minQuantity && t.maxQuantity && quantityRanges.find(r => r.key === quantityKey && r.min >= t.minQuantity && r.max <= t.maxQuantity))
    );

    if (quantityTier) {
      // pricing-data.ts 구조: 'single-30x30' 형태의 키
      const priceKey = `${selectedPrintType}-${sizeId}`;
      return quantityTier.prices[priceKey] || null;
    }

    // 기존 구조 지원
    const tier = pricingTiers.find(t => t.type === selectedPrintType);
    if (!tier || !tier.prices || !tier.prices[sizeId]) return null;

    return tier.prices[sizeId][quantityKey] || null;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <TableIcon className="w-4 h-4" />
          가격표 보기
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TableIcon className="w-5 h-5" />
            {productName} - 사이즈/수량별 가격표
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 인쇄 방식 선택 */}
          {pricingTiers.length > 1 && (
            <div>
              <h3 className="text-sm font-medium mb-3">인쇄 방식 선택</h3>
              <div className="flex flex-wrap gap-2">
                {pricingTiers.map((tier) => (
                  <Button
                    key={tier.type}
                    variant={selectedPrintType === tier.type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPrintType(tier.type)}
                  >
                    {tier.name.includes('-') ? tier.name.split('-')[1].trim() : tier.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* 가격표 */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-3 text-left font-medium">
                    사이즈
                  </th>
                  {quantityRanges.map((range) => (
                    <th key={range.key} className="border border-gray-300 p-3 text-center font-medium">
                      <div>{range.label}</div>
                      <div className="text-xs text-gray-500 font-normal">
                        (개당 가격)
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizes.map((size) => (
                  <tr key={size.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 font-medium bg-gray-50">
                      <div>{size.name}</div>
                      <div className="text-xs text-gray-500">{size.dimension}</div>
                    </td>
                    {quantityRanges.map((range) => {
                      const price = getPriceForSizeAndQuantity(size.id, range.key);
                      return (
                        <td key={range.key} className="border border-gray-300 p-3 text-center">
                          {price ? (
                            <div className="font-medium text-blue-600">
                              {price.toLocaleString()}원
                            </div>
                          ) : (
                            <div className="text-gray-400">-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 안내 사항 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 가격 안내</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 위 가격은 개당 단가입니다 (부가세 별도)</li>
              <li>• 수량이 많을수록 단가가 저렴해집니다</li>
              <li>• 별도 옵션 (OPP포장, 마그네틱 등)은 추가 비용이 발생합니다</li>
              <li>• 정확한 견적은 옵션 선택 후 확인 가능합니다</li>
            </ul>
          </div>

          {/* 바로 주문하기 링크 */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              원하는 사이즈와 수량을 선택하여 주문하세요
            </div>
            <Button className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              바로 주문하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}