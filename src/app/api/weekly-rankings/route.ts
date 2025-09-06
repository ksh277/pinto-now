import { NextRequest } from 'next/server';
import { query } from '@/lib/mysql';

interface WeeklyRankingResult {
  product_id: number;
  seller_type: string;
  sales_count: number;
  click_count: number;
  ranking_score: number;
  rank_position: number;
  product_name: string;
  product_price: number;
  product_image: string;
  seller_name: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerType = searchParams.get('sellerType') || 'CREATOR';
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get current week boundaries
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    // Temporary sample data for weekly rankings
    const sampleRankings: WeeklyRankingResult[] = [
      {
        product_id: 1001,
        seller_type: 'individual',
        sales_count: 45,
        click_count: 234,
        ranking_score: 684,
        rank_position: 1,
        product_name: '커스텀 아크릴 키링',
        product_price: 8500,
        product_image: 'https://placehold.co/600x600/FFB6C1/333?text=🔑',
        seller_name: '창작자A'
      },
      {
        product_id: 1002,
        seller_type: 'individual',
        sales_count: 38,
        click_count: 189,
        ranking_score: 569,
        rank_position: 2,
        product_name: '개인맞춤 아크릴 스탠드',
        product_price: 12000,
        product_image: 'https://placehold.co/600x600/87CEEB/333?text=🖼️',
        seller_name: '작가B'
      },
      {
        product_id: 1003,
        seller_type: 'individual',
        sales_count: 32,
        click_count: 156,
        ranking_score: 476,
        rank_position: 3,
        product_name: '나만의 휴대폰 케이스',
        product_price: 15000,
        product_image: 'https://placehold.co/600x600/98FB98/333?text=📱',
        seller_name: '개인창작자C'
      },
      {
        product_id: 1004,
        seller_type: 'individual',
        sales_count: 28,
        click_count: 142,
        ranking_score: 422,
        rank_position: 4,
        product_name: '커스텀 코스터',
        product_price: 6500,
        product_image: 'https://placehold.co/600x600/DDA0DD/333?text=☕',
        seller_name: '창작자D'
      },
      {
        product_id: 1005,
        seller_type: 'individual',
        sales_count: 24,
        click_count: 128,
        ranking_score: 368,
        rank_position: 5,
        product_name: '개인맞춤 배지',
        product_price: 4500,
        product_image: 'https://placehold.co/600x600/FFE4B5/333?text=🏷️',
        seller_name: '작가E'
      },
      {
        product_id: 1006,
        seller_type: 'individual',
        sales_count: 21,
        click_count: 115,
        ranking_score: 325,
        rank_position: 6,
        product_name: '맞춤형 스마트톡',
        product_price: 9000,
        product_image: 'https://placehold.co/600x600/F0E68C/333?text=📲',
        seller_name: '개인창작자F'
      },
      {
        product_id: 1007,
        seller_type: 'individual',
        sales_count: 18,
        click_count: 98,
        ranking_score: 278,
        rank_position: 7,
        product_name: '개인 굿즈 파우치',
        product_price: 11500,
        product_image: 'https://placehold.co/600x600/F5DEB3/333?text=👛',
        seller_name: '창작자G'
      },
      {
        product_id: 1008,
        seller_type: 'individual',
        sales_count: 15,
        click_count: 87,
        ranking_score: 237,
        rank_position: 8,
        product_name: '맞춤 문구용품',
        product_price: 7500,
        product_image: 'https://placehold.co/600x600/E6E6FA/333?text=✏️',
        seller_name: '작가H'
      }
    ];

    // Filter and limit sample data based on request
    const filteredData = sampleRankings.slice(0, limit);

    // Return sample data immediately 
    return Response.json({
      success: true,
      data: filteredData,
      weekStart: weekStartStr,
      weekEnd: weekEndStr,
      cached: false,
      sampleData: true
    });

    // Map sellerType from frontend to database values (commented out for now)
    /*
    const dbSellerType = sellerType === 'INDIVIDUAL' ? 'individual' : 
                        sellerType === 'CREATOR' ? 'individual' :
                        sellerType === 'BUSINESS' ? 'business' : 'individual';

    // Database queries commented out - using sample data for now
    /*
    // Check if we have cached results for this week
    const cachedRankings = await query<WeeklyRankingResult[]>(`
      SELECT 
        wr.product_id,
        wr.seller_type,
        wr.sales_count,
        wr.click_count,
        wr.ranking_score,
        wr.rank_position,
        p.name as product_name,
        p.price as product_price,
        p.thumbnail_url as product_image,
        u.username as seller_name
      FROM weekly_rankings wr
      JOIN products p ON wr.product_id = p.id
      JOIN users u ON p.seller_id = u.id
      WHERE wr.seller_type = ? 
      AND wr.week_start = ?
      AND p.status = 'ACTIVE'
      ORDER BY wr.rank_position ASC
      LIMIT ?
    `, [dbSellerType, weekStartStr, limit]);

    if (cachedRankings.length > 0) {
      return Response.json({
        success: true,
        data: cachedRankings,
        weekStart: weekStartStr,
        weekEnd: weekEndStr,
        cached: true
      });
    }

    // If no cached data, calculate fresh rankings
    await calculateWeeklyRankings(weekStartStr, weekEndStr, sellerType as any);

    // Fetch the newly calculated rankings
    const newRankings = await query<WeeklyRankingResult[]>(`
      SELECT 
        wr.product_id,
        wr.seller_type,
        wr.sales_count,
        wr.click_count,
        wr.ranking_score,
        wr.rank_position,
        p.name as product_name,
        p.price as product_price,
        p.thumbnail_url as product_image,
        u.username as seller_name
      FROM weekly_rankings wr
      JOIN products p ON wr.product_id = p.id
      JOIN users u ON p.seller_id = u.id
      WHERE wr.seller_type = ? 
      AND wr.week_start = ?
      AND p.status = 'ACTIVE'
      ORDER BY wr.rank_position ASC
      LIMIT ?
    `, [dbSellerType, weekStartStr, limit]);

    return Response.json({
      success: true,
      data: newRankings,
      weekStart: weekStartStr,
      weekEnd: weekEndStr,
      cached: false
    });
    */

  } catch (error) {
    console.error('Weekly rankings error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function calculateWeeklyRankings(
  weekStart: string, 
  weekEnd: string, 
  sellerType: 'CREATOR' | 'AUTHOR' | 'INDIVIDUAL'
) {
  // Get products for the specified seller type
  const products = await query<{
    product_id: number;
    sales_count: number;
    click_count: number;
  }[]>(`
    SELECT 
      p.id as product_id,
      COALESCE(SUM(oi.qty), 0) as sales_count,
      COALESCE(click_stats.click_count, 0) as click_count
    FROM products p
    JOIN sellers s ON p.seller_id = s.id
    LEFT JOIN order_items oi ON p.id = oi.product_id 
      AND oi.created_at >= ? 
      AND oi.created_at <= ?
    LEFT JOIN (
      SELECT 
        product_id, 
        COUNT(*) as click_count
      FROM product_clicks 
      WHERE clicked_at >= ? 
      AND clicked_at <= ?
      GROUP BY product_id
    ) click_stats ON p.id = click_stats.product_id
    WHERE s.seller_type = ?
    AND p.status = 'ACTIVE'
    GROUP BY p.id
  `, [weekStart, weekEnd, weekStart, weekEnd, sellerType]);

  // Calculate ranking scores (sales weighted more than clicks)
  const rankedProducts = products.map(product => ({
    ...product,
    ranking_score: (product.sales_count * 10) + (product.click_count * 1)
  })).sort((a, b) => b.ranking_score - a.ranking_score);

  // Clear existing rankings for this week and seller type
  await query(`
    DELETE FROM weekly_rankings 
    WHERE week_start = ? AND seller_type = ?
  `, [weekStart, sellerType]);

  // Insert new rankings
  for (let i = 0; i < rankedProducts.length; i++) {
    const product = rankedProducts[i];
    await query(`
      INSERT INTO weekly_rankings 
      (product_id, seller_type, week_start, week_end, sales_count, click_count, ranking_score, rank_position)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      product.product_id,
      sellerType,
      weekStart,
      weekEnd,
      product.sales_count,
      product.click_count,
      product.ranking_score,
      i + 1
    ]);
  }
}

// POST endpoint to manually recalculate rankings
export async function POST(req: NextRequest) {
  try {
    const { sellerType = 'CREATOR' } = await req.json();

    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    await calculateWeeklyRankings(weekStartStr, weekEndStr, sellerType);

    return Response.json({
      success: true,
      message: 'Weekly rankings recalculated successfully',
      weekStart: weekStartStr,
      weekEnd: weekEndStr
    });

  } catch (error) {
    console.error('Recalculate rankings error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}