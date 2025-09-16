'use client';

import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
// import { useI18n } from '@/contexts/i18n-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus } from 'lucide-react';

type QuantityTier = {
  name: string;
  min: number;
  max: number;
};

type Size = {
  id: string;
  name: string;
  dimension: string;
};

type PriceGrid = {
  [sizeId: string]: {
    [tierName: string]: {
      single?: number;
      double?: number;
      base?: number;
    }
  }
};

type DefaultOption = {
  id: string;
  name: string;
  price: number;
  unit: 'per_item' | 'per_order';
  enabled: boolean;
};

type CustomOption = {
  name: string;
  price: number;
  unit: 'per_item' | 'per_order';
};

type ProductFormData = {
  nameKo: string;
  nameEn: string;
  descriptionKo: string;
  descriptionEn: string;
  image: string;
  categoryId: string;
  subcategory: string;
  isPublished: boolean;
  isFeatured: boolean;
  status: string;
  stockQuantity: number;
  hasPrintOptions: boolean;
  sizes: Size[];
  quantityTiers: QuantityTier[];
  priceGrid: PriceGrid;
  defaultOptions: DefaultOption[];
  customOptions: CustomOption[];
};

interface ProductFormProps {
  product?: any;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  // const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: Partial<ProductFormData> = {
    nameEn: product?.nameEn || product?.nameKo || '',
    nameKo: product?.nameKo || product?.nameEn || '',
    descriptionEn: product?.descriptionEn || product?.descriptionKo || '',
    descriptionKo: product?.descriptionKo || product?.descriptionEn || '',
    image: product?.imageUrl || '',
    categoryId: product?.categoryId || 'akril-goods',
    subcategory: product?.subcategory || 'keyring',
    isFeatured: product?.isFeatured || false,
    isPublished: product?.isPublished !== undefined ? product.isPublished : true,
    status: product?.status || 'active',
    hasPrintOptions: product?.pricingData?.printTypes ? product.pricingData.printTypes.length > 0 : false,
    stockQuantity: product?.stockQuantity || 0,
    // 상품에 pricing data가 있으면 사용, 없으면 기본값
    sizes: product?.pricingData?.sizes || [
      { id: '30x30', name: '30x30', dimension: '30x30mm' },
      { id: '50x50', name: '50x50', dimension: '50x50mm' }
    ],
    quantityTiers: product?.pricingData?.pricingTiers?.map((tier: any) => ({
      name: tier.name,
      min: tier.min,
      max: tier.max
    })) || [
      { name: '1~9개', min: 1, max: 9 },
      { name: '10~99개', min: 10, max: 99 },
      { name: '100~499개', min: 100, max: 499 },
      { name: '500개+', min: 500, max: 999999 }
    ],
    priceGrid: product?.pricingData?.pricingTiers ?
      Object.fromEntries(
        product.pricingData.sizes?.map((size: any) => [
          size.id,
          Object.fromEntries(
            product.pricingData!.pricingTiers.map((tier: any) => [
              tier.name,
              tier.prices || {}
            ])
          )
        ]) || []
      ) : {},
    defaultOptions: product?.pricingData?.customOptions || [
      { id: 'opp', name: 'OPP포장', price: 100, unit: 'per_item', enabled: true },
      { id: 'interleaving', name: '간지출력', price: 200, unit: 'per_item', enabled: true },
      { id: 'magnetic_add', name: '마그네틱추가', price: 200, unit: 'per_item', enabled: true },
      { id: 'magnetic_embed', name: '마그네틱매립', price: 400, unit: 'per_item', enabled: true },
      { id: 'keyring_add', name: '키링추가', price: 300, unit: 'per_item', enabled: true },
      { id: 'design_cost', name: '디자인비용(인쇄)', price: 50000, unit: 'per_order', enabled: true }
    ],
    customOptions: []
  };

  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<ProductFormData>({ defaultValues });

  // 상품 데이터가 변경될 때 폼 리셋
  useEffect(() => {
    if (product) {
      const updatedValues: Partial<ProductFormData> = {
        nameEn: product?.nameEn || product?.nameKo || '',
        nameKo: product?.nameKo || product?.nameEn || '',
        descriptionEn: product?.descriptionEn || product?.descriptionKo || '',
        descriptionKo: product?.descriptionKo || product?.descriptionEn || '',
        image: product?.imageUrl || '',
        categoryId: product?.categoryId || 'akril-goods',
        subcategory: product?.subcategory || 'keyring',
        isFeatured: product?.isFeatured || false,
        isPublished: product?.isPublished !== undefined ? product.isPublished : true,
        status: product?.status || 'active',
        hasPrintOptions: product?.pricingData?.printTypes ? product.pricingData.printTypes.length > 0 : false,
        stockQuantity: product?.stockQuantity || 0,
        sizes: product?.pricingData?.sizes || defaultValues.sizes,
        quantityTiers: product?.pricingData?.pricingTiers?.map((tier: any) => ({
          name: tier.name,
          min: tier.min,
          max: tier.max
        })) || defaultValues.quantityTiers,
        priceGrid: product?.pricingData?.pricingTiers ?
          Object.fromEntries(
            product.pricingData.sizes?.map((size: any) => [
              size.id,
              Object.fromEntries(
                product.pricingData!.pricingTiers.map((tier: any) => [
                  tier.name,
                  tier.prices || {}
                ])
              )
            ]) || []
          ) : {},
        defaultOptions: product?.pricingData?.customOptions || defaultValues.defaultOptions,
        customOptions: []
      };
      reset(updatedValues);
    }
  }, [product, reset]);

  const {
    fields: sizeFields,
    append: appendSize,
    remove: removeSize
  } = useFieldArray({ control, name: 'sizes' });

  const {
    fields: quantityTierFields,
    append: appendQuantityTier,
    remove: removeQuantityTier
  } = useFieldArray({ control, name: 'quantityTiers' });

  const {
    fields: defaultOptionFields,
    update: updateDefaultOption
  } = useFieldArray({ control, name: 'defaultOptions' });

  const {
    fields: customOptionFields,
    append: appendCustomOption,
    remove: removeCustomOption
  } = useFieldArray({ control, name: 'customOptions' });

  const watchedSizes = watch('sizes');
  const watchedQuantityTiers = watch('quantityTiers');
  const hasPrintOptions = watch('hasPrintOptions');
  const priceGrid = watch('priceGrid');

  const updatePriceGrid = (sizeId: string, tierName: string, printType: string, value: number) => {
    const currentGrid = priceGrid || {};
    if (!currentGrid[sizeId]) {
      currentGrid[sizeId] = {};
    }
    if (!currentGrid[sizeId][tierName]) {
      currentGrid[sizeId][tierName] = {};
    }
    // Type-safe property assignment
    if (printType === 'single' || printType === 'double' || printType === 'base') {
      currentGrid[sizeId][tierName][printType] = value;
    }
    setValue('priceGrid', currentGrid);
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    try {
      // 최소 가격 계산
      let minPrice = 0;
      if (data.priceGrid) {
        const allPrices: number[] = [];
        Object.values(data.priceGrid).forEach(sizeData => {
          Object.values(sizeData).forEach(tierData => {
            Object.values(tierData).forEach(price => {
              if (typeof price === 'number' && price > 0) {
                allPrices.push(price);
              }
            });
          });
        });
        minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
      }

      const productData = {
        nameKo: data.nameKo,
        nameEn: data.nameEn,
        descriptionKo: data.descriptionKo,
        descriptionEn: data.descriptionEn,
        imageUrl: data.image,
        categoryId: data.categoryId,
        subcategory: data.subcategory,
        isPublished: data.isPublished,
        isFeatured: data.isFeatured,
        status: data.status,
        hasPrintOptions: data.hasPrintOptions,
        sizes: data.sizes,
        quantityTiers: data.quantityTiers,
        priceGrid: data.priceGrid,
        defaultOptions: data.defaultOptions,
        customOptions: data.customOptions,
        stockQuantity: data.stockQuantity || 999,
        pricingTiers: [], // 호환성을 위한 빈 배열
        printTypes: [] // 호환성을 위한 빈 배열
      };

      const token = localStorage.getItem('auth_token') || 'dummy-token';
      const url = product ? `/api/products/${product.id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        alert('상품 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('상품 저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{product ? '상품 수정' : '새 상품 생성'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">기본 정보</TabsTrigger>
                <TabsTrigger value="sizes">사이즈 & 수량</TabsTrigger>
                <TabsTrigger value="pricing">가격표</TabsTrigger>
                <TabsTrigger value="options">옵션</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="nameKo">상품명 (한국어)</Label>
                    <Input id="nameKo" {...register('nameKo', { required: true })} />
                    {errors.nameKo && <p className="text-destructive text-sm mt-1">이 필드는 필수입니다</p>}
                  </div>
                  <div>
                    <Label htmlFor="nameEn">상품명 (영어)</Label>
                    <Input id="nameEn" {...register('nameEn')} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="descriptionKo">설명 (한국어)</Label>
                  <Textarea id="descriptionKo" {...register('descriptionKo')} />
                </div>

                <div>
                  <Label htmlFor="descriptionEn">설명 (영어)</Label>
                  <Textarea id="descriptionEn" {...register('descriptionEn')} />
                </div>

                <div>
                  <Label htmlFor="image">이미지 URL</Label>
                  <Input id="image" {...register('image', { required: true })} />
                  {errors.image && <p className="text-destructive text-sm mt-1">이 필드는 필수입니다</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="categoryId">카테고리</Label>
                    <Controller
                      name="categoryId"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">ALL</SelectItem>
                            <SelectItem value="custom-product-view">커스텀상품(제품뷰)</SelectItem>
                            <SelectItem value="promo-product-view">단체판촉상품(제품뷰)</SelectItem>
                            <SelectItem value="ip-goods-dev">IP굿즈 상품개발</SelectItem>
                            <SelectItem value="brand-request">브랜드의뢰</SelectItem>
                            <SelectItem value="reviews">리뷰</SelectItem>
                            <SelectItem value="guide">상품주문 가이드</SelectItem>
                            <SelectItem value="fan-goods">팬굿즈</SelectItem>
                            <SelectItem value="akril-goods">아크릴 굿즈</SelectItem>
                            <SelectItem value="paper-goods">지류 굿즈</SelectItem>
                            <SelectItem value="sticker">스티커(다꾸)</SelectItem>
                            <SelectItem value="pin-button">핀거믹/버튼</SelectItem>
                            <SelectItem value="life-size-standee">등신대</SelectItem>
                            <SelectItem value="etc">ETC</SelectItem>
                            <SelectItem value="promo">단체 판촉상품</SelectItem>
                            <SelectItem value="mug-glass">머그컵/유리컵</SelectItem>
                            <SelectItem value="tumbler">텀블러</SelectItem>
                            <SelectItem value="towel">수건</SelectItem>
                            <SelectItem value="clock">시계</SelectItem>
                            <SelectItem value="umbrella">우산</SelectItem>
                            <SelectItem value="clothing">의류</SelectItem>
                            <SelectItem value="signage">광고물/사인</SelectItem>
                            <SelectItem value="led-neon">LED 네온</SelectItem>
                            <SelectItem value="env-design">환경디자인</SelectItem>
                            <SelectItem value="mini-sign">미니간판</SelectItem>
                            <SelectItem value="pet">반려동물</SelectItem>
                            <SelectItem value="frame-goods">액자/소품/네임택</SelectItem>
                            <SelectItem value="cushion-fabric">쿠션/방석/패브릭 제품</SelectItem>
                            <SelectItem value="funeral">장례용품</SelectItem>
                            <SelectItem value="office">오피스</SelectItem>
                            <SelectItem value="packing-supplies">포장용품</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">상태</Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">활성</SelectItem>
                            <SelectItem value="draft">초안</SelectItem>
                            <SelectItem value="inactive">비활성</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stockQuantity">재고 수량</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      {...register('stockQuantity', { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="isPublished"
                      control={control}
                      render={({ field }) => (
                        <Checkbox id="isPublished" checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                    <Label htmlFor="isPublished">공개</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="isFeatured"
                      control={control}
                      render={({ field }) => (
                        <Checkbox id="isFeatured" checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                    <Label htmlFor="isFeatured">추천 상품</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="hasPrintOptions"
                      control={control}
                      render={({ field }) => (
                        <Checkbox id="hasPrintOptions" checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                    <Label htmlFor="hasPrintOptions">인쇄 옵션 사용 (단면/양면)</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sizes" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">사이즈 설정</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendSize({ id: '', name: '', dimension: '' })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      사이즈 추가
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {sizeFields.map((field, index) => (
                      <Card key={field.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">사이즈 {index + 1}</h4>
                            {sizeFields.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeSize(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                              <Label>ID (예: 50x50)</Label>
                              <Input {...register(`sizes.${index}.id` as const, { required: true })} />
                            </div>
                            <div>
                              <Label>이름 (예: 50x50)</Label>
                              <Input {...register(`sizes.${index}.name` as const, { required: true })} />
                            </div>
                            <div>
                              <Label>규격 (예: 50x50mm)</Label>
                              <Input {...register(`sizes.${index}.dimension` as const, { required: true })} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">수량 구간 설정</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendQuantityTier({ name: '', min: 0, max: 0 })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      수량 구간 추가
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {quantityTierFields.map((field, index) => (
                      <Card key={field.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">수량 구간 {index + 1}</h4>
                            {quantityTierFields.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeQuantityTier(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                              <Label>구간명 (예: 1~9개)</Label>
                              <Input {...register(`quantityTiers.${index}.name` as const, { required: true })} />
                            </div>
                            <div>
                              <Label>최소 수량</Label>
                              <Input type="number" {...register(`quantityTiers.${index}.min` as const, { required: true, valueAsNumber: true })} />
                            </div>
                            <div>
                              <Label>최대 수량</Label>
                              <Input type="number" {...register(`quantityTiers.${index}.max` as const, { required: true, valueAsNumber: true })} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">가격표 (Excel 형태)</h3>
                  <p className="text-sm text-gray-600 mb-4">왼쪽에 사이즈, 위쪽에 수량 구간, 중간에 가격을 입력하세요.</p>

                  {watchedSizes && watchedQuantityTiers && watchedSizes.length > 0 && watchedQuantityTiers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 p-3 text-left">사이즈</th>
                            {watchedQuantityTiers.map((tier, index) => (
                              <th key={index} className="border border-gray-300 p-3 text-center">
                                {tier.name}
                                <br />
                                <span className="text-xs text-gray-500">({tier.min}~{tier.max}개)</span>
                                {hasPrintOptions && (
                                  <div className="mt-1 text-xs text-gray-600">
                                    <div>단면 | 양면</div>
                                  </div>
                                )}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {watchedSizes.map((size, sizeIndex) => (
                            <tr key={sizeIndex}>
                              <td className="border border-gray-300 p-3 font-medium bg-gray-50">
                                {size.name}
                                <br />
                                <span className="text-xs text-gray-500">{size.dimension}</span>
                              </td>
                              {watchedQuantityTiers.map((tier, tierIndex) => (
                                <td key={tierIndex} className="border border-gray-300 p-2">
                                  {hasPrintOptions ? (
                                    <div className="grid grid-cols-2 gap-1">
                                      <Input
                                        type="number"
                                        placeholder="단면"
                                        className="text-xs h-8"
                                        value={priceGrid?.[size.id]?.[tier.name]?.single || ''}
                                        onChange={(e) => updatePriceGrid(size.id, tier.name, 'single', Number(e.target.value))}
                                      />
                                      <Input
                                        type="number"
                                        placeholder="양면"
                                        className="text-xs h-8"
                                        value={priceGrid?.[size.id]?.[tier.name]?.double || ''}
                                        onChange={(e) => updatePriceGrid(size.id, tier.name, 'double', Number(e.target.value))}
                                      />
                                    </div>
                                  ) : (
                                    <Input
                                      type="number"
                                      placeholder="가격"
                                      className="text-sm"
                                      value={priceGrid?.[size.id]?.[tier.name]?.base || ''}
                                      onChange={(e) => updatePriceGrid(size.id, tier.name, 'base', Number(e.target.value))}
                                    />
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">먼저 "사이즈 & 수량" 탭에서 사이즈와 수량 구간을 설정해주세요.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="options" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">기본 옵션</h3>
                  <p className="text-sm text-gray-600">기본으로 제공되는 옵션들입니다. 체크 해제하면 해당 옵션을 제거할 수 있습니다.</p>

                  <div className="space-y-3">
                    {defaultOptionFields.map((field, index) => (
                      <Card key={field.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Controller
                                name={`defaultOptions.${index}.enabled` as const}
                                control={control}
                                render={({ field: checkboxField }) => (
                                  <Checkbox
                                    checked={checkboxField.value}
                                    onCheckedChange={checkboxField.onChange}
                                  />
                                )}
                              />
                              <div>
                                <div className="font-medium">{field.name}</div>
                                <div className="text-sm text-gray-500">
                                  +{field.price.toLocaleString()}원 {field.unit === 'per_item' ? '/개' : '/총 주문'}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                className="w-24"
                                {...register(`defaultOptions.${index}.price` as const, { valueAsNumber: true })}
                              />
                              <span className="text-sm text-gray-500">원</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">추가 옵션</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendCustomOption({ name: '', price: 0, unit: 'per_item' })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      옵션 추가
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {customOptionFields.map((field, index) => (
                      <Card key={field.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">추가 옵션 {index + 1}</h4>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeCustomOption(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                              <Label>옵션명</Label>
                              <Input {...register(`customOptions.${index}.name` as const, { required: true })} />
                            </div>
                            <div>
                              <Label>가격</Label>
                              <Input type="number" {...register(`customOptions.${index}.price` as const, { required: true, valueAsNumber: true })} />
                            </div>
                            <div>
                              <Label>단위</Label>
                              <Controller
                                name={`customOptions.${index}.unit` as const}
                                control={control}
                                render={({ field }) => (
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="per_item">개당</SelectItem>
                                      <SelectItem value="per_order">총 주문당</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '저장 중...' : (product ? '수정' : '생성')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}