'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface DashboardStats {
  overview: {
    total_users: number;
    total_products: number;
    total_orders: number;
    total_revenue: number;
    new_users_today: number;
    orders_today: number;
    revenue_today: number;
    avg_order_value: number;
  };
  orders: {
    statusBreakdown: Array<{
      status: string;
      count: number;
      total_amount: number;
    }>;
    recent: Array<{
      id: number;
      order_no: string;
      customer_name: string;
      total_amount: number;
      status: string;
      created_at: string;
      item_count: number;
    }>;
    monthlyTrend: Array<{
      month: string;
      order_count: number;
      revenue: number;
      unique_customers: number;
    }>;
  };
  products: {
    popular: Array<{
      id: number;
      name_ko: string;
      thumbnail_url: string;
      order_count: number;
      total_quantity: number;
      total_revenue: number;
    }>;
    lowStock: Array<{
      id: number;
      name_ko: string;
      thumbnail_url: string;
      stock: number;
      status: string;
    }>;
  };
}

const AdminDashboardPage = () => {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        console.error('Dashboard data fetch failed:', data.error);
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusName = (status: string) => {
    const names: Record<string, string> = {
      'pending': '대기중',
      'processing': '처리중',
      'shipped': '배송중',
      'delivered': '배송완료',
      'cancelled': '취소됨'
    };
    return names[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">대시보드 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">대시보드 데이터를 불러올 수 없습니다.</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin')}
            className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← 관리자 홈으로
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-gray-600 mt-2">시스템 전체 현황과 통계를 확인하세요</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/admin/category-shortcuts')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                카테고리 숏컷 관리
              </button>
              <button
                onClick={fetchDashboardData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Activity className="w-4 h-4" />
                새로고침
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                리포트 다운로드
              </button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 사용자</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(stats.overview.total_users)}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  오늘 +{stats.overview.new_users_today}명
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 상품</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(stats.overview.total_products)}
                </p>
                <p className="text-sm text-gray-500 mt-1">활성 상품</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 주문</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(stats.overview.total_orders)}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  오늘 +{stats.overview.orders_today}건
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 매출</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.overview.total_revenue)}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  오늘 {formatCurrency(stats.overview.revenue_today)}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 주문 상태 차트 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">주문 상태별 현황</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {stats.orders.statusBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusName(item.status)}
                    </div>
                    <span className="text-sm text-gray-600">{item.count}건</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.total_amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 월별 트렌드 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">월별 매출 트렌드</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {stats.orders.monthlyTrend.slice(0, 6).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{item.month}</span>
                    <span className="text-xs text-gray-500 ml-2">{item.order_count}건</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(item.revenue)}
                    </div>
                    <div className="text-xs text-gray-500">
                      고객 {item.unique_customers}명
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 인기 상품 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">인기 상품</h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {stats.products.popular.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={product.thumbnail_url || '/placeholder.png'}
                      alt={product.name_ko}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name_ko}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.order_count}건 주문 · {product.total_quantity}개 판매
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(product.total_revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 최근 주문 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">최근 주문</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {stats.orders.recent.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {order.order_no}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusName(order.status)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {order.customer_name} · {order.item_count}개 상품
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 재고 부족 상품 알림 */}
        {stats.products.lowStock.length > 0 && (
          <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingDown className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-orange-900">재고 부족 상품</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.products.lowStock.map((product) => (
                <div key={product.id} className="bg-white rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.thumbnail_url || '/placeholder.png'}
                      alt={product.name_ko}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name_ko}
                      </p>
                      <p className="text-xs text-orange-600 font-medium">
                        재고 {product.stock}개 남음
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 추가 통계 */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">주요 지표</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(stats.overview.avg_order_value)}
              </p>
              <p className="text-sm text-gray-600 mt-1">평균 주문 금액</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {stats.orders.monthlyTrend.length > 0 ?
                  `${((stats.orders.monthlyTrend[0]?.revenue || 0) / (stats.orders.monthlyTrend[1]?.revenue || 1) * 100 - 100).toFixed(1)}%`
                  : '0%'
                }
              </p>
              <p className="text-sm text-gray-600 mt-1">전월 대비 매출 증가율</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {stats.orders.monthlyTrend.reduce((sum, item) => sum + item.unique_customers, 0)}
              </p>
              <p className="text-sm text-gray-600 mt-1">총 활성 고객 수</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;