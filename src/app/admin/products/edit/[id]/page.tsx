'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ProductForm } from '../../product-form';

export default function EditProductPage() {
  const params = useParams();
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data.product);
        } else {
          setError('상품을 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError('상품을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600">{error}</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-8 text-center">상품을 찾을 수 없습니다.</div>;
  }

  return <ProductForm product={product} />;
}
