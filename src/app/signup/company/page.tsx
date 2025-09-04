
"use client";

import { useState } from 'react';


function classNames(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(' ');
}

function validateBizNo(v: string) {
  // 형식만 체크 (예: 123-45-67890)
  return /^(\d{3})-(\d{2})-(\d{5})$/.test(v.trim());
}

function formatBizNo(v: string) {
  const only = v.replace(/[^0-9]/g, '').slice(0, 10);
  const a = only.slice(0, 3);
  const b = only.slice(3, 5);
  const c = only.slice(5, 10);
  return [a, b, c].filter(Boolean).join('-');
}

export default function CompanySignUpPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    const form = e.currentTarget;
    const fd = new FormData(form);

    // 필수 동의 체크
    const agreeTerms = fd.get('agreeTerms') === 'on';
    const agreePrivacy = fd.get('agreePrivacy') === 'on';
    if (!agreeTerms || !agreePrivacy) {
      setMessage('필수 약관에 동의해 주세요.');
      return;
    }

    // 비밀번호 일치 검증
    const pw = String(fd.get('password') || '');
    const pw2 = String(fd.get('passwordConfirm') || '');
    if (pw !== pw2) {
      setMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 사업자등록번호 검증
    const bizNo = String(fd.get('bizNo') || '');
    if (!validateBizNo(bizNo)) {
      setMessage('사업자등록번호 형식을 확인해 주세요. 예) 123-45-67890');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/signup/company', {
        method: 'POST',
        body: fd, // 파일 업로드를 고려하여 multipart/form-data 유지
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || '가입 처리 중 오류');
      setMessage('가입 요청이 접수되었습니다. 검수 후 안내드릴게요.');
      form.reset();
    } catch (err: any) {
      setMessage(err.message || '처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">기업 회원가입</h1>
      <p className="mt-2 text-sm text-gray-600">사업자 정보와 담당자 정보를 정확히 입력해 주세요.</p>

      {message && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm">{message}</div>
      )}

      <form onSubmit={onSubmit} className="mt-8 grid gap-6">
        {/* 사업자 정보 */}
        <section className="rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">사업자 정보</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <label htmlFor="companyName" className="text-sm font-medium">상호(법인명) *</label>
              <input id="companyName" name="companyName" required placeholder="주식회사 핀토"
                     className="h-10 rounded-md border px-3 outline-none ring-0 focus:border-gray-900" />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="bizNo" className="text-sm font-medium">사업자등록번호 *</label>
              <input id="bizNo" name="bizNo" inputMode="numeric" placeholder="123-45-67890" required
                     onChange={(e) => (e.currentTarget.value = formatBizNo(e.currentTarget.value))}
                     className="h-10 rounded-md border px-3 outline-none focus:border-gray-900" />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="ceo" className="text-sm font-medium">대표자명 *</label>
              <input id="ceo" name="ceo" required placeholder="홍길동"
                     className="h-10 rounded-md border px-3 outline-none focus:border-gray-900" />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="bizType" className="text-sm font-medium">업태</label>
              <input id="bizType" name="bizType" placeholder="도/소매, 서비스 등"
                     className="h-10 rounded-md border px-3 outline-none focus:border-gray-900" />
            </div>

            <div className="grid gap-1.5 sm:col-span-2">
              <label htmlFor="address1" className="text-sm font-medium">사업장 주소 *</label>
              <input id="address1" name="address1" required placeholder="도로명 주소"
                     className="h-10 rounded-md border px-3 outline-none focus:border-gray-900" />
              <input id="address2" name="address2" placeholder="상세 주소"
                     className="mt-2 h-10 rounded-md border px-3 outline-none focus:border-gray-900" />
            </div>

            <div className="grid gap-1.5 sm:col-span-2">
              <label htmlFor="license" className="text-sm font-medium">사업자등록증 (이미지 또는 PDF)</label>
              <input id="license" name="license" type="file" accept="image/*,application/pdf"
                     className="h-10 rounded-md border file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-gray-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white" />
            </div>
          </div>
        </section>

        {/* 담당자 정보 */}
        <section className="rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">담당자 정보</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <label htmlFor="manager" className="text-sm font-medium">담당자명 *</label>
              <input id="manager" name="manager" required placeholder="김핀토"
                     className="h-10 rounded-md border px-3 outline-none focus:border-gray-900" />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="email" className="text-sm font-medium">이메일 *</label>
              <input id="email" name="email" type="email" required placeholder="name@company.com"
                     className="h-10 rounded-md border px-3 outline-none focus:border-gray-900" />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="phone" className="text-sm font-medium">연락처 *</label>
              <input id="phone" name="phone" inputMode="tel" required placeholder="010-0000-0000"
                     className="h-10 rounded-md border px-3 outline-none focus:border-gray-900" />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="homepage" className="text-sm font-medium">홈페이지</label>
              <input id="homepage" name="homepage" type="url" placeholder="https://company.com"
                     className="h-10 rounded-md border px-3 outline-none focus:border-gray-900" />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="password" className="text-sm font-medium">비밀번호 *</label>
              <input id="password" name="password" type="password" required minLength={8}
                     placeholder="영문/숫자 포함 8자 이상"
                     className="h-10 rounded-md border px-3 outline-none focus:border-gray-900" />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="passwordConfirm" className="text-sm font-medium">비밀번호 확인 *</label>
              <input id="passwordConfirm" name="passwordConfirm" type="password" required minLength={8}
                     className="h-10 rounded-md border px-3 outline-none focus:border-gray-900" />
            </div>
          </div>
        </section>

        {/* 약관 동의 */}
        <section className="rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">약관 동의</h2>
          <div className="space-y-3 text-sm">
            <label className="flex items-start gap-3">
              <input type="checkbox" name="agreeTerms" className="mt-1 h-4 w-4" required />
              <span>
                (필수) 이용약관에 동의합니다.
                <a href="/terms" className="ml-2 underline">전문보기</a>
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" name="agreePrivacy" className="mt-1 h-4 w-4" required />
              <span>
                (필수) 개인정보 처리방침에 동의합니다.
                <a href="/privacy" className="ml-2 underline">전문보기</a>
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" name="agreeMarketing" className="mt-1 h-4 w-4" />
              <span>(선택) 마케팅 정보 수신에 동의합니다.</span>
            </label>
          </div>
        </section>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">이미 계정이 있으신가요? <a className="underline" href="/login">로그인</a></p>
          <button
            type="submit"
            disabled={loading}
            className={classNames(
              'h-11 rounded-lg px-6 text-sm font-semibold text-white transition',
              loading ? 'bg-gray-400' : 'bg-gray-900 hover:bg-black'
            )}
          >
            {loading ? '처리 중…' : '회원가입'}
          </button>
        </div>
      </form>
    </main>
  );
}
