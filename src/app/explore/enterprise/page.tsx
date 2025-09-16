import Link from 'next/link';

export const metadata = {
  title: '단체판촉상품 탐색',
};

export default function EnterpriseExplore() {
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-8 text-center">
        <h1 className="text-3xl font-bold">단체 판촉도 핀토에서</h1>
        <p className="text-muted-foreground mt-2">기업과 단체를 위한 맞춤 굿즈</p>
      </section>
      <section className="text-center py-16">
        <p className="text-gray-600">관리자가 추가한 기업/단체 상품들이 여기에 표시됩니다.</p>
      </section>
    </main>
  );
}
