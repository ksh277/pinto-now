"use client";

import React from 'react';

export default function DbTestPage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetch('/api/db-test')
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">DB 상태 확인 중...</div>;
  if (!data) return <div className="p-6 text-red-600">결과 없음</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-3 h-3 rounded-full ${data.ok ? 'bg-green-500' : 'bg-red-500'}`}></span>
        <span className="font-bold">DB 연결 {data.ok ? '정상' : '오류'}</span>
      </div>
      {data.error && <div className="text-red-600 mb-2">{data.error}</div>}
      <div className="text-sm mb-1">버전: <b>{data.version}</b></div>
      <div className="text-sm mb-1">DB명: <b>{data.db}</b></div>
      <div className="text-sm mb-1">Ping: <b>{data.pingMs}ms</b></div>
      <div className="text-sm mb-1">테이블 수: <b>{data.tables?.length}</b></div>
      {data.missing?.length > 0 && (
        <div className="mt-2">
          <div className="text-red-600 font-bold">누락 테이블:</div>
          <ul className="list-disc ml-6">
            {data.missing.map((t: string) => <li key={t}>{t}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
