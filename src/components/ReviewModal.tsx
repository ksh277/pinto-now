'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Star, ThumbsUp, MessageCircle, X, Send } from 'lucide-react';
import Image from 'next/image';

interface Review {
  id: number;
  product_id: number;
  user_id: number;
  order_item_id: number | null;
  rating: number;
  content: string;
  images: string[];
  like_count: number;
  comment_count: number;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  user_nickname: string;
  product_name: string;
}

interface Comment {
  id: number;
  review_id: number;
  user_id: number;
  parent_id: number | null;
  content: string;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  user_nickname: string;
}

interface ReviewModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewModal({ review, isOpen, onClose }: ReviewModalProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (review && isOpen) {
      setLikeCount(review.like_count);
      setCommentCount(review.comment_count);
      fetchLikeStatus();
      fetchComments();
    }
  }, [review, isOpen]);

  const fetchLikeStatus = async () => {
    if (!review) return;
    
    try {
      const response = await fetch(`/api/reviews/${review.id}/like`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setIsLiked(data.data.isLiked);
        setLikeCount(data.data.likeCount);
      }
    } catch (error) {
      console.error('Failed to fetch like status:', error);
    }
  };

  const fetchComments = async () => {
    if (!review) return;
    
    try {
      const response = await fetch(`/api/reviews/${review.id}/comments`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setComments(data.data.comments);
        setCommentCount(data.data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleLike = async () => {
    if (!user || !review) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const method = isLiked ? 'DELETE' : 'POST';
      const response = await fetch(`/api/reviews/${review.id}/like`, {
        method,
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        setIsLiked(!isLiked);
        setLikeCount(data.likeCount);
      } else {
        alert(data.error || '좋아요 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Like error:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const handleCommentSubmit = async () => {
    if (!user || !review) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!newComment.trim()) {
      alert('댓글을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/reviews/${review.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim(),
          parent_id: replyTo
        }),
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        setNewComment('');
        setReplyTo(null);
        await fetchComments(); // 댓글 목록 새로고침
      } else {
        alert(data.error || '댓글 작성 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Comment error:', error);
      alert('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen || !review) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">{renderStars(review.rating)}</div>
              <span className="text-sm text-gray-600">{review.rating}/5</span>
            </div>
            <h3 className="font-semibold text-lg">{review.product_name}</h3>
            <p className="text-sm text-gray-600">
              {review.user_nickname} • {formatDate(review.created_at)}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 리뷰 내용 */}
          <div className="whitespace-pre-wrap">{review.content}</div>

          {/* 리뷰 이미지들 */}
          {review.images && review.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {review.images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={image}
                    alt={`리뷰 이미지 ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}

          {/* 좋아요 및 댓글 버튼 */}
          <div className="flex items-center gap-4 py-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center gap-1 ${isLiked ? 'text-blue-600' : 'text-gray-600'}`}
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </Button>
            <div className="flex items-center gap-1 text-gray-600">
              <MessageCircle className="w-4 h-4" />
              <span>{commentCount}</span>
            </div>
          </div>

          {/* 댓글 작성 */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={replyTo ? "답글을 입력하세요..." : "댓글을 입력하세요..."}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    handleCommentSubmit();
                  }
                }}
              />
              <Button 
                onClick={handleCommentSubmit} 
                disabled={loading || !newComment.trim()}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {replyTo && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>답글 작성 중...</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyTo(null)}
                  className="text-xs"
                >
                  취소
                </Button>
              </div>
            )}
          </div>

          {/* 댓글 목록 */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={`p-3 bg-gray-50 rounded-md ${comment.parent_id ? 'ml-6' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{comment.user_nickname}</span>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                {!comment.parent_id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyTo(comment.id)}
                    className="text-xs mt-1 h-6 px-2"
                  >
                    답글
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}