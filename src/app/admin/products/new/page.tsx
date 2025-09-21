'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nameKo: '',
    nameEn: '',
    descriptionKo: '',
    descriptionEn: '',
    categoryId: 'akril-goods',
    status: 'active',
    isPublished: true,
    isFeatured: false,
    hasPrintOptions: false
  });

  // 이미지 상태
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [descriptionImage, setDescriptionImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [descriptionImagePreview, setDescriptionImagePreview] = useState<string>('');

  // 사이즈 및 수량 구간
  const [sizes, setSizes] = useState([
    { id: '30x30', name: '30x30', dimension: '30x30mm' },
    { id: '50x50', name: '50x50', dimension: '50x50mm' }
  ]);

  const [quantityTiers, setQuantityTiers] = useState([
    { name: '1~9개', min: 1, max: 9 },
    { name: '10~99개', min: 10, max: 99 },
    { name: '100~499개', min: 100, max: 499 },
    { name: '500개+', min: 500, max: 999999 }
  ]);

  // 가격 그리드
  const [priceGrid, setPriceGrid] = useState<{[key: string]: {[key: string]: {single?: number, double?: number, base?: number}}}>({});

  // 기본 옵션들
  const [defaultOptions, setDefaultOptions] = useState([
    { id: 'opp', name: 'OPP포장', price: 100, unit: 'per_item', enabled: true },
    { id: 'interleaving', name: '간지출력', price: 200, unit: 'per_item', enabled: true },
    { id: 'magnetic_add', name: '마그네틱추가', price: 200, unit: 'per_item', enabled: true },
    { id: 'magnetic_embed', name: '마그네틱매립', price: 400, unit: 'per_item', enabled: true },
    { id: 'keyring_add', name: '키링추가', price: 300, unit: 'per_item', enabled: true },
    { id: 'design_cost', name: '디자인비용(인쇄)', price: 50000, unit: 'per_order', enabled: true }
  ]);

  const handleImageUpload = (file: File, type: 'main' | 'description') => {
    if (file) {
      const previewUrl = URL.createObjectURL(file);

      if (type === 'main') {
        setMainImage(file);
        setMainImagePreview(previewUrl);
      } else {
        setDescriptionImage(file);
        setDescriptionImagePreview(previewUrl);
      }
    }
  };

  const updatePriceGrid = (sizeId: string, tierName: string, printType: string, value: number) => {
    setPriceGrid(prev => ({
      ...prev,
      [sizeId]: {
        ...prev[sizeId],
        [tierName]: {
          ...prev[sizeId]?.[tierName],
          [printType]: value
        }
      }
    }));
  };

  const addSize = () => {
    const newId = `size-${sizes.length + 1}`;
    setSizes([...sizes, { id: newId, name: '', dimension: '' }]);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const addQuantityTier = () => {
    setQuantityTiers([...quantityTiers, { name: '', min: 0, max: 0 }]);
  };

  const removeQuantityTier = (index: number) => {
    setQuantityTiers(quantityTiers.filter((_, i) => i !== index));
  };

  const addOption = () => {
    const newId = `option-${defaultOptions.length + 1}`;
    setDefaultOptions([...defaultOptions, {
      id: newId,
      name: '',
      price: 0,
      unit: 'per_item',
      enabled: true
    }]);
  };

  const removeOption = (index: number) => {
    setDefaultOptions(defaultOptions.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, field: string, value: any) => {
    setDefaultOptions(prev =>
      prev.map((option, i) =>
        i === index ? { ...option, [field]: value } : option
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 실제 이미지 업로드 로직
      let mainImageUrl = '';
      let descriptionImageUrl = '';

      // 메인 이미지 업로드
      if (mainImage) {
        const mainFormData = new FormData();
        mainFormData.append('file', mainImage);
        mainFormData.append('type', 'main');

        const mainUploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: mainFormData
        });

        if (mainUploadResponse.ok) {
          const mainResult = await mainUploadResponse.json();
          mainImageUrl = mainResult.url;
        } else {
          alert('메인 이미지 업로드에 실패했습니다.');
          return;
        }
      }

      // 설명 이미지 업로드
      if (descriptionImage) {
        const descFormData = new FormData();
        descFormData.append('file', descriptionImage);
        descFormData.append('type', 'description');

        const descUploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: descFormData
        });

        if (descUploadResponse.ok) {
          const descResult = await descUploadResponse.json();
          descriptionImageUrl = descResult.url;
        } else {
          alert('설명 이미지 업로드에 실패했습니다.');
          return;
        }
      }

      const productData = {
        nameKo: formData.nameKo,
        nameEn: formData.nameEn,
        descriptionKo: formData.descriptionKo,
        descriptionEn: formData.descriptionEn,
        imageUrl: mainImageUrl,
        descriptionImageUrl: descriptionImageUrl,
        categoryId: formData.categoryId,
        isPublished: formData.isPublished,
        isFeatured: formData.isFeatured,
        status: formData.status,
        hasPrintOptions: formData.hasPrintOptions,
        sizes: sizes,
        quantityTiers: quantityTiers,
        priceGrid: priceGrid,
        defaultOptions: defaultOptions,
        stockQuantity: 999
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
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
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold">새 상품 생성</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* 탭 구조 */}
          <div className="space-y-8">

            {/* 기본 정보 탭 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-600">1. 기본 정보</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">상품명 (한국어) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameKo}
                    onChange={(e) => setFormData({...formData, nameKo: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="상품명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">상품명 (영어)</label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({...formData, nameEn: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Product name in English"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">설명 (한국어)</label>
                <textarea
                  value={formData.descriptionKo}
                  onChange={(e) => setFormData({...formData, descriptionKo: e.target.value})}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="상품 설명을 입력하세요"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">카테고리</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">ALL</option>
                    <option value="custom-product-view">커스텀상품(제품뷰)</option>
                    <option value="promo-product-view">단체판촉상품(제품뷰)</option>
                    <option value="ip-goods-dev">IP굿즈 상품개발(페이지)</option>
                    <option value="brand-request">브랜드의뢰(페이지)</option>
                    <option value="review">리뷰(게시판)</option>
                    <option value="order-guide">상품주문 가이드(페이지)</option>
                    <option value="fan-goods">팬굿즈</option>
                    <option value="akril-goods">아크릴 굿즈</option>
                    <option value="paper-goods">지류 굿즈</option>
                    <option value="sticker-goods">스티커(다꾸)</option>
                    <option value="pin-button">핀거믹/버튼</option>
                    <option value="life-size-standee">등신대</option>
                    <option value="etc">ETC</option>
                    <option value="promo">단체 판촉상품</option>
                    <option value="mug-glass">머그컵/유리컵</option>
                    <option value="tumbler">텀블러</option>
                    <option value="towel">수건</option>
                    <option value="clock">시계</option>
                    <option value="umbrella">우산</option>
                    <option value="clothing-goods">의류</option>
                    <option value="signage">광고물/사인</option>
                    <option value="led-neon">LED 네온</option>
                    <option value="env-design">환경디자인</option>
                    <option value="mini-sign">미니간판</option>
                    <option value="pet">반려동물</option>
                    <option value="frame-prop-name-tag">액자/소품/네임택</option>
                    <option value="cushion-fabric">쿠션/방석/패브릭 제품</option>
                    <option value="funeral">장례용품</option>
                    <option value="packing-supplies">포장 부자재</option>
                    <option value="stationery-goods">문구/오피스</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">상태</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">활성</option>
                    <option value="draft">초안</option>
                    <option value="inactive">비활성</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                    className="mr-2"
                  />
                  공개
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                    className="mr-2"
                  />
                  추천 상품
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hasPrintOptions}
                    onChange={(e) => setFormData({...formData, hasPrintOptions: e.target.checked})}
                    className="mr-2"
                  />
                  인쇄 옵션 사용 (단면/양면)
                </label>
              </div>
            </div>

            {/* 이미지 업로드 섹션 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-600">2. 상품 이미지</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 메인 이미지 */}
                <div>
                  <label className="block text-sm font-medium mb-2">메인 이미지 (상품명 옆에 표시)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                    {mainImagePreview ? (
                      <div className="space-y-2">
                        <img
                          src={mainImagePreview}
                          alt="Main preview"
                          className="w-full h-48 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setMainImage(null);
                            setMainImagePreview('');
                          }}
                          className="text-red-500 text-sm hover:underline"
                        >
                          이미지 제거
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, 'main');
                          }}
                          className="hidden"
                          id="main-image"
                        />
                        <label
                          htmlFor="main-image"
                          className="cursor-pointer inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                          이미지 선택
                        </label>
                        <p className="text-sm text-gray-500 mt-2">JPG, PNG 파일 (최대 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 설명 이미지 */}
                <div>
                  <label className="block text-sm font-medium mb-2">설명 이미지 (설명란에 표시)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                    {descriptionImagePreview ? (
                      <div className="space-y-2">
                        <img
                          src={descriptionImagePreview}
                          alt="Description preview"
                          className="w-full h-48 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setDescriptionImage(null);
                            setDescriptionImagePreview('');
                          }}
                          className="text-red-500 text-sm hover:underline"
                        >
                          이미지 제거
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, 'description');
                          }}
                          className="hidden"
                          id="description-image"
                        />
                        <label
                          htmlFor="description-image"
                          className="cursor-pointer inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                          이미지 선택
                        </label>
                        <p className="text-sm text-gray-500 mt-2">JPG, PNG 파일 (최대 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 사이즈 & 수량 구간 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-600">3. 사이즈 & 수량 구간</h2>

              {/* 사이즈 설정 */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">사이즈 설정</h3>
                  <button
                    type="button"
                    onClick={addSize}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-sm"
                  >
                    + 사이즈 추가
                  </button>
                </div>

                <div className="space-y-3">
                  {sizes.map((size, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                      <input
                        type="text"
                        placeholder="ID (예: 50x50)"
                        value={size.id}
                        onChange={(e) => {
                          const newSizes = [...sizes];
                          newSizes[index].id = e.target.value;
                          setSizes(newSizes);
                        }}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        placeholder="이름 (예: 50x50)"
                        value={size.name}
                        onChange={(e) => {
                          const newSizes = [...sizes];
                          newSizes[index].name = e.target.value;
                          setSizes(newSizes);
                        }}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        placeholder="규격 (예: 50x50mm)"
                        value={size.dimension}
                        onChange={(e) => {
                          const newSizes = [...sizes];
                          newSizes[index].dimension = e.target.value;
                          setSizes(newSizes);
                        }}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                      />
                      {sizes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSize(index)}
                          className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 text-sm"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 수량 구간 설정 */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">수량 구간 설정</h3>
                  <button
                    type="button"
                    onClick={addQuantityTier}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-sm"
                  >
                    + 수량 구간 추가
                  </button>
                </div>

                <div className="space-y-3">
                  {quantityTiers.map((tier, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                      <input
                        type="text"
                        placeholder="구간명 (예: 1~9개)"
                        value={tier.name}
                        onChange={(e) => {
                          const newTiers = [...quantityTiers];
                          newTiers[index].name = e.target.value;
                          setQuantityTiers(newTiers);
                        }}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                      />
                      <input
                        type="number"
                        placeholder="최소"
                        value={tier.min}
                        onChange={(e) => {
                          const newTiers = [...quantityTiers];
                          newTiers[index].min = Number(e.target.value);
                          setQuantityTiers(newTiers);
                        }}
                        className="w-24 p-2 border border-gray-300 rounded-md"
                      />
                      <input
                        type="number"
                        placeholder="최대"
                        value={tier.max}
                        onChange={(e) => {
                          const newTiers = [...quantityTiers];
                          newTiers[index].max = Number(e.target.value);
                          setQuantityTiers(newTiers);
                        }}
                        className="w-24 p-2 border border-gray-300 rounded-md"
                      />
                      {quantityTiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuantityTier(index)}
                          className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 text-sm"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Excel 형태 가격표 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-600">4. 가격표 (Excel 형태)</h2>
              <p className="text-sm text-gray-600">왼쪽에 사이즈, 위쪽에 수량 구간, 중간에 가격을 입력하세요.</p>

              {sizes.length > 0 && quantityTiers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left">사이즈</th>
                        {quantityTiers.map((tier, index) => (
                          <th key={index} className="border border-gray-300 p-3 text-center">
                            {tier.name}
                            <br />
                            <span className="text-xs text-gray-500">({tier.min}~{tier.max}개)</span>
                            {formData.hasPrintOptions && (
                              <div className="mt-1 text-xs text-gray-600">
                                <div>단면 | 양면</div>
                              </div>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sizes.map((size, sizeIndex) => (
                        <tr key={sizeIndex}>
                          <td className="border border-gray-300 p-3 font-medium bg-gray-50">
                            {size.name}
                            <br />
                            <span className="text-xs text-gray-500">{size.dimension}</span>
                          </td>
                          {quantityTiers.map((tier, tierIndex) => (
                            <td key={tierIndex} className="border border-gray-300 p-2">
                              {formData.hasPrintOptions ? (
                                <div className="grid grid-cols-2 gap-1">
                                  <input
                                    type="number"
                                    placeholder="단면"
                                    className="text-xs h-8 p-1 border border-gray-300 rounded"
                                    value={priceGrid[size.id]?.[tier.name]?.single || ''}
                                    onChange={(e) => updatePriceGrid(size.id, tier.name, 'single', Number(e.target.value))}
                                  />
                                  <input
                                    type="number"
                                    placeholder="양면"
                                    className="text-xs h-8 p-1 border border-gray-300 rounded"
                                    value={priceGrid[size.id]?.[tier.name]?.double || ''}
                                    onChange={(e) => updatePriceGrid(size.id, tier.name, 'double', Number(e.target.value))}
                                  />
                                </div>
                              ) : (
                                <input
                                  type="number"
                                  placeholder="가격"
                                  className="w-full p-2 border border-gray-300 rounded"
                                  value={priceGrid[size.id]?.[tier.name]?.base || ''}
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
                  <p className="text-gray-500">먼저 사이즈와 수량 구간을 설정해주세요.</p>
                </div>
              )}
            </div>

            {/* 기본 옵션 */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-blue-600">5. 기본 옵션</h2>
                  <p className="text-sm text-gray-600">기본으로 제공되는 옵션들입니다. 체크 해제하면 해당 옵션을 제거할 수 있습니다.</p>
                </div>
                <button
                  type="button"
                  onClick={addOption}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  + 옵션 추가
                </button>
              </div>

              <div className="space-y-4">
                {defaultOptions.map((option, index) => (
                  <div key={option.id} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={option.enabled}
                          onChange={(e) => updateOption(index, 'enabled', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="font-medium">옵션 사용</span>
                      </label>
                      {defaultOptions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          삭제
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">옵션명</label>
                        <input
                          type="text"
                          value={option.name}
                          onChange={(e) => updateOption(index, 'name', e.target.value)}
                          placeholder="예: OPP포장"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">추가 비용 (원)</label>
                        <input
                          type="number"
                          value={option.price}
                          onChange={(e) => updateOption(index, 'price', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">단위</label>
                        <select
                          value={option.unit}
                          onChange={(e) => updateOption(index, 'unit', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="per_item">개당</option>
                          <option value="per_order">주문당</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-500">
                      미리보기: +{option.price.toLocaleString()}원 {option.unit === 'per_item' ? '/개' : '/총 주문'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 저장 버튼 */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.push('/admin/products')}
                className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {isSubmitting ? '저장 중...' : '상품 생성'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}