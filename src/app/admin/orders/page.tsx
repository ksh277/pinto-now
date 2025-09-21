'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Order = {
  id: string;
  order_no?: string;
  user_id: string;
  status: string;
  total_amount: number;
  created_at: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  items?: Array<{
    id: string;
    product_name: string;
    quantity: number;
    price: number;
    options?: string;
    design_file_name?: string;
    design_file_url?: string;
  }>;
}

const statusLabels: Record<string, string> = {
  pending: '대기중',
  processing: '처리중',
  shipped: '배송중',
  delivered: '완료',
  cancelled: '취소됨'
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        (order.order_no && order.order_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.customer_email && order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders();
      } else {
        alert('주문 상태 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('주문 상태 업데이트 중 오류가 발생했습니다.');
    }
  };

  const downloadDesignFile = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/download-design`);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;

        const filename = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || `design_${orderId}.pdf`;
        a.download = filename;

        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('디자인 파일을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('Error downloading design file:', error);
      alert('디자인 파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  const bulkUpdateStatus = async (newStatus: string) => {
    try {
      const updatePromises = selectedOrders.map(orderId =>
        fetch(`/api/admin/orders/${orderId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        })
      );

      await Promise.all(updatePromises);
      setSelectedOrders([]);
      fetchOrders();
    } catch (error) {
      console.error('Error bulk updating orders:', error);
      alert('일괄 업데이트 중 오류가 발생했습니다.');
    }
  };

  const exportToCSV = () => {
    const headers = ['주문번호', '사용자ID', '상태', '총금액', '주문일시'];
    const csvData = filteredOrders.map(order => [
      order.order_no || order.id,
      order.user_id,
      statusLabels[order.status] || order.status,
      order.total_amount,
      new Date(order.created_at).toLocaleString('ko-KR')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">주문 데이터를 로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">주문 관리</h1>
        <Button onClick={exportToCSV}>CSV 내보내기</Button>
      </div>

      {/* 필터 및 검색 */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="주문번호, 고객명, 이메일로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="상태 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 상태</SelectItem>
            {Object.entries(statusLabels).map(([status, label]) => (
              <SelectItem key={status} value={status}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedOrders.length > 0 && (
          <Select onValueChange={bulkUpdateStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={`${selectedOrders.length}개 일괄변경`} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusLabels).map(([status, label]) => (
                <SelectItem key={status} value={status}>{label}로 변경</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* 주문 목록 */}
      <div className="space-y-4">
        {/* 전체 선택 */}
        <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
          <Checkbox
            checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
            onCheckedChange={toggleAllOrders}
          />
          <span className="text-sm text-gray-600">
            전체 선택 ({selectedOrders.length}/{filteredOrders.length})
          </span>
        </div>

        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">표시할 주문이 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map(order => (
            <Card key={order.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedOrders.includes(order.id)}
                    onCheckedChange={() => toggleOrderSelection(order.id)}
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">
                        주문 #{order.order_no || order.id}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="text-gray-600">사용자 ID: {order.user_id}</p>
                      <p className="text-sm text-gray-500">
                        상품 {order.items?.length || 0}개
                      </p>
                    </div>
                  </div>
                  <Badge className={statusColors[order.status] || 'bg-gray-100 text-gray-800'}>
                    {statusLabels[order.status] || order.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">
                    {order.total_amount?.toLocaleString()}원
                  </span>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                        상세보기
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>주문 상세 정보</DialogTitle>
                      </DialogHeader>
                      {selectedOrder && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">주문 정보</h4>
                              <p>주문번호: {selectedOrder.order_no || selectedOrder.id}</p>
                              <p>주문일시: {new Date(selectedOrder.created_at).toLocaleString('ko-KR')}</p>
                              <p>총 금액: {selectedOrder.total_amount?.toLocaleString()}원</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">고객 정보</h4>
                              <p>사용자 ID: {selectedOrder.user_id}</p>
                              {selectedOrder.customer_name && <p>이름: {selectedOrder.customer_name}</p>}
                              {selectedOrder.customer_email && <p>이메일: {selectedOrder.customer_email}</p>}
                              {selectedOrder.customer_phone && <p>전화번호: {selectedOrder.customer_phone}</p>}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">주문 상품</h4>
                            {selectedOrder.items?.map((item, index) => (
                              <div key={index} className="border p-3 rounded mb-2">
                                <p className="font-medium">{item.product_name}</p>
                                <p>수량: {item.quantity}개</p>
                                <p>가격: {item.price?.toLocaleString()}원</p>
                                {item.options && <p>옵션: {item.options}</p>}
                                {item.design_file_name && (
                                  <div className="mt-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => downloadDesignFile(selectedOrder.id)}
                                    >
                                      📄 디자인 파일 다운로드
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">상태 변경</h4>
                            <div className="space-y-2">
                              {Object.entries(statusLabels).map(([status, label]) => (
                                <Button
                                  key={status}
                                  variant={selectedOrder.status === status ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => updateOrderStatus(selectedOrder.id, status)}
                                  className="mr-2"
                                >
                                  {label}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="sm"
                    onClick={() => downloadDesignFile(order.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    📄 PDF
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}