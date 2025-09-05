
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { User } from '@/lib/types';

// Form data type
type UserUpdateFormData = {
  name?: string;
  nickname?: string;
  phone?: string;
  tel?: string;
  zipcode?: string;
  address1?: string;
  address2?: string;
  receive_sms?: boolean;
  receive_email?: boolean;
  is_lifetime_member?: boolean;
};


function openKakaoAddressSearch(
  setValue: (field: keyof UserUpdateFormData, value: string) => void,
) {
  if (typeof window === "undefined" || !window.daum) return;

  new window.daum.Postcode({
    oncomplete: function (data: { zonecode: string; address: string }) {
      setValue("zipcode", data.zonecode);
      setValue("address1", data.address);
      setValue("address2", ''); // Clear detail address
    },
  }).open();
}

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<UserUpdateFormData>({
    defaultValues: {
      name: user?.name || '',
      nickname: user?.nickname || '',
      phone: user?.phone || '',
      tel: user?.tel || '',
      zipcode: user?.zipcode || '',
      address1: user?.address1 || '',
      address2: user?.address2 || '',
      receive_sms: user?.receive_sms ?? true,
      receive_email: user?.receive_email ?? true,
      is_lifetime_member: user?.is_lifetime_member ?? false,
    }
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
    if (user) {
        setValue('name', user.name || '');
        setValue('nickname', user.nickname || '');
        setValue('phone', user.phone || '');
        setValue('tel', user.tel || '');
        setValue('zipcode', user.zipcode || '');
        setValue('address1', user.address1 || '');
        setValue('address2', user.address2 || '');
        setValue('receive_sms', user.receive_sms ?? true);
        setValue('receive_email', user.receive_email ?? true);
        setValue('is_lifetime_member', user.is_lifetime_member ?? false);
    }
  }, [isLoading, isAuthenticated, user, router, setValue]);

  const onSubmit = async (data: UserUpdateFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        setUser(result.user);
        toast({
          title: '회원 정보 수정 완료',
          description: result.message,
        });
        router.push('/mypage');
      } else {
        toast({
          variant: 'destructive',
          title: '오류',
          description: result.error || '프로필 업데이트 중 오류가 발생했습니다.',
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        variant: 'destructive',
        title: '오류',
        description: '네트워크 오류가 발생했습니다.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading || !isAuthenticated) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">회원 정보 수정</h1>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="border-t border-gray-700">
        <table className="w-full border-collapse text-sm">
            <tbody>
                 <TableRow label="아이디">
                    <div className="flex flex-col">
                        <Input id="username" value={user?.username || ''} disabled className="w-64 bg-gray-100" />
                        <span className="text-xs text-muted-foreground mt-1">(영문소문자/숫자, 4~16자)</span>
                    </div>
                 </TableRow>
                 <TableRow label="비밀번호">
                    <div className="flex flex-col items-start gap-2">
                        <Button type="button" variant="outline" onClick={() => router.push('/mypage/change-password')}>
                            비밀번호 변경
                        </Button>
                        <span className="text-xs text-muted-foreground mt-1">(영문 대소문자/숫자/특수문자 중 3가지 이상 조합, 8자~16자)</span>
                    </div>
                 </TableRow>
                 <TableRow label="이름">
                    <Input id="name" {...register('name')} className="w-64" />
                 </TableRow>
                  <TableRow label="닉네임">
                    <Input id="nickname" {...register('nickname')} className="w-64" />
                 </TableRow>
                 <TableRow label="주소">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Input id="zipcode" {...register('zipcode')} placeholder="우편번호" className="w-24" readOnly/>
                            <Button type="button" variant="outline" onClick={() => openKakaoAddressSearch(setValue)}>주소검색</Button>
                        </div>
                        <Input id="address1" {...register('address1')} placeholder="기본주소" readOnly />
                        <Input id="address2" {...register('address2')} placeholder="나머지 주소 (선택 입력 가능)" />
                    </div>
                 </TableRow>
                 <TableRow label="일반전화">
                    <div className="flex items-center gap-2">
                         <Select>
                            <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder="02" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="02">02</SelectItem>
                                <SelectItem value="031">031</SelectItem>
                                <SelectItem value="032">032</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input className="w-24"/>
                        <Input className="w-24"/>
                    </div>
                 </TableRow>
                 <TableRow label="휴대전화">
                    <div className="flex items-center gap-2">
                         <Select>
                            <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder="010" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="010">010</SelectItem>
                                <SelectItem value="011">011</SelectItem>
                                <SelectItem value="017">017</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input className="w-24"/>
                        <Input className="w-24"/>
                    </div>
                 </TableRow>
                <TableRow label="SMS 수신여부">
                    <div className="flex flex-col">
                        <RadioGroup value={watch('receive_sms') ? 'yes' : 'no'} onValueChange={(value) => setValue('receive_sms', value === 'yes')} className="flex gap-4">
                            <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="sms_yes"/><Label htmlFor="sms_yes">수신함</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="sms_no"/><Label htmlFor="sms_no">수신안함</Label></div>
                        </RadioGroup>
                         <span className="text-xs text-muted-foreground mt-1">쇼핑몰에서 제공하는 유익한 이벤트 소식을 SMS로 받으실 수 있습니다.</span>
                    </div>
                </TableRow>
                 <TableRow label="이메일">
                    <Input id="email" type="email" value={user?.email || ''} disabled className="w-64 bg-gray-100"/>
                 </TableRow>
                 <TableRow label="이메일 수신여부">
                     <div className="flex flex-col">
                        <RadioGroup value={watch('receive_email') ? 'yes' : 'no'} onValueChange={(value) => setValue('receive_email', value === 'yes')} className="flex gap-4">
                            <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="email_yes"/><Label htmlFor="email_yes">수신함</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="email_no"/><Label htmlFor="email_no">수신안함</Label></div>
                        </RadioGroup>
                        <span className="text-xs text-muted-foreground mt-1">쇼핑몰에서 제공하는 유익한 이벤트 소식을 이메일로 받으실 수 있습니다.</span>
                     </div>
                 </TableRow>
                 <TableRow label="평생회원">
                    <div className="flex flex-col">
                        <RadioGroup value={watch('is_lifetime_member') ? 'yes' : 'no'} onValueChange={(value) => setValue('is_lifetime_member', value === 'yes')} className="flex gap-4">
                           <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="lifetime_yes" /><Label htmlFor="lifetime_yes">동의함</Label></div>
                           <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="lifetime_no" /><Label htmlFor="lifetime_no">동의안함</Label></div>
                        </RadioGroup>
                        <span className="text-xs text-muted-foreground mt-1">평생회원은 올댓프린팅 회원 탈퇴시까지 휴면회원으로 전환되지 않습니다.</span>
                    </div>
                 </TableRow>
            </tbody>
        </table>
        
        <div className="mt-12 flex justify-center gap-4">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? '수정 중...' : '회원정보수정'}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => router.back()} disabled={isSubmitting}>취소</Button>
        </div>
      </form>
    </div>
  );
}

const TableRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <tr className="border-b">
        <th className="w-48 bg-secondary/50 p-4 text-left font-semibold align-top">
            <span className="text-red-500 mr-1">*</span>{label}
        </th>
        <td className="p-4">
            {children}
        </td>
    </tr>
);
