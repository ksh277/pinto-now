'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit, Plus, Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

type InfoCard = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  sortOrder: number;
  isActive?: boolean;
};

type FormData = Omit<InfoCard, 'id'> & { id?: string };

export default function InfoCardsAdmin() {
  const [cards, setCards] = useState<InfoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState<FormData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/info-cards?includeInactive=true');
      if (response.ok) {
        const data = await response.json();
        setCards(data.infoCards);
      }
    } catch (error) {
      console.error('Failed to fetch cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      const token = localStorage.getItem('authToken');
      const isEdit = Boolean(formData.id);
      
      const url = isEdit ? `/api/info-cards/${formData.id}` : '/api/info-cards';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl || null,
          sortOrder: formData.sortOrder,
          isActive: formData.isActive ?? true
        })
      });

      if (response.ok) {
        await fetchCards();
        setEditingCard(null);
        setIsCreating(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save card');
      }
    } catch (error) {
      console.error('Failed to save card:', error);
      alert('Failed to save card');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/info-cards/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchCards();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete card');
      }
    } catch (error) {
      console.error('Failed to delete card:', error);
      alert('Failed to delete card');
    }
  };

  const startCreate = () => {
    setEditingCard({
      title: '',
      description: '',
      imageUrl: '',
      sortOrder: Math.max(...cards.map(c => c.sortOrder), 0) + 10,
      isActive: true
    });
    setIsCreating(true);
  };

  const startEdit = (card: InfoCard) => {
    setEditingCard({ ...card });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingCard(null);
    setIsCreating(false);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (editingCard) {
          setEditingCard({ ...editingCard, imageUrl: data.url });
        }
      } else {
        alert('이미지 업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  if (loading) {
    return <div className="p-6">로딩 중...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">인포 카드 관리</h1>
        <Button onClick={startCreate}>
          <Plus className="w-4 h-4 mr-2" />
          새 카드 추가
        </Button>
      </div>

      {editingCard && (
        <Card className="p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {isCreating ? '새 카드 추가' : '카드 수정'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={editingCard.title}
                onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                placeholder="카드 제목"
              />
            </div>
            <div>
              <Label htmlFor="imageUrl">이미지</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    value={editingCard.imageUrl || ''}
                    onChange={(e) => setEditingCard({ ...editingCard, imageUrl: e.target.value })}
                    placeholder="이미지 URL을 직접 입력하거나 파일을 업로드하세요"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? '업로드 중...' : '업로드'}
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {editingCard.imageUrl && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                    <Image
                      src={editingCard.imageUrl}
                      alt="미리보기"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={editingCard.description}
                onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
                placeholder="카드 설명"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="sortOrder">정렬 순서</Label>
              <Input
                id="sortOrder"
                type="number"
                value={editingCard.sortOrder}
                onChange={(e) => setEditingCard({ ...editingCard, sortOrder: Number(e.target.value) })}
              />
            </div>
            {!isCreating && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={editingCard.isActive ?? true}
                  onCheckedChange={(checked) => setEditingCard({ ...editingCard, isActive: checked })}
                />
                <Label htmlFor="isActive">활성화</Label>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={cancelEdit}>
              <X className="w-4 h-4 mr-2" />
              취소
            </Button>
            <Button onClick={() => handleSave(editingCard)}>
              <Save className="w-4 h-4 mr-2" />
              저장
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card key={card.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold truncate">{card.title}</h3>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startEdit(card)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(card.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {card.imageUrl && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden mb-2">
                <Image
                  src={card.imageUrl}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <p className="text-sm text-gray-600 mb-2 line-clamp-3">
              {card.description}
            </p>
            <div className="text-xs text-gray-500">
              정렬: {card.sortOrder} | 상태: {card.isActive !== false ? '활성' : '비활성'}
            </div>
          </Card>
        ))}
      </div>

      {cards.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">등록된 인포 카드가 없습니다.</p>
          <Button className="mt-4" onClick={startCreate}>
            첫 번째 카드 만들기
          </Button>
        </Card>
      )}
    </div>
  );
}