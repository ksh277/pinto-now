
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import Image from 'next/image';

type Product = {
  id: string;
  nameKo?: string;
  nameEn?: string;
  name?: string;
  imageUrl?: string;
  thumbnail_url?: string;
  categoryId?: string;
  categoryKo?: string;
  category_name?: string;
  priceKrw?: number;
  price?: number | string;
  stockQuantity?: number;
  status?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt?: string;
  pricingData?: any;
  descriptionImageUrl?: string;
  additionalImages?: string[];
};

const statusLabels: Record<string, string> = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
  DRAFT: '초안',
  DELETED: '삭제됨'
};

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-yellow-100 text-yellow-800',
  DRAFT: 'bg-blue-100 text-blue-800',
  DELETED: 'bg-red-100 text-red-800'
};

const categoryLabels: Record<string, string> = {
  '1': '아크릴 굿즈',
  '2': '텀블러',
  '3': '마그컵/유리컵',
  '4': '의류 굿즈',
  '5': '스티커 굿즈',
  '6': '문구 굿즈',
  '7': '인형/쿠션',
  '8': '액자/액자굿즈',
  '9': '팬굿즈',
  '10': '기타'
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        (product.nameKo && product.nameKo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.nameEn && product.nameEn.toLowerCase().includes(searchTerm.toLowerCase())) ||
        product.id.includes(searchTerm)
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.categoryId === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => product.status === statusFilter);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data); // 디버깅용
        // API 응답 구조에 맞게 수정
        const productList = data.products || [];
        console.log('Product List:', productList); // 디버깅용
        setProducts(productList);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const token = localStorage.getItem('auth_token') || 'dummy-token';
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        fetchProducts(); // Refresh the list
      } else {
        alert('상품 삭제에 실패했습니다');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('상품 삭제에 실패했습니다');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">상품 관리</h1>
        <Button asChild>
          <Link href="/admin/products/new">새 상품 등록</Link>
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">이미지</TableHead>
              <TableHead>상품명</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>가격</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  상품을 불러오는 중...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  등록된 상품이 없습니다. <Link href="/admin/products/new" className="underline">첫 번째 상품을 등록해보세요</Link>
                </TableCell>
              </TableRow>
            ) : (
              products.map(product => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 overflow-hidden rounded-md">
                       <Image
                         src={product.imageUrl || product.thumbnail_url || '/images/placeholder.png'}
                         alt={product.nameKo || product.name || '상품 이미지'}
                         fill
                         className="object-cover"
                       />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.nameKo || product.name || '이름 없음'}</TableCell>
                  <TableCell>{product.categoryKo || product.category_name || '-'}</TableCell>
                  <TableCell>{(() => {
                    const price = product.priceKrw || product.price;
                    if (typeof price === 'string') {
                      return parseFloat(price).toLocaleString();
                    }
                    return price?.toLocaleString();
                  })()} 원</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/products/edit/${product.id}`}>수정</Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">삭제</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>삭제 확인</AlertDialogTitle>
                          <AlertDialogDescription>
                            이 작업은 되돌릴 수 없으며 상품이 영구적으로 삭제됩니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteProduct(product.id.toString())}>
                            삭제
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
