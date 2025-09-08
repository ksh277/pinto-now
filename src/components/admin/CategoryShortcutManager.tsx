'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Trash2, Edit2, Plus, Upload } from 'lucide-react';
import Image from 'next/image';

interface CategoryShortcut {
  id: string;
  title: string;
  image_url: string;
  href: string;
  sort_order: number;
  is_active: boolean;
}

interface CategoryForm {
  title: string;
  image_url: string;
  href: string;
}

export default function CategoryShortcutManager() {
  const [categories, setCategories] = useState<CategoryShortcut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<CategoryForm>({
    title: '',
    image_url: '',
    href: ''
  });

  // 카테고리 목록 가져오기
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/category-shortcuts');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 폼 초기화
  const resetForm = () => {
    setFormData({ title: '', image_url: '', href: '' });
    setEditingId(null);
    setShowAddForm(false);
  };

  // 카테고리 추가
  const handleAdd = async () => {
    try {
      const response = await fetch('/api/category-shortcuts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchCategories();
        resetForm();
        alert('카테고리가 추가되었습니다.');
      } else {
        const error = await response.json();
        alert(error.error || '추가 중 오류가 발생했습니다.');
      }
    } catch (error) {
      alert('추가 중 오류가 발생했습니다.');
    }
  };

  // 카테고리 수정
  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      const response = await fetch('/api/category-shortcuts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...formData })
      });

      if (response.ok) {
        await fetchCategories();
        resetForm();
        alert('카테고리가 수정되었습니다.');
      } else {
        alert('수정 중 오류가 발생했습니다.');
      }
    } catch (error) {
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  // 카테고리 삭제 (비활성화)
  const handleDelete = async (id: string) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/category-shortcuts?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchCategories();
        alert('카테고리가 삭제되었습니다.');
      } else {
        alert('삭제 중 오류가 발생했습니다.');
      }
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 수정 모드로 전환
  const startEdit = (category: CategoryShortcut) => {
    setEditingId(category.id);
    setFormData({
      title: category.title,
      image_url: category.image_url,
      href: category.href
    });
    setShowAddForm(true);
  };

  if (isLoading) {
    return <div className="p-6">로딩 중...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">카테고리 숏컷 관리</h1>
        <Button 
          onClick={() => setShowAddForm(true)}
          disabled={categories.length >= 12}
        >
          <Plus className="w-4 h-4 mr-2" />
          새 카테고리 추가 ({categories.length}/12)
        </Button>
      </div>

      {/* 추가/수정 폼 */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingId ? '카테고리 수정' : '새 카테고리 추가'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">제목</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="카테고리 제목을 입력하세요"
                  />
                </div>
                
                <div>
                  <Label htmlFor="image_url">이미지 URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      placeholder="이미지 URL을 입력하세요"
                    />
                    <Button variant="outline" size="icon">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="href">링크 URL</Label>
                  <Input
                    id="href"
                    value={formData.href}
                    onChange={(e) => setFormData({...formData, href: e.target.value})}
                    placeholder="/category/example"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={editingId ? handleUpdate : handleAdd}
                    disabled={!formData.title || !formData.image_url || !formData.href}
                  >
                    {editingId ? '수정' : '추가'}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    취소
                  </Button>
                </div>
              </div>
              
              {/* 이미지 미리보기 */}
              <div className="flex flex-col items-center justify-center">
                <Label className="mb-2">미리보기 (80x80)</Label>
                <div className="relative rounded-full bg-white border-2 border-gray-200 overflow-hidden" style={{ width: '80px', height: '80px' }}>
                  {formData.image_url ? (
                    <Image
                      src={formData.image_url}
                      alt="미리보기"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                      이미지 없음
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {formData.title || '제목 없음'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 카테고리 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="relative">
            <CardContent className="p-4">
              <div className="flex flex-col items-center space-y-3">
                <div className="relative w-16 h-16 rounded-full bg-white border overflow-hidden">
                  <Image
                    src={category.image_url}
                    alt={category.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="text-center">
                  <h3 className="font-medium text-sm">{category.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{category.href}</p>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(category)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">등록된 카테고리가 없습니다.</p>
        </div>
      )}
    </div>
  );
}