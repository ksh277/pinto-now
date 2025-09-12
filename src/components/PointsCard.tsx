'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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

export default function PointsCard() {
  const { user } = useAuth();
  const [points, setPoints] = useState<UserPoints | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    if (!user) {
      // 로그인하지 않은 경우 기본 포인트 데이터 설정
      setPoints({
        currentBalance: 0,
        totalEarned: 0,
        totalSpent: 0,
        recentTransactions: []
      });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/points', {
        credentials: 'include', // 쿠키 포함
      });

      const result = await response.json();
      
      if (result.success) {
        setPoints(result.data);
        setError(null);
      } else {
        // API 에러가 있어도 기본값 표시
        setPoints({
          currentBalance: 0,
          totalEarned: 0,
          totalSpent: 0,
          recentTransactions: []
        });
        setError(null); // 에러를 숨기고 기본값 표시
      }
    } catch (err) {
      // 네트워크 에러가 있어도 기본값 표시
      setPoints({
        currentBalance: 0,
        totalEarned: 0,
        totalSpent: 0,
        recentTransactions: []
      });
      setError(null); // 에러를 숨기고 기본값 표시
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (direction: string) => {
    switch (direction) {
      case 'EARN':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'SPEND':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'EXPIRE':
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <Coins className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTransactionColor = (direction: string) => {
    switch (direction) {
      case 'EARN':
        return 'text-green-600';
      case 'SPEND':
        return 'text-red-600';
      case 'EXPIRE':
        return 'text-orange-600';
      default:
        return 'text-blue-600';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            포인트
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            포인트
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-sm">{error}</p>
          <button
            onClick={fetchPoints}
            className="mt-2 text-blue-500 text-sm hover:underline"
          >
            다시 시도
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="w-5 h-5" />
          포인트
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Balance */}
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {points?.currentBalance?.toLocaleString() || 0}P
          </p>
          <p className="text-sm text-muted-foreground">보유 포인트</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="font-semibold text-green-600">
              {points?.totalEarned?.toLocaleString() || 0}P
            </p>
            <p className="text-xs text-green-600">총 적립</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="font-semibold text-red-600">
              {points?.totalSpent?.toLocaleString() || 0}P
            </p>
            <p className="text-xs text-red-600">총 사용</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h4 className="font-medium text-sm mb-3">최근 포인트 내역</h4>
          <div className="space-y-2">
            {points?.recentTransactions?.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {getTransactionIcon(transaction.direction)}
                  <div>
                    <p className="text-sm font-medium">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(transaction.created_at)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${getTransactionColor(transaction.direction)}`}>
                    {transaction.direction === 'EARN' ? '+' : '-'}{transaction.amount.toLocaleString()}P
                  </p>
                  <p className="text-xs text-muted-foreground">
                    잔액: {transaction.balance.toLocaleString()}P
                  </p>
                </div>
              </div>
            )) || []}
            
            {(!points?.recentTransactions || points.recentTransactions.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                포인트 내역이 없습니다.
              </p>
            )}
          </div>
        </div>

        {/* Points Info */}
        <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
          <p>💡 <strong>포인트 안내</strong></p>
          <ul className="mt-1 space-y-1 ml-2">
            <li>• 결제 완료 시 결제금액의 2% 적립</li>
            <li>• 결제 시 보유 포인트 사용 가능</li>
            <li>• 포인트는 1년간 유효</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}