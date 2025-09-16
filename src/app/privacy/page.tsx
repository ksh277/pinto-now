'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PrivacyPage() {
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
          <CardTitle className="text-2xl font-bold">핀토(PINTO) 개인정보처리방침</CardTitle>
          <p className="text-muted-foreground">최종 수정일: 2024년 1월 1일</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">1. 개인정보의 처리목적</h3>
            <p className="text-sm leading-relaxed mb-3">
              핀토(PINTO)(이하 "회사"라 합니다)는 다음의 목적을 위하여 개인정보를 처리하고 있으며, 다음의 목적 이외의 용도로는 이용하지 않습니다.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm ml-4">
              <li>고객 가입의사 확인, 고객에 대한 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 물품 또는 서비스 공급에 따른 금액 결제, 물품 또는 서비스의 공급·배송 등</li>
              <li>맞춤형 굿즈 제작 및 주문 처리</li>
              <li>고객 문의 및 불만 처리</li>
              <li>마케팅 및 광고에의 활용</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">2. 개인정보의 처리 및 보유기간</h3>
            <div className="space-y-3 text-sm">
              <p><strong>① 회사는 정보주체로부터 개인정보를 수집할 때 동의 받은 개인정보 보유·이용기간 또는 법령에 따른 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</strong></p>
              <p><strong>② 구체적인 개인정보 처리 및 보유 기간은 다음과 같습니다:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>회원가입 및 관리:</strong> 회원 탈퇴시까지</li>
                <li><strong>재화 또는 서비스 제공:</strong> 재화·서비스 공급완료 및 요금결제·정산 완료시까지</li>
                <li><strong>전자상거래에서의 계약·청약철회 등에 관한 기록:</strong> 5년</li>
                <li><strong>대금결제 및 재화 등의 공급에 관한 기록:</strong> 5년</li>
                <li><strong>소비자의 불만 또는 분쟁처리에 관한 기록:</strong> 3년</li>
                <li><strong>웹사이트 방문기록:</strong> 3개월</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">3. 개인정보의 제3자 제공</h3>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>① 회사는 정보주체의 개인정보를 1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
              <p>② 회사는 다음과 같이 개인정보를 제3자에게 제공하고 있습니다:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>제공받는 자:</strong> 배송업체 (CJ대한통운, 롯데택배 등)</li>
                <li><strong>제공받는 자의 개인정보 이용목적:</strong> 상품 배송</li>
                <li><strong>제공하는 개인정보 항목:</strong> 성명, 연락처, 주소</li>
                <li><strong>제공받는 자의 보유·이용기간:</strong> 배송 완료 후 즉시 파기</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">4. 개인정보처리 위탁</h3>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>① 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>위탁받는 자 (수탁자):</strong> PG사 (이니시스, KG이니시스 등)</p>
                <p><strong>위탁하는 업무의 내용:</strong> 결제처리 및 결제 정보 관리</p>
              </div>
              <p>② 회사는 위탁계약 체결시 개인정보 보호법 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">5. 정보주체의 권리·의무 및 그 행사방법</h3>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>① 정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>개인정보 처리현황 통지요구</li>
                <li>개인정보 처리정지 요구</li>
                <li>개인정보의 정정·삭제 요구</li>
                <li>개인정보 처리정지 요구</li>
              </ul>
              <p>② 제1항에 따른 권리 행사는 회사에 대해 서면, 전화, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.</p>
              <p>③ 정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 회사는 정정 또는 삭제를 완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">6. 처리하는 개인정보의 항목</h3>
            <div className="space-y-2 text-sm">
              <p><strong>① 회사는 다음의 개인정보 항목을 처리하고 있습니다:</strong></p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>1) 회원가입·관리</strong></p>
                <ul className="list-disc list-inside ml-4">
                  <li>필수항목: 이름, 아이디, 비밀번호, 휴대전화번호, 이메일, 주소</li>
                  <li>선택항목: 생년월일, 성별</li>
                </ul>
                <p><strong>2) 재화 또는 서비스 제공</strong></p>
                <ul className="list-disc list-inside ml-4">
                  <li>필수항목: 이름, 주소, 전화번호, 이메일, 결제정보</li>
                </ul>
                <p><strong>3) 인터넷 서비스 이용과정에서 아래 개인정보 항목이 자동으로 생성되어 수집될 수 있습니다</strong></p>
                <ul className="list-disc list-inside ml-4">
                  <li>IP주소, 쿠키, MAC주소, 서비스 이용기록, 방문기록, 불량 이용기록 등</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">7. 개인정보의 파기</h3>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
              <p>② 정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.</p>
              <p>③ 개인정보 파기의 절차 및 방법은 다음과 같습니다:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>파기절차:</strong> 회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.</li>
                <li><strong>파기방법:</strong> 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">8. 개인정보의 안전성 확보조치</h3>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적·관리적 및 물리적 조치를 하고 있습니다:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>개인정보 취급 직원의 최소화 및 교육</li>
                <li>개인정보에 대한 접근 제한</li>
                <li>개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여·변경·말소를 통하여 개인정보에 대한 접근통제를 위해 필요한 조치</li>
                <li>해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고 주기적인 갱신·점검</li>
                <li>개인정보의 암호화</li>
                <li>보안시스템 구축 및 접속기록의 보관</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">9. 개인정보 보호책임자</h3>
            <div className="space-y-2 text-sm">
              <p>① 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>▶ 개인정보 보호책임자</strong></p>
                <p>성명: 핀토 관리자</p>
                <p>직책: 대표이사</p>
                <p>연락처: 1588-0000, privacy@pinto.co.kr</p>
                <p className="text-xs mt-2">※ 개인정보 보호 담당부서로 연결됩니다.</p>
              </div>
              <p>② 정보주체께서는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 회사는 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">10. 개인정보 처리방침 변경</h3>
            <p className="text-sm leading-relaxed">
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">11. 개인정보의 열람청구</h3>
            <p className="text-sm leading-relaxed">
              정보주체는 개인정보 보호법 제35조에 따른 개인정보의 열람 청구를 아래의 부서에 할 수 있습니다. 회사는 정보주체의 개인정보 열람청구가 신속하게 처리되도록 노력하겠습니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">부칙</h3>
            <p className="text-sm leading-relaxed">
              이 개인정보처리방침은 2024년 1월 1일부터 적용됩니다.
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