import { NextRequest } from 'next/server';
import { query } from '@/lib/mysql';
import { verify } from 'jsonwebtoken';

function getUserIdFromToken(request: NextRequest): number | null {
  try {
    // 쿠키에서 session 토큰 읽기
    const token = request.cookies.get('session')?.value;
    if (!token) return null;
    
    const decoded = verify(token, process.env.JWT_SECRET!) as any;
    return decoded.id;
  } catch {
    return null;
  }
}

// POST: 리뷰 좋아요 추가
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return Response.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const reviewId = parseInt(params.id);
    if (isNaN(reviewId)) {
      return Response.json({
        success: false,
        error: 'Invalid review ID'
      }, { status: 400 });
    }

    // 리뷰 존재 확인
    const reviewExists = await query<{id: number}[]>(`
      SELECT id FROM reviews WHERE id = ? AND is_hidden = 0
    `, [reviewId]);

    if (reviewExists.length === 0) {
      return Response.json({
        success: false,
        error: 'Review not found'
      }, { status: 404 });
    }

    // 이미 좋아요를 했는지 확인
    const existingLike = await query<{id: number}[]>(`
      SELECT id FROM review_likes WHERE review_id = ? AND user_id = ?
    `, [reviewId, userId]);

    if (existingLike.length > 0) {
      return Response.json({
        success: false,
        error: 'Already liked this review'
      }, { status: 400 });
    }

    // 좋아요 추가
    await query(`
      INSERT INTO review_likes (review_id, user_id)
      VALUES (?, ?)
    `, [reviewId, userId]);

    // 좋아요 카운트 조회
    const likeCount = await query<{count: number}[]>(`
      SELECT COUNT(*) as count FROM review_likes WHERE review_id = ?
    `, [reviewId]);

    return Response.json({
      success: true,
      message: 'Review liked successfully',
      likeCount: likeCount[0]?.count || 0
    });

  } catch (error) {
    console.error('Like review error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE: 리뷰 좋아요 취소
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return Response.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const reviewId = parseInt(params.id);
    if (isNaN(reviewId)) {
      return Response.json({
        success: false,
        error: 'Invalid review ID'
      }, { status: 400 });
    }

    // 좋아요 존재 확인
    const existingLike = await query<{id: number}[]>(`
      SELECT id FROM review_likes WHERE review_id = ? AND user_id = ?
    `, [reviewId, userId]);

    if (existingLike.length === 0) {
      return Response.json({
        success: false,
        error: 'Like not found'
      }, { status: 404 });
    }

    // 좋아요 제거
    await query(`
      DELETE FROM review_likes WHERE review_id = ? AND user_id = ?
    `, [reviewId, userId]);

    // 좋아요 카운트 조회
    const likeCount = await query<{count: number}[]>(`
      SELECT COUNT(*) as count FROM review_likes WHERE review_id = ?
    `, [reviewId]);

    return Response.json({
      success: true,
      message: 'Review like removed successfully',
      likeCount: likeCount[0]?.count || 0
    });

  } catch (error) {
    console.error('Unlike review error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET: 리뷰 좋아요 상태 확인
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getUserIdFromToken(req);
    const reviewId = parseInt(params.id);
    
    if (isNaN(reviewId)) {
      return Response.json({
        success: false,
        error: 'Invalid review ID'
      }, { status: 400 });
    }

    // 좋아요 카운트 조회
    const likeCount = await query<{count: number}[]>(`
      SELECT COUNT(*) as count FROM review_likes WHERE review_id = ?
    `, [reviewId]);

    let isLiked = false;
    if (userId) {
      // 사용자의 좋아요 상태 확인
      const userLike = await query<{id: number}[]>(`
        SELECT id FROM review_likes WHERE review_id = ? AND user_id = ?
      `, [reviewId, userId]);
      isLiked = userLike.length > 0;
    }

    return Response.json({
      success: true,
      data: {
        likeCount: likeCount[0]?.count || 0,
        isLiked
      }
    });

  } catch (error) {
    console.error('Get review like status error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}