'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewFormProps {
  productId: number;
  productName?: string;
  orderItemId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ 
  productId, 
  productName, 
  orderItemId,
  onSuccess,
  onCancel 
}: ReviewFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast({
        title: "이미지 개수 초과",
        description: "최대 5개의 이미지만 업로드할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      files.forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "파일 크기 초과",
            description: `${file.name}은 5MB를 초과합니다.`,
            variant: "destructive",
          });
          return;
        }
        formData.append('images', file);
      });

      const response = await fetch('/api/upload/review-images', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setImages(prev => [...prev, ...result.images]);
        toast({
          title: "이미지 업로드 완료",
          description: `${result.images.length}개의 이미지가 업로드되었습니다.`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "이미지 업로드 실패",
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "로그인 필요",
        description: "리뷰를 작성하려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "평점을 선택해주세요",
        description: "별점을 클릭하여 평점을 매겨주세요.",
        variant: "destructive",
      });
      return;
    }

    if (content.trim().length < 10) {
      toast({
        title: "리뷰 내용이 너무 짧습니다",
        description: "10자 이상의 리뷰를 작성해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        product_id: productId,
        rating,
        content: content.trim(),
        images: images, // 이미 업로드된 이미지 URL들
        order_item_id: orderItemId
      };

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(reviewData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "리뷰가 등록되었습니다",
          description: "소중한 후기 감사합니다!",
        });

        // 폼 초기화
        setRating(0);
        setContent('');
        setImages([]);
        setUploadedFiles([]);

        onSuccess?.();
      } else {
        throw new Error(result.error || '리뷰 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('Review submission error:', error);
      toast({
        title: "리뷰 등록 실패",
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          리뷰 작성
        </CardTitle>
        {productName && (
          <p className="text-sm text-muted-foreground">상품: {productName}</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 별점 */}
          <div>
            <Label className="text-base font-medium mb-3 block">평점 *</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm text-muted-foreground">
                {rating > 0 ? `${rating}점` : '평점을 선택해주세요'}
              </span>
            </div>
          </div>

          {/* 리뷰 내용 */}
          <div>
            <Label htmlFor="content" className="text-base font-medium mb-3 block">
              리뷰 내용 *
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="상품에 대한 솔직한 후기를 남겨주세요. (최소 10자)"
              rows={4}
              maxLength={1000}
              className="resize-none"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>최소 10자 이상 입력해주세요</span>
              <span>{content.length}/1000</span>
            </div>
          </div>

          {/* 이미지 업로드 */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              사진 첨부 (선택사항)
            </Label>
            <div className="space-y-3">
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={image}
                        alt={`리뷰 이미지 ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {images.length < 5 && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex items-center justify-center p-4 border-2 border-dashed rounded-lg transition-colors ${
                      isUploading
                        ? 'border-blue-300 bg-blue-50 cursor-not-allowed'
                        : 'border-gray-300 cursor-pointer hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      ) : (
                        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                      )}
                      <p className="text-sm text-gray-600">
                        {isUploading ? '업로드 중...' : `사진 추가 (${images.length}/5)`}
                      </p>
                      <p className="text-xs text-gray-500">
                        최대 5MB, JPG/PNG 파일
                      </p>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="flex-1"
            >
              {isSubmitting ? '등록 중...' : '리뷰 등록'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                취소
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}