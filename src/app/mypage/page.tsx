
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronRight, FileText, Package, ShoppingCart, Truck, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import PointsCard from '@/components/PointsCard';

const OrderStatusCard = ({ title, count, icon: Icon }: { title: string; count: number; icon: React.ElementType }) => (
  <div className="flex flex-col items-center gap-2">
    <Icon className="w-8 h-8 text-muted-foreground" />
    <span className="font-semibold text-lg">{count}</span>
    <span className="text-sm text-muted-foreground">{title}</span>
  </div>
);

const MyInfoLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} className="flex items-center justify-between py-3 text-foreground hover:text-primary transition-colors">
        <span>{children}</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </Link>
)

export default function MyPage() {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const router = useRouter();
    const [orderStats, setOrderStats] = useState({
        orderStatus: {
            paymentPending: 0,
            preparing: 0,
            shipping: 0,
            delivered: 0,
        },
        claimStatus: {
            cancelled: 0,
            exchanged: 0,
            returned: 0,
        }
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
        if (isAuthenticated) {
            fetchOrderStats();
            fetchRecentOrders();
        }
    }, [isLoading, isAuthenticated, router]);

    const fetchOrderStats = async () => {
        try {
            const response = await fetch('/api/orders/stats', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setOrderStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch order stats:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    const fetchRecentOrders = async () => {
        try {
            const response = await fetch('/api/orders', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setRecentOrders(data.orders.slice(0, 5));
            }
        } catch (error) {
            console.error('Failed to fetch recent orders:', error);
        }
    };
    
    if (isLoading || !isAuthenticated) {
        return (
             <div className="flex h-screen items-center justify-center">
                <p>Redirecting...</p>
            </div>
        );
    }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">마이페이지</h1>
        <p className="text-lg text-muted-foreground">
          {user?.nickname || user?.name || user?.username}님의 주문 및 활동 내역을 확인하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>나의 주문처리 현황 (최근 3개월 기준)</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-around p-8">
                {statsLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>로딩 중...</p>
                    </div>
                ) : (
                    <>
                        <OrderStatusCard title="입금전" count={orderStats.orderStatus.paymentPending} icon={ShoppingCart} />
                        <ChevronRight className="w-6 h-6 text-gray-300" />
                        <OrderStatusCard title="배송준비중" count={orderStats.orderStatus.preparing} icon={Package} />
                        <ChevronRight className="w-6 h-6 text-gray-300" />
                        <OrderStatusCard title="배송중" count={orderStats.orderStatus.shipping} icon={Truck} />
                        <ChevronRight className="w-6 h-6 text-gray-300" />
                        <OrderStatusCard title="배송완료" count={orderStats.orderStatus.delivered} icon={FileText} />
                    </>
                )}
                </CardContent>
                <div className="border-t grid grid-cols-3 divide-x">
                    <div className="p-4 text-center text-sm text-muted-foreground">취소: <span className="font-semibold text-foreground">{orderStats.claimStatus.cancelled}</span></div>
                    <div className="p-4 text-center text-sm text-muted-foreground">교환: <span className="font-semibold text-foreground">{orderStats.claimStatus.exchanged}</span></div>
                    <div className="p-4 text-center text-sm text-muted-foreground">반품: <span className="font-semibold text-foreground">{orderStats.claimStatus.returned}</span></div>
                </div>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>최근 주문내역</CardTitle>
                </CardHeader>
                <CardContent>
                {recentOrders.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <XCircle className="w-16 h-16 mb-4" />
                            <p>주문 내역이 없습니다.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.order_id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-medium">주문번호: {order.order_number}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{order.final_amount.toLocaleString()}원</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            order.status === 'shipping' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {order.status === 'pending' ? '입금대기' :
                                             order.status === 'preparing' ? '배송준비' :
                                             order.status === 'shipping' ? '배송중' :
                                             order.status === 'completed' ? '배송완료' : order.status}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    받는분: {order.recipient_name}
                                </p>
                            </div>
                        ))}
                        <div className="text-center pt-4">
                            <Link href="/orders">
                                <Button variant="outline">전체 주문내역 보기</Button>
                            </Link>
                        </div>
                    </div>
                )}
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-1 space-y-8">
            <PointsCard />
            
            <Card>
                <CardHeader>
                    <CardTitle>나의 정보</CardTitle>
                </CardHeader>
                <CardContent className="divide-y">
                    <MyInfoLink href="/mypage/edit">회원 정보 수정</MyInfoLink>
                    <MyInfoLink href="/mypage/change-password">비밀번호 변경</MyInfoLink>
                    <MyInfoLink href="/mypage/inquiries">1:1 문의 내역</MyInfoLink>
                    <MyInfoLink href="/orders">주문/배송 조회</MyInfoLink>
                    <MyInfoLink href="/cart">장바구니</MyInfoLink>
                     <div className="py-3">
                      <Button variant="outline" size="sm" onClick={logout} className="w-full">
                        로그아웃
                      </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
