'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartContext } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface UserPoints {
  availablePoints: number;
  totalEarnedPoints: number;
}

export default function OrderPage() {
  const router = useRouter();
  const { cartItems, totalPrice, clearCart } = useCartContext();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  // 주문 정보 상태
  const [orderInfo, setOrderInfo] = useState({
    // 배송 정보
    recipientName: '',
    phone: '',
    zipCode: '',
    address: '',
    detailAddress: '',
    deliveryMemo: '',
    
    // 결제 정보
    paymentMethod: 'card',
    installment: '0',
    receiptType: 'none',
    
    // 포인트 사용
    usePoints: false,
    pointsToUse: 0,
    
    // 동의
    agreeTerms: false,
    agreePrivacy: false
  });

  const [userPoints, setUserPoints] = useState<UserPoints>({
    availablePoints: 0,
    totalEarnedPoints: 0
  });

  const [isLoading, setIsLoading] = useState(false);

  // 사용자 포인트 정보 가져오기 및 프로필 정보 자동 채우기
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserPoints();
      prefillUserInfo();
    }
  }, [isAuthenticated, user]);

  const prefillUserInfo = async () => {
    try {
      const response = await fetch('/api/me', {
        credentials: 'include'
      });
      if (response.ok) {
        const userData = await response.json();
        // 기존 사용자 정보가 있다면 미리 채우기
        if (userData.user) {
          setOrderInfo(prev => ({
            ...prev,
            recipientName: userData.user.nickname || prev.recipientName,
            phone: userData.user.phone || prev.phone,
          }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  // 로그인 체크
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "로그인이 필요합니다.",
        description: "주문하려면 먼저 로그인해주세요.",
        variant: "destructive",
      });
      router.push('/login?redirect_to=/order');
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "장바구니가 비어있습니다.",
        description: "상품을 담고 주문해주세요.",
        variant: "destructive",
      });
      router.push('/');
      return;
    }
  }, [isAuthenticated, cartItems, router, toast]);

  const fetchUserPoints = async () => {
    try {
      const response = await fetch('/api/points', {
        credentials: 'include',
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUserPoints({
            availablePoints: result.data.currentBalance,
            totalEarnedPoints: result.data.totalEarned
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch user points:', error);
    }
  };

  // 가격 계산
  const shippingFee = totalPrice >= 30000 ? 0 : 3000;
  const discountAmount = orderInfo.usePoints ? orderInfo.pointsToUse : 0;
  const finalAmount = Math.max(0, totalPrice + shippingFee - discountAmount);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setOrderInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePointsChange = (value: string) => {
    const points = Math.min(Number(value) || 0, userPoints.availablePoints, totalPrice);
    setOrderInfo(prev => ({ 
      ...prev, 
      pointsToUse: points,
      usePoints: points > 0
    }));
  };

  const handleSubmit = async () => {
    // 필수 입력 검증
    if (!orderInfo.recipientName || !orderInfo.phone || !orderInfo.address) {
      toast({
        title: "필수 정보를 입력해주세요.",
        description: "받는 사람 정보와 배송지를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!orderInfo.agreeTerms || !orderInfo.agreePrivacy) {
      toast({
        title: "약관 동의가 필요합니다.",
        description: "이용약관과 개인정보처리방침에 동의해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. 주문 생성
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          nameKo: item.nameKo,
          nameEn: item.nameEn,
          quantity: item.quantity,
          price: item.price,
          options: item.options,
          image: item.image
        })),
        shipping: {
          recipientName: orderInfo.recipientName,
          phone: orderInfo.phone,
          zipCode: orderInfo.zipCode,
          address: orderInfo.address,
          detailAddress: orderInfo.detailAddress,
          deliveryMemo: orderInfo.deliveryMemo
        },
        payment: {
          method: orderInfo.paymentMethod,
          installment: orderInfo.installment,
          receiptType: orderInfo.receiptType
        },
        amounts: {
          itemsTotal: totalPrice,
          shippingFee: shippingFee,
          pointsUsed: discountAmount,
          finalAmount: finalAmount
        },
        pointsToUse: orderInfo.usePoints ? orderInfo.pointsToUse : 0
      };

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });

      if (!orderResponse.ok) {
        throw new Error('주문 생성에 실패했습니다.');
      }

      const order = await orderResponse.json();
      const orderId = order.orderId;

      // 3. 사용자 정보 업데이트 (소셜 로그인 사용자의 경우)
      if (user && (user.username?.startsWith('kakao_') || user.username?.startsWith('naver_'))) {
        try {
          await fetch('/api/users/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              phone: orderInfo.phone,
              realName: orderInfo.recipientName, // 실명 저장
              lastUsedAddress: `${orderInfo.address} ${orderInfo.detailAddress}`.trim(),
              lastUsedZipCode: orderInfo.zipCode
            })
          });
        } catch (error) {
          console.error('Failed to update user profile:', error);
          // 프로필 업데이트 실패해도 주문은 계속 진행
        }
      }

      // 2. 결제 처리
      toast({
        title: "결제 페이지로 이동 중...",
        description: "안전한 결제를 위해 결제 창으로 이동합니다.",
      });

      // 포트원 결제 연동 (임시 - 나중에 실제 포트원으로 교체)
      setTimeout(async () => {
        // 결제 완료 처리 (임시)
        try {
          const paymentResponse = await fetch('/api/payment/complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              orderId: orderId,
              paymentKey: `payment_${Date.now()}`,
              amount: finalAmount
            })
          });

          const paymentResult = await paymentResponse.json();
          
          if (paymentResult.success) {
            toast({
              title: "결제가 완료되었습니다!",
              description: `${paymentResult.pointsEarned || 0}P가 적립되었습니다.`,
            });
          }
          
          clearCart();
          router.push(`/order-confirmation?orderId=${orderId}`);
        } catch (error) {
          console.error('Payment completion error:', error);
          clearCart();
          router.push(`/order-confirmation?orderId=${orderId}`);
        }
      }, 1500);

    } catch (error) {
      console.error('Order submission failed:', error);
      toast({
        title: "주문 처리 중 오류가 발생했습니다.",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || cartItems.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-center text-3xl font-bold mb-8">주문서 작성</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 주문 정보 입력 */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 배송 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>배송 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 소셜 로그인 사용자 안내 */}
              {user && (user.username?.startsWith('kakao_') || user.username?.startsWith('naver_')) && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        소셜 로그인 사용자 안내
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>주문을 위해 아래 정보를 입력해주세요:</p>
                        <ul className="mt-1 list-disc list-inside">
                          <li>실명 (받는 사람 이름)</li>
                          <li>연락처 (배송 및 주문 확인용)</li>
                          <li>배송 주소</li>
                        </ul>
                        <p className="mt-2 text-xs">
                          입력하신 정보는 이번 주문에만 사용되며, 다음 주문 시 다시 입력해주셔야 합니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipientName">받는 사람 *</Label>
                  <Input
                    id="recipientName"
                    value={orderInfo.recipientName}
                    onChange={(e) => handleInputChange('recipientName', e.target.value)}
                    placeholder="받는 사람 이름"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">연락처 *</Label>
                  <Input
                    id="phone"
                    value={orderInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="zipCode">우편번호</Label>
                  <Input
                    id="zipCode"
                    value={orderInfo.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="12345"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="address">주소 *</Label>
                  <Input
                    id="address"
                    value={orderInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="기본 주소"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="detailAddress">상세 주소</Label>
                <Input
                  id="detailAddress"
                  value={orderInfo.detailAddress}
                  onChange={(e) => handleInputChange('detailAddress', e.target.value)}
                  placeholder="상세 주소 (동/호수 등)"
                />
              </div>
              
              <div>
                <Label htmlFor="deliveryMemo">배송 메모</Label>
                <Textarea
                  id="deliveryMemo"
                  value={orderInfo.deliveryMemo}
                  onChange={(e) => handleInputChange('deliveryMemo', e.target.value)}
                  placeholder="배송 시 요청사항을 입력해주세요"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* 포인트 사용 */}
          <Card>
            <CardHeader>
              <CardTitle>포인트 사용</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>보유 포인트</span>
                <span className="font-semibold text-blue-600">
                  {userPoints.availablePoints.toLocaleString()}P
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="usePoints"
                  checked={orderInfo.usePoints}
                  onCheckedChange={(checked) => {
                    handleInputChange('usePoints', checked);
                    if (!checked) {
                      handleInputChange('pointsToUse', 0);
                    }
                  }}
                />
                <Label htmlFor="usePoints">포인트 사용</Label>
              </div>
              
              {orderInfo.usePoints && (
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={orderInfo.pointsToUse}
                    onChange={(e) => handlePointsChange(e.target.value)}
                    placeholder="사용할 포인트"
                    max={Math.min(userPoints.availablePoints, totalPrice)}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => handlePointsChange(String(Math.min(userPoints.availablePoints, totalPrice)))}
                  >
                    전액사용
                  </Button>
                </div>
              )}
              
              {orderInfo.usePoints && orderInfo.pointsToUse > 0 && (
                <p className="text-sm text-gray-600">
                  {orderInfo.pointsToUse.toLocaleString()}P 사용 → {discountAmount.toLocaleString()}원 할인
                </p>
              )}
            </CardContent>
          </Card>

          {/* 결제 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>결제 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>결제 수단</Label>
                <RadioGroup 
                  value={orderInfo.paymentMethod} 
                  onValueChange={(value) => handleInputChange('paymentMethod', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">신용/체크카드</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transfer" id="transfer" />
                    <Label htmlFor="transfer">계좌이체</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="kakao" id="kakao" />
                    <Label htmlFor="kakao">카카오페이</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="naver" id="naver" />
                    <Label htmlFor="naver">네이버페이</Label>
                  </div>
                </RadioGroup>
              </div>

              {orderInfo.paymentMethod === 'card' && (
                <div>
                  <Label htmlFor="installment">할부 개월</Label>
                  <select
                    id="installment"
                    value={orderInfo.installment}
                    onChange={(e) => handleInputChange('installment', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="0">일시불</option>
                    <option value="2">2개월</option>
                    <option value="3">3개월</option>
                    <option value="6">6개월</option>
                    <option value="12">12개월</option>
                  </select>
                </div>
              )}

              <div>
                <Label>현금영수증/세금계산서</Label>
                <RadioGroup 
                  value={orderInfo.receiptType} 
                  onValueChange={(value) => handleInputChange('receiptType', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="none" />
                    <Label htmlFor="none">신청안함</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="personal" id="personal" />
                    <Label htmlFor="personal">개인 현금영수증</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="business" id="business" />
                    <Label htmlFor="business">사업자 세금계산서</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* 약관 동의 */}
          <Card>
            <CardHeader>
              <CardTitle>약관 동의</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeTerms"
                  checked={orderInfo.agreeTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeTerms', checked)}
                />
                <Label htmlFor="agreeTerms">이용약관 및 주문내용 확인 동의 (필수)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreePrivacy"
                  checked={orderInfo.agreePrivacy}
                  onCheckedChange={(checked) => handleInputChange('agreePrivacy', checked)}
                />
                <Label htmlFor="agreePrivacy">개인정보처리방침 동의 (필수)</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 주문 요약 */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>주문 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 주문 상품 목록 */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.nameKo}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.nameKo}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity}개 × {item.price.toLocaleString()}원
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      {(item.quantity * item.price).toLocaleString()}원
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* 금액 계산 */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>상품금액</span>
                  <span>{totalPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span>배송비</span>
                  <span>{shippingFee.toLocaleString()}원</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>포인트 할인</span>
                    <span>-{discountAmount.toLocaleString()}원</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>최종 결제금액</span>
                  <span className="text-blue-600">{finalAmount.toLocaleString()}원</span>
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={isLoading || !orderInfo.agreeTerms || !orderInfo.agreePrivacy}
                className="w-full mt-6"
                size="lg"
              >
                {isLoading ? "결제 진행 중..." : `${finalAmount.toLocaleString()}원 결제하기`}
              </Button>

              <p className="text-xs text-center text-gray-500 mt-2">
                주문 완료 후 취소/변경이 어려우니 신중하게 확인해주세요.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}