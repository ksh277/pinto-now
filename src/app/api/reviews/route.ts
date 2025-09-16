import { NextRequest } from 'next/server';
import { query } from '@/lib/mysql';
import { verify } from 'jsonwebtoken';

interface Review {
  id: number;
  product_id: number;
  user_id: number;
  order_item_id: number | null;
  rating: number;
  content: string;
  images: string[] | null;
  like_count: number;
  comment_count: number;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  user_nickname: string;
  product_name: string;
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

// GET: 리뷰 목록 조회
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('product_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const rating = searchParams.get('rating');
    const sortBy = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'DESC';
    
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE r.is_hidden = 0';
    const queryParams: any[] = [];

    if (productId) {
      whereClause += ' AND r.product_id = ?';
      queryParams.push(parseInt(productId));
    }

    if (rating) {
      whereClause += ' AND r.rating = ?';
      queryParams.push(parseInt(rating));
    }

    // 정렬 옵션 검증
    const validSortFields = ['created_at', 'rating', 'like_count', 'comment_count'];
    const validOrders = ['ASC', 'DESC'];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeOrder = validOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';

    // 리뷰 목록 조회
    const reviewsQuery = `
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
      ${whereClause}
      ORDER BY r.${safeSortBy} ${safeOrder}
      LIMIT ? OFFSET ?
    `;

    queryParams.push(limit, offset);
    const reviews = await query<Review[]>(reviewsQuery, queryParams);

    // 총 개수 조회
    const countQuery = `
      SELECT COUNT(*) as total
      FROM reviews r
      ${whereClause}
    `;
    const countParams = queryParams.slice(0, -2); // limit, offset 제거
    const countResult = await query<{total: number}[]>(countQuery, countParams);
    const total = countResult[0]?.total || 0;

    // 이미지 파싱
    const reviewsWithParsedImages = reviews.map(review => {
      let parsedImages = [];
      if (review.images) {
        try {
          // 이미 배열이면 그대로 사용
          if (Array.isArray(review.images)) {
            parsedImages = review.images;
          } else if (typeof review.images === 'string') {
            // JSON 문자열이면 파싱 시도
            parsedImages = JSON.parse(review.images);
          }
        } catch (error) {
          // JSON 파싱 실패시 빈 배열
          parsedImages = [];
        }
      }
      
      return {
        ...review,
        images: parsedImages,
        user_nickname: review.user_nickname ? review.user_nickname.substring(0, 1) + '*'.repeat(review.user_nickname.length - 1) : '익명'
      };
    });

    return Response.json({
      success: true,
      data: {
        reviews: reviewsWithParsedImages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST: 리뷰 작성
export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return Response.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const { product_id, rating, content, images, order_item_id } = await req.json();

    if (!product_id || !rating) {
      return Response.json({
        success: false,
        error: 'Product ID and rating are required'
      }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return Response.json({
        success: false,
        error: 'Rating must be between 1 and 5'
      }, { status: 400 });
    }

    // 주문자 검증 및 중복 리뷰 확인
    if (order_item_id) {
      // 주문 아이템이 실제로 해당 사용자의 것인지 확인
      const orderItemCheck = await query<{user_id: number}[]>(`
        SELECT o.user_id
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE oi.id = ? AND o.user_id = ?
      `, [order_item_id, userId]);

      if (orderItemCheck.length === 0) {
        return Response.json({
          success: false,
          error: 'You can only review products you have purchased'
        }, { status: 403 });
      }

      // 이미 리뷰가 있는지 확인
      const existingReview = await query<{id: number}[]>(`
        SELECT id FROM reviews
        WHERE user_id = ? AND order_item_id = ?
      `, [userId, order_item_id]);

      if (existingReview.length > 0) {
        return Response.json({
          success: false,
          error: 'Review already exists for this order item'
        }, { status: 400 });
      }
    } else {
      // order_item_id가 없는 경우 구매 이력 확인
      const purchaseHistory = await query<{id: number}[]>(`
        SELECT oi.id
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE o.user_id = ? AND oi.product_id = ? AND o.status = 'delivered'
      `, [userId, product_id]);

      if (purchaseHistory.length === 0) {
        return Response.json({
          success: false,
          error: 'You can only review products you have purchased and received'
        }, { status: 403 });
      }

      // 해당 상품에 이미 리뷰를 작성했는지 확인
      const existingProductReview = await query<{id: number}[]>(`
        SELECT id FROM reviews
        WHERE user_id = ? AND product_id = ?
      `, [userId, product_id]);

      if (existingProductReview.length > 0) {
        return Response.json({
          success: false,
          error: 'You have already reviewed this product'
        }, { status: 400 });
      }
    }

    // 리뷰 생성
    const reviewData = [
      product_id,
      userId,
      order_item_id || null,
      rating,
      content || '',
      images ? JSON.stringify(images) : null
    ];

    const result = await query(`
      INSERT INTO reviews (product_id, user_id, order_item_id, rating, content, images)
      VALUES (?, ?, ?, ?, ?, ?)
    `, reviewData);

    const reviewId = (result as any).insertId;

    return Response.json({
      success: true,
      message: 'Review created successfully',
      reviewId
    });

  } catch (error) {
    console.error('Create review error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}