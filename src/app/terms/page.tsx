'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로가기
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">핀토(PINTO) 이용약관</CardTitle>
          <p className="text-muted-foreground">최종 수정일: 2024년 1월 1일</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">제1조 (목적)</h3>
            <p className="text-sm leading-relaxed">
              이 약관은 핀토(PINTO)(이하 "회사"라 합니다)가 제공하는 온라인 맞춤형 굿즈 제작 및 판매 서비스(이하 "서비스"라 합니다)의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제2조 (정의)</h3>
            <div className="space-y-2 text-sm">
              <p><strong>1. "서비스"</strong>란 회사가 제공하는 맞춤형 굿즈 제작, 판매, 배송 등 모든 서비스를 의미합니다.</p>
              <p><strong>2. "이용자"</strong>란 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</p>
              <p><strong>3. "회원"</strong>이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</p>
              <p><strong>4. "굿즈"</strong>란 회사가 제작하여 판매하는 맞춤형 상품을 의미합니다.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제3조 (약관의 효력 및 변경)</h3>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>1. 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.</p>
              <p>2. 회사는 필요하다고 인정되는 경우 이 약관을 변경할 수 있으며, 변경된 약관은 제1항과 같은 방법으로 공지 또는 통지함으로써 효력을 발생합니다.</p>
              <p>3. 이용자는 변경된 약관에 동의하지 않을 경우 회원탈퇴(해지)를 요청할 수 있으며, 변경된 약관의 효력 발생일로부터 7일 이후에도 거부의사를 표시하지 아니하고 서비스를 계속 이용할 경우 약관의 변경에 동의한 것으로 간주됩니다.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제4조 (서비스의 제공 및 변경)</h3>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>1. 회사는 다음과 같은 업무를 수행합니다:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>맞춤형 굿즈 제작 및 판매</li>
                <li>디자인 도구 및 플랫폼 제공</li>
                <li>주문 처리 및 배송</li>
                <li>고객 지원 서비스</li>
                <li>기타 회사가 정하는 업무</li>
              </ul>
              <p>2. 회사는 서비스의 내용을 변경할 수 있으며, 변경 시 그 내용을 사전에 공지합니다.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제5조 (서비스의 중단)</h3>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>1. 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.</p>
              <p>2. 회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상하지 않습니다. 단, 회사의 고의 또는 중대한 과실에 의한 경우는 그러하지 아니합니다.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제6조 (회원가입)</h3>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>1. 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.</p>
              <p>2. 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                <li>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
                <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제7조 (회원탈퇴 및 자격 상실 등)</h3>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>1. 회원은 회사에 언제든지 탈퇴를 요청할 수 있으며 회사는 즉시 회원탈퇴를 처리합니다.</p>
              <p>2. 회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을 제한 및 정지시킬 수 있습니다:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>가입 신청 시에 허위 내용을 등록한 경우</li>
                <li>다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우</li>
                <li>서비스를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제8조 (개인정보보호)</h3>
            <p className="text-sm leading-relaxed">
              회사는 이용자의 개인정보 수집시 서비스제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다. 자세한 사항은 개인정보처리방침을 참고하시기 바랍니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제9조 (회사의 의무)</h3>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>1. 회사는 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 이 약관이 정하는 바에 따라 지속적이고, 안정적으로 서비스를 제공하는데 최선을 다하여야 합니다.</p>
              <p>2. 회사는 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 이용자의 개인정보(신용정보 포함)보호를 위한 보안 시스템을 구축하여야 합니다.</p>
              <p>3. 회사는 이용자로부터 제기되는 의견이나 불만이 정당하다고 객관적으로 인정될 경우에는 적절한 절차를 거쳐 즉시 처리하여야 합니다.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제10조 (이용자의 의무)</h3>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>이용자는 다음 행위를 하여서는 안 됩니다:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>신청 또는 변경시 허위 내용의 등록</li>
                <li>타인의 정보 도용</li>
                <li>회사가 게시한 정보의 변경</li>
                <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                <li>회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제11조 (저작권의 귀속 및 이용제한)</h3>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>1. 회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.</p>
              <p>2. 이용자는 서비스를 이용함으로써 얻은 정보 중 회사에게 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제12조 (분쟁해결)</h3>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>1. 회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치 운영합니다.</p>
              <p>2. 회사는 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다. 다만, 신속한 처리가 곤란한 경우에는 이용자에게 그 사유와 처리일정을 즉시 통보해 드립니다.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제13조 (재판권 및 준거법)</h3>
            <p className="text-sm leading-relaxed">
              이 약관에 관한 소송은 대한민국 법을 준거법으로 하며, 서울중앙지방법원을 관할 법원으로 합니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">부칙</h3>
            <p className="text-sm leading-relaxed">
              이 약관은 2024년 1월 1일부터 적용됩니다.
            </p>
          </section>

          <div className="pt-6 border-t">
            <div className="flex justify-center">
              <Link href="/register">
                <Button>
                  회원가입으로 돌아가기
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}