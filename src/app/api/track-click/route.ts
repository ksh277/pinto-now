import { NextRequest } from 'next/server';
import { query } from '@/lib/mysql';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { productId, userId } = await req.json();
    
    if (!productId) {
      return Response.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 });
    }

    // Get client info
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || '';
    const forwarded = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const ipAddress = forwarded?.split(',')[0] || realIp || req.ip || 'unknown';

    // Check if this IP clicked this product in the last hour to prevent spam
    const recentClicks = await query(`
      SELECT id FROM product_clicks 
      WHERE product_id = ? 
      AND ip_address = ? 
      AND clicked_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
    `, [productId, ipAddress]);

    if (Array.isArray(recentClicks) && recentClicks.length > 0) {
      // Don't track duplicate clicks from same IP within an hour
      return Response.json({
        success: true,
        message: 'Click already tracked recently'
      });
    }

    // Track the click
    await query(`
      INSERT INTO product_clicks (product_id, user_id, ip_address, user_agent)
      VALUES (?, ?, ?, ?)
    `, [productId, userId || null, ipAddress, userAgent]);

    return Response.json({
      success: true,
      message: 'Click tracked successfully'
    });

  } catch (error) {
    console.error('Track click error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}