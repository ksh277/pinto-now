
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type DashboardStats = {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: string;
    order_no: string;
    customer_name: string;
    total_amount: number;
    status: string;
    created_at: string;
  }>;
};

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const apiData = await response.json();
        if (apiData.success && apiData.data) {
          // API 응답 구조에 맞게 데이터 변환
          const transformedStats: DashboardStats = {
            totalProducts: apiData.data.overview.total_products || 0,
            totalOrders: apiData.data.overview.total_orders || 0,
            pendingOrders: apiData.data.orders.statusBreakdown?.find((s: any) => s.status === 'pending')?.count || 0,
            totalRevenue: apiData.data.overview.total_revenue || 0,
            recentOrders: apiData.data.orders.recent || []
          };
          setStats(transformedStats);
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // 기본값 설정
      setStats({
        totalProducts: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        recentOrders: []
      });
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusLabels: Record<string, string> = {
    pending: '대기중',
    processing: '처리중',
    shipped: '배송중',
    delivered: '완료',
    cancelled: '취소됨'
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">대시보드 데이터를 로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">관리자 대시보드</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/orders">주문 관리</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/products">상품 관리</Link>
          </Button>
        </div>
      </div>

      {/* 통계 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 상품</CardTitle>
            <div className="text-2xl">📦</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">등록된 상품 수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 주문</CardTitle>
            <div className="text-2xl">🛒</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">전체 주문 건수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">대기 주문</CardTitle>
            <div className="text-2xl">⏳</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingOrders || 0}</div>
            <p className="text-xs text-muted-foreground">처리 대기 중</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 매출</CardTitle>
            <div className="text-2xl">💰</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalRevenue?.toLocaleString() || 0}원
            </div>
            <p className="text-xs text-muted-foreground">누적 매출</p>
          </CardContent>
        </Card>
      </div>

      {/* 최근 주문 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 주문</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">주문 #{order.order_no}</h4>
                    <p className="text-sm text-gray-600">{order.customer_name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{order.total_amount.toLocaleString()}원</p>
                    <Badge className={statusColors[order.status] || 'bg-gray-100 text-gray-800'}>
                      {statusLabels[order.status] || order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">최근 주문이 없습니다.</p>
          )}
        </CardContent>
      </Card>

      {/* 빠른 링크 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/orders">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold mb-2">주문 관리</h3>
              <p className="text-sm text-gray-600">주문 조회, 상태 변경, PDF 다운로드</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/products">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-semibold mb-2">상품 관리</h3>
              <p className="text-sm text-gray-600">상품 등록, 수정, 가격 관리</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/users">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-semibold mb-2">사용자 관리</h3>
              <p className="text-sm text-gray-600">회원 조회, 권한 관리</p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
