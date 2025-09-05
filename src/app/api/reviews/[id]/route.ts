import { NextRequest } from 'next/server';
import { query } from '@/lib/mysql';
import { verify } from 'jsonwebtoken';

function getUserIdFromToken(request: NextRequest): number | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    
    const token = authHeader.substring(7);
    const decoded = verify(token, process.env.JWT_SECRET!) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

// GET: 특정 리뷰 상세 조회
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reviewId = parseInt(params.id);
    if (isNaN(reviewId)) {
      return Response.json({
        success: false,
        error: 'Invalid review ID'
      }, { status: 400 });
    }

    const reviewQuery = `
      SELECT 
        r.id,
        r.product_id,
        r.user_id,
        r.order_item_id,
        r.rating,
        r.content,
        r.images,
        r.like_count,
        r.comment_count,
        r.is_hidden,
        r.created_at,
        r.updated_at,
        up.nickname as user_nickname,
        p.name as product_name
      FROM reviews r
      LEFT JOIN user_profiles up ON r.user_id = up.user_id
      LEFT JOIN products p ON r.product_id = p.id
      WHERE r.id = ? AND r.is_hidden = 0
    `;

    const reviews = await query<any[]>(reviewQuery, [reviewId]);
    if (reviews.length === 0) {
      return Response.json({
        success: false,
        error: 'Review not found'
      }, { status: 404 });
    }

    const review = reviews[0];
    review.images = review.images ? JSON.parse(review.images) : [];
    review.user_nickname = review.user_nickname ? 
      review.user_nickname.substring(0, 1) + '*'.repeat(review.user_nickname.length - 1) : '익명';

    return Response.json({
      success: true,
      data: review
    });

  } catch (error) {
    console.error('Get review error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT: 리뷰 수정
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    const { rating, content, images } = await req.json();

    if (rating && (rating < 1 || rating > 5)) {
      return Response.json({
        success: false,
        error: 'Rating must be between 1 and 5'
      }, { status: 400 });
    }

    // 리뷰 소유자 확인
    const existingReview = await query<{user_id: number}[]>(`
      SELECT user_id FROM reviews WHERE id = ?
    `, [reviewId]);

    if (existingReview.length === 0) {
      return Response.json({
        success: false,
        error: 'Review not found'
      }, { status: 404 });
    }

    if (existingReview[0].user_id !== userId) {
      return Response.json({
        success: false,
        error: 'Unauthorized to modify this review'
      }, { status: 403 });
    }

    // 리뷰 수정
    const updateFields = [];
    const updateValues = [];

    if (rating !== undefined) {
      updateFields.push('rating = ?');
      updateValues.push(rating);
    }

    if (content !== undefined) {
      updateFields.push('content = ?');
      updateValues.push(content);
    }

    if (images !== undefined) {
      updateFields.push('images = ?');
      updateValues.push(images ? JSON.stringify(images) : null);
    }

    if (updateFields.length === 0) {
      return Response.json({
        success: false,
        error: 'No fields to update'
      }, { status: 400 });
    }

    updateValues.push(reviewId);

    await query(`
      UPDATE reviews 
      SET ${updateFields.join(', ')}, updated_at = NOW()
      WHERE id = ?
    `, updateValues);

    return Response.json({
      success: true,
      message: 'Review updated successfully'
    });

  } catch (error) {
    console.error('Update review error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE: 리뷰 삭제
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

    // 리뷰 소유자 확인
    const existingReview = await query<{user_id: number}[]>(`
      SELECT user_id FROM reviews WHERE id = ?
    `, [reviewId]);

    if (existingReview.length === 0) {
      return Response.json({
        success: false,
        error: 'Review not found'
      }, { status: 404 });
    }

    if (existingReview[0].user_id !== userId) {
      return Response.json({
        success: false,
        error: 'Unauthorized to delete this review'
      }, { status: 403 });
    }

    // 리뷰를 숨김 처리 (실제 삭제 대신)
    await query(`
      UPDATE reviews 
      SET is_hidden = 1, updated_at = NOW()
      WHERE id = ?
    `, [reviewId]);

    return Response.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}