
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { XCircle, Package, Truck, FileText, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrdersPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isLoading, isAuthenticated, router]);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders', {
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'payment_pending': return <ShoppingCart className="w-4 h-4" />;
            case 'preparing': return <Package className="w-4 h-4" />;
            case 'shipping': return <Truck className="w-4 h-4" />;
            case 'delivered': return <FileText className="w-4 h-4" />;
            default: return <ShoppingCart className="w-4 h-4" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'payment_pending': return '입금대기';
            case 'preparing': return '배송준비중';
            case 'shipping': return '배송중';
            case 'delivered': return '배송완료';
            default: return '주문접수';
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
        <h1 className="text-3xl font-bold mb-8">주문/배송 조회</h1>
        {loading ? (
            <Card>
                <CardContent className="text-center py-20">
                    <p>로딩 중...</p>
                </CardContent>
            </Card>
        ) : orders.length > 0 ? (
            <div className="space-y-4">
                {orders.map((order) => (
                    <Card key={order.id}>
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">
                                    주문번호: {order.orderNumber}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(order.status)}
                                    <span className="text-sm font-medium">
                                        {getStatusText(order.status)}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                주문일자: {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {order.items?.map((item: any, index: number) => (
                                    <div key={index} className="flex justify-between items-center border-b pb-3 last:border-b-0">
                                        <div className="flex-1">
                                            <p className="font-medium">{item.productName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                수량: {item.quantity}개 | {item.price?.toLocaleString()}원
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-3 border-t font-bold">
                                    <span>총 결제금액</span>
                                    <span>{order.totalAmount?.toLocaleString()}원</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        ) : (
            <Card>
                <CardHeader>
                    <CardTitle>주문내역 조회</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-20">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <XCircle className="w-16 h-16 mb-4" />
                        <p>주문 내역이 없습니다.</p>
                    </div>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
