import { NextRequest } from 'next/server';
import { query } from '@/lib/mysql';
import { verify } from 'jsonwebtoken';

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

// GET: 리뷰 댓글 목록 조회
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reviewId = parseInt(params.id);
    if (isNaN(reviewId)) {
      return Response.json({
        success: false,
        error: 'Invalid review ID'
      }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 댓글 목록 조회 (대댓글도 포함)
    const commentsQuery = `
      SELECT 
        rc.id,
        rc.review_id,
        rc.user_id,
        rc.parent_id,
        rc.content,
        rc.is_hidden,
        rc.created_at,
        rc.updated_at,
        up.nickname as user_nickname
      FROM review_comments rc
      LEFT JOIN user_profiles up ON rc.user_id = up.user_id
      WHERE rc.review_id = ? AND rc.is_hidden = 0
      ORDER BY 
        CASE WHEN rc.parent_id IS NULL THEN rc.id ELSE rc.parent_id END ASC,
        rc.parent_id ASC,
        rc.created_at ASC
      LIMIT ? OFFSET ?
    `;

    const comments = await query<Comment[]>(commentsQuery, [reviewId, limit, offset]);

    // 총 댓글 수 조회
    const countQuery = `
      SELECT COUNT(*) as total
      FROM review_comments
      WHERE review_id = ? AND is_hidden = 0
    `;
    const countResult = await query<{total: number}[]>(countQuery, [reviewId]);
    const total = countResult[0]?.total || 0;

    // 사용자 닉네임 마스킹
    const commentsWithMaskedNicknames = comments.map(comment => ({
      ...comment,
      user_nickname: comment.user_nickname ? 
        comment.user_nickname.substring(0, 1) + '*'.repeat(comment.user_nickname.length - 1) : '익명'
    }));

    return Response.json({
      success: true,
      data: {
        comments: commentsWithMaskedNicknames,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get review comments error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST: 리뷰 댓글 작성
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

    const { content, parent_id } = await req.json();

    if (!content || content.trim().length === 0) {
      return Response.json({
        success: false,
        error: 'Comment content is required'
      }, { status: 400 });
    }

    if (content.length > 500) {
      return Response.json({
        success: false,
        error: 'Comment is too long (max 500 characters)'
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

    // 대댓글인 경우 부모 댓글 확인
    if (parent_id) {
      const parentExists = await query<{id: number}[]>(`
        SELECT id FROM review_comments 
        WHERE id = ? AND review_id = ? AND is_hidden = 0
      `, [parent_id, reviewId]);

      if (parentExists.length === 0) {
        return Response.json({
          success: false,
          error: 'Parent comment not found'
        }, { status: 404 });
      }
    }

    // 댓글 생성
    const result = await query(`
      INSERT INTO review_comments (review_id, user_id, parent_id, content)
      VALUES (?, ?, ?, ?)
    `, [reviewId, userId, parent_id || null, content.trim()]);

    const commentId = (result as any).insertId;

    return Response.json({
      success: true,
      message: 'Comment created successfully',
      commentId
    });

  } catch (error) {
    console.error('Create review comment error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}