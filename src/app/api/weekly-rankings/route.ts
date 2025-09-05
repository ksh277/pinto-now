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
        s.brand_name as seller_name
      FROM weekly_rankings wr
      JOIN products p ON wr.product_id = p.id
      JOIN sellers s ON p.seller_id = s.id
      WHERE wr.seller_type = ? 
      AND wr.week_start = ?
      AND p.status = 'ACTIVE'
      ORDER BY wr.rank_position ASC
      LIMIT ?
    `, [sellerType, weekStartStr, limit]);

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
        s.brand_name as seller_name
      FROM weekly_rankings wr
      JOIN products p ON wr.product_id = p.id
      JOIN sellers s ON p.seller_id = s.id
      WHERE wr.seller_type = ? 
      AND wr.week_start = ?
      AND p.status = 'ACTIVE'
      ORDER BY wr.rank_position ASC
      LIMIT ?
    `, [sellerType, weekStartStr, limit]);

    return Response.json({
      success: true,
      data: newRankings,
      weekStart: weekStartStr,
      weekEnd: weekEndStr,
      cached: false
    });

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