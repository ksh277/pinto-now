import { NextRequest } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyToken } from '@/lib/auth/jwt';

interface PointTransaction {
  id: number;
  direction: 'EARN' | 'SPEND' | 'EXPIRE' | 'ADJUST';
  amount: number;
  balance: number;
  description: string;
  created_at: string;
}

interface UserPoints {
  currentBalance: number;
  totalEarned: number;
  totalSpent: number;
  recentTransactions: PointTransaction[];
}

async function getUserIdFromToken(request: NextRequest): Promise<string | null> {
  try {
    const cookie = request.cookies.get('session')?.value;
    if (!cookie) return null;
    
    const decoded = await verifyToken(cookie);
    if (!decoded) return null;
    
    return decoded.id;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return Response.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    // Get current balance (latest balance from point_ledger)
    const latestBalanceResult = await query<{ balance: number }[]>(`
      SELECT balance 
      FROM point_ledger 
      WHERE user_id = ? 
      ORDER BY created_at DESC, id DESC 
      LIMIT 1
    `, [userId]);

    const currentBalance = latestBalanceResult[0]?.balance || 0;

    // Get total earned points
    const totalEarnedResult = await query<{ total_earned: number }[]>(`
      SELECT COALESCE(SUM(amount), 0) as total_earned
      FROM point_ledger 
      WHERE user_id = ? AND direction = 'EARN'
    `, [userId]);

    const totalEarned = totalEarnedResult[0]?.total_earned || 0;

    // Get total spent points
    const totalSpentResult = await query<{ total_spent: number }[]>(`
      SELECT COALESCE(SUM(amount), 0) as total_spent
      FROM point_ledger 
      WHERE user_id = ? AND direction = 'SPEND'
    `, [userId]);

    const totalSpent = totalSpentResult[0]?.total_spent || 0;

    // Get recent transactions
    const recentTransactions = await query<PointTransaction[]>(`
      SELECT id, direction, amount, balance, description, created_at
      FROM point_ledger 
      WHERE user_id = ? 
      ORDER BY created_at DESC, id DESC 
      LIMIT 10
    `, [userId]);

    const response: UserPoints = {
      currentBalance,
      totalEarned,
      totalSpent,
      recentTransactions
    };

    return Response.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Points API error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST endpoint to add points (for testing purposes)
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return Response.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const { amount, direction, description } = await req.json();

    if (!amount || !direction || !description) {
      return Response.json({
        success: false,
        error: 'Amount, direction and description are required'
      }, { status: 400 });
    }

    // Get current balance
    const latestBalanceResult = await query<{ balance: number }[]>(`
      SELECT balance 
      FROM point_ledger 
      WHERE user_id = ? 
      ORDER BY created_at DESC, id DESC 
      LIMIT 1
    `, [userId]);

    const currentBalance = latestBalanceResult[0]?.balance || 0;
    
    // Calculate new balance
    let newBalance = currentBalance;
    if (direction === 'EARN') {
      newBalance = currentBalance + amount;
    } else if (direction === 'SPEND') {
      if (currentBalance < amount) {
        return Response.json({
          success: false,
          error: 'Insufficient points'
        }, { status: 400 });
      }
      newBalance = currentBalance - amount;
    }

    // Add transaction
    await query(`
      INSERT INTO point_ledger (user_id, direction, amount, balance, description)
      VALUES (?, ?, ?, ?, ?)
    `, [userId, direction, amount, newBalance, description]);

    return Response.json({
      success: true,
      message: 'Points transaction added successfully',
      newBalance
    });

  } catch (error) {
    console.error('Add points error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}