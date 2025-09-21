'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

interface PricingTier {
  name: string;
  type: string;
  sizes: string[];
  prices: Record<string, Record<string, number>>;
  quantityRanges: string[];
}

interface PricingData {
  sizes: Array<{ id: string; name: string; dimension: string }>;
  printTypes: Array<{ id: string; name: string; description: string }>;
  pricingTiers: PricingTier[];
}

interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  categoryId: number;
  price: number;
  stock: number;
  status: string;
  pricingData?: PricingData;
  descriptionImageUrl?: string;
  additionalImages?: string[];
}

const categories = [
  { id: 1, name: '아크릴 굿즈' },
  { id: 2, name: '텀블러' },
  { id: 3, name: '마그컵/유리컵' },
  { id: 4, name: '의류 굿즈' },
  { id: 5, name: '스티커 굿즈' },
  { id: 6, name: '문구 굿즈' },
  { id: 7, name: '인형/쿠션' },
  { id: 8, name: '액자/액자굿즈' },
  { id: 9, name: '팬굿즈' },
  { id: 10, name: '기타' }
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    categoryId: 1,
    price: 0,
    stock: 100,
    status: 'ACTIVE'
  });
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [descriptionImageUrl, setDescriptionImageUrl] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) {
      router.push('/admin/products');
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`);
      if (response.ok) {
        const productData = await response.json();
        setProduct(productData);
        setFormData({
          name: productData.name || '',
          description: productData.description || '',
          imageUrl: productData.imageUrl || '',
          categoryId: productData.categoryId || 1,
          price: productData.price || 0,
          stock: productData.stock || 100,
          status: productData.status || 'ACTIVE'
        });
        setPricingData(productData.pricingData || null);
        setDescriptionImageUrl(productData.descriptionImageUrl || '');
        setAdditionalImages(productData.additionalImages || []);
      } else {
        console.error('Failed to fetch product');
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'categoryId' || name === 'price' || name === 'stock' ? parseInt(value) || 0 : value
    }));
  };

  const handlePricingChange = (tierIndex: number, sizeId: string, quantityRange: string, newPrice: number) => {
    if (!pricingData) return;

    const updatedPricingData = { ...pricingData };
    if (!updatedPricingData.pricingTiers[tierIndex].prices[sizeId]) {
      updatedPricingData.pricingTiers[tierIndex].prices[sizeId] = {};
    }
    updatedPricingData.pricingTiers[tierIndex].prices[sizeId][quantityRange] = newPrice;
    setPricingData(updatedPricingData);
  };

  const addSize = () => {
    if (!pricingData) return;

    const newSizeId = `custom-${Date.now()}`;
    const newSize = {
      id: newSizeId,
      name: '새 사이즈',
      dimension: '가로x세로mm'
    };

    const updatedPricingData = { ...pricingData };
    updatedPricingData.sizes.push(newSize);

    // 모든 pricingTier에 새 사이즈 추가
    updatedPricingData.pricingTiers.forEach(tier => {
      tier.sizes.push(newSizeId);
      tier.prices[newSizeId] = {};
      tier.quantityRanges.forEach(range => {
        tier.prices[newSizeId][range] = 0;
      });
    });

    setPricingData(updatedPricingData);
  };

  const updateSizeInfo = (sizeId: string, name: string, dimension: string) => {
    if (!pricingData) return;

    const updatedPricingData = { ...pricingData };
    const sizeIndex = updatedPricingData.sizes.findIndex(s => s.id === sizeId);
    if (sizeIndex >= 0) {
      updatedPricingData.sizes[sizeIndex] = { ...updatedPricingData.sizes[sizeIndex], name, dimension };
      setPricingData(updatedPricingData);
    }
  };

  const removeSize = (sizeId: string) => {
    if (!pricingData) return;

    const updatedPricingData = { ...pricingData };

    // sizes 배열에서 제거
    updatedPricingData.sizes = updatedPricingData.sizes.filter(s => s.id !== sizeId);

    // 모든 pricingTier에서 해당 사이즈 제거
    updatedPricingData.pricingTiers.forEach(tier => {
      tier.sizes = tier.sizes.filter(s => s !== sizeId);
      delete tier.prices[sizeId];
    });

    setPricingData(updatedPricingData);
  };

  const addAdditionalImage = () => {
    setAdditionalImages(prev => [...prev, '']);
  };

  const updateAdditionalImage = (index: number, url: string) => {
    setAdditionalImages(prev => {
      const updated = [...prev];
      updated[index] = url;
      return updated;
    });
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (file: File, type: 'thumbnail' | 'description' | 'additional', index?: number) => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.url;

        if (type === 'thumbnail') {
          setFormData(prev => ({ ...prev, imageUrl }));
        } else if (type === 'description') {
          setDescriptionImageUrl(imageUrl);
        } else if (type === 'additional' && index !== undefined) {
          updateAdditionalImage(index, imageUrl);
        }
      } else {
        alert('이미지 업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        ...formData,
        pricingData,
        descriptionImageUrl,
        additionalImages
      };

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        alert('상품이 성공적으로 수정되었습니다.');
        router.push('/admin/products');
      } else {
        const error = await response.json();
        alert(`저장 실패: ${error.error}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">상품 정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">상품 수정</h1>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/admin/products')}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 기본 정보 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">상품명</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">썸네일 이미지</label>
                <div className="space-y-3">
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="이미지 URL을 직접 입력하거나 아래에서 파일을 업로드하세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'thumbnail');
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploading && <span className="text-sm text-blue-600">업로드 중...</span>}
                  </div>
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img src={formData.imageUrl} alt="썸네일 미리보기" className="w-32 h-32 object-cover rounded-lg" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">기본 가격</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">재고</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ACTIVE">활성</option>
                  <option value="INACTIVE">비활성</option>
                  <option value="DRAFT">임시저장</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">상세 설명 이미지</label>
                <div className="space-y-3">
                  <input
                    type="url"
                    value={descriptionImageUrl}
                    onChange={(e) => setDescriptionImageUrl(e.target.value)}
                    placeholder="이미지 URL을 직접 입력하거나 아래에서 파일을 업로드하세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'description');
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploading && <span className="text-sm text-blue-600">업로드 중...</span>}
                  </div>
                  {descriptionImageUrl && (
                    <div className="mt-2">
                      <img src={descriptionImageUrl} alt="상세 설명 이미지 미리보기" className="w-64 h-auto rounded-lg" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">추가 이미지</label>
                  <button
                    onClick={addAdditionalImage}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    이미지 추가
                  </button>
                </div>
                {additionalImages.map((img, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 mb-3">
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={img}
                        onChange={(e) => updateAdditionalImage(index, e.target.value)}
                        placeholder="이미지 URL을 직접 입력하거나 아래에서 파일을 업로드하세요"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, 'additional', index);
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <button
                          onClick={() => removeAdditionalImage(index)}
                          className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          삭제
                        </button>
                      </div>
                      {img && (
                        <div className="mt-2">
                          <img src={img} alt={`추가 이미지 ${index + 1}`} className="w-32 h-32 object-cover rounded-lg" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 가격 정보 */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">가격 정보</h3>
                  {pricingData && (
                    <button
                      onClick={addSize}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      사이즈 추가
                    </button>
                  )}
                </div>

                {pricingData ? (
                  <div className="space-y-6">
                    {/* 사이즈 관리 */}
                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-3">사이즈 설정</h4>
                      <div className="space-y-3">
                        {pricingData.sizes.map((size) => (
                          <div key={size.id} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex gap-2 mb-2">
                              <input
                                type="text"
                                value={size.name}
                                onChange={(e) => updateSizeInfo(size.id, e.target.value, size.dimension)}
                                placeholder="사이즈명"
                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                              <input
                                type="text"
                                value={size.dimension}
                                onChange={(e) => updateSizeInfo(size.id, size.name, e.target.value)}
                                placeholder="치수 (예: 50x50mm)"
                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                              <button
                                onClick={() => removeSize(size.id)}
                                className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 가격 설정 */}
                    {pricingData.pricingTiers.map((tier, tierIndex) => (
                      <div key={tierIndex} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="text-md font-medium text-gray-800 mb-3">{tier.name}</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="px-2 py-2 text-left">사이즈</th>
                                {tier.quantityRanges.map(range => (
                                  <th key={range} className="px-2 py-2 text-center">{range}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {pricingData.sizes.map((size) => (
                                <tr key={size.id} className="border-t">
                                  <td className="px-2 py-2 font-medium">{size.name}</td>
                                  {tier.quantityRanges.map(range => (
                                    <td key={range} className="px-2 py-2">
                                      <input
                                        type="number"
                                        value={tier.prices[size.id]?.[range] || 0}
                                        onChange={(e) => handlePricingChange(tierIndex, size.id, range, parseInt(e.target.value) || 0)}
                                        className="w-full px-1 py-1 border border-gray-300 rounded text-center"
                                      />
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    이 상품에는 상세 가격 정보가 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
