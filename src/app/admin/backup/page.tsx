'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface BackupStats {
  tables: number;
  totalRecords: number;
  size: number;
  timestamp: string;
}

interface BackupResult {
  success: boolean;
  message: string;
  backup?: any;
  stats?: BackupStats;
  results?: any;
}

const AdminBackupPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [backupData, setBackupData] = useState<any>(null);
  const [backupStats, setBackupStats] = useState<BackupStats | null>(null);
  const [restoreMode, setRestoreMode] = useState<'safe' | 'full'>('safe');
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const createBackup = async () => {
    setIsLoading(true);
    addLog('데이터베이스 백업을 시작합니다...');

    try {
      const response = await fetch('/api/admin/backup', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result: BackupResult = await response.json();

      if (result.success && result.backup) {
        setBackupData(result.backup);
        setBackupStats(result.stats || null);
        addLog(`✅ 백업 완료: ${result.stats?.tables}개 테이블, ${result.stats?.totalRecords}개 레코드`);

        // 백업 파일 다운로드
        const blob = new Blob([JSON.stringify(result.backup, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pinto_backup_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        addLog('📁 백업 파일이 다운로드되었습니다.');
      } else {
        addLog(`❌ 백업 실패: ${result.message || '알 수 없는 오류'}`);
        alert('백업에 실패했습니다: ' + (result.message || '알 수 없는 오류'));
      }
    } catch (error) {
      addLog(`❌ 백업 오류: ${error}`);
      alert('백업 중 오류가 발생했습니다: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      setRestoreFile(file);
      addLog(`📁 복원 파일 선택됨: ${file.name}`);
    } else {
      alert('JSON 파일만 업로드 가능합니다.');
    }
  };

  const restoreBackup = async () => {
    if (!restoreFile) {
      alert('복원할 파일을 선택해주세요.');
      return;
    }

    const confirmMessage = restoreMode === 'full'
      ? '⚠️ 전체 복원은 모든 기존 데이터를 삭제합니다. 정말 진행하시겠습니까?'
      : '안전 복원을 진행하시겠습니까? (테이블 구조는 유지됩니다)';

    if (!confirm(confirmMessage)) {
      return;
    }

    setIsLoading(true);
    addLog(`🔄 ${restoreMode === 'full' ? '전체' : '안전'} 복원을 시작합니다...`);

    try {
      const fileContent = await restoreFile.text();
      const backupData = JSON.parse(fileContent);

      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          backupData,
          mode: restoreMode
        }),
      });

      const result: BackupResult = await response.json();

      if (result.success) {
        addLog(`✅ 복원 완료: ${result.message}`);
        if (result.results) {
          addLog(`📊 성공: ${result.results.successful}개 테이블, 실패: ${result.results.failed}개 테이블`);
        }
        alert('데이터베이스 복원이 완료되었습니다.');
      } else {
        addLog(`❌ 복원 실패: ${result.message}`);
        alert('복원에 실패했습니다: ' + result.message);
      }
    } catch (error) {
      addLog(`❌ 복원 오류: ${error}`);
      alert('복원 중 오류가 발생했습니다: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const downloadCurrentBackup = () => {
    if (!backupData) {
      alert('백업 데이터가 없습니다. 먼저 백업을 생성해주세요.');
      return;
    }

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pinto_backup_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addLog('📁 현재 백업이 다시 다운로드되었습니다.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin')}
            className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← 관리자 홈으로
          </button>
          <h1 className="text-3xl font-bold text-gray-900">데이터베이스 백업 관리</h1>
          <p className="text-gray-600 mt-2">데이터베이스 백업 생성 및 복원을 관리합니다.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 백업 생성 섹션 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📦 백업 생성</h2>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">백업 기능</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 모든 테이블 구조 및 데이터 백업</li>
                  <li>• JSON 형식으로 다운로드</li>
                  <li>• 타임스탬프 포함</li>
                  <li>• 테이블별 레코드 수 통계</li>
                </ul>
              </div>

              {backupStats && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">최근 백업 정보</h3>
                  <div className="text-sm text-green-800 space-y-1">
                    <div>테이블 수: {backupStats.tables}개</div>
                    <div>총 레코드: {backupStats.totalRecords.toLocaleString()}개</div>
                    <div>파일 크기: {(backupStats.size / 1024 / 1024).toFixed(2)} MB</div>
                    <div>생성 시간: {new Date(backupStats.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={createBackup}
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? '백업 중...' : '새 백업 생성'}
                </button>

                {backupData && (
                  <button
                    onClick={downloadCurrentBackup}
                    className="px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
                  >
                    다시 다운로드
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 백업 복원 섹션 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🔄 백업 복원</h2>

            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-medium text-yellow-900 mb-2">⚠️ 주의사항</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• 복원은 기존 데이터를 변경합니다</li>
                  <li>• 안전 모드: 테이블 구조 유지, 데이터만 교체</li>
                  <li>• 전체 모드: 테이블 삭제 후 완전 재생성</li>
                  <li>• 복원 전 반드시 현재 데이터를 백업하세요</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  복원 모드 선택
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="restoreMode"
                      value="safe"
                      checked={restoreMode === 'safe'}
                      onChange={(e) => setRestoreMode(e.target.value as 'safe' | 'full')}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      <strong>안전 복원</strong> - 테이블 구조 유지 (권장)
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="restoreMode"
                      value="full"
                      checked={restoreMode === 'full'}
                      onChange={(e) => setRestoreMode(e.target.value as 'safe' | 'full')}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      <strong>전체 복원</strong> - 완전 재생성 (위험)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  백업 파일 선택
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {restoreFile && (
                  <p className="mt-1 text-sm text-green-600">
                    선택된 파일: {restoreFile.name}
                  </p>
                )}
              </div>

              <button
                onClick={restoreBackup}
                disabled={isLoading || !restoreFile}
                className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? '복원 중...' : '백업 복원 실행'}
              </button>
            </div>
          </div>
        </div>

        {/* 로그 섹션 */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">📝 작업 로그</h2>
            <button
              onClick={clearLogs}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
            >
              로그 지우기
            </button>
          </div>

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <div className="text-gray-500">로그가 없습니다. 백업 또는 복원 작업을 시작하세요.</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">ℹ️ 백업 가이드</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">정기 백업</h3>
              <p className="text-sm text-blue-800">
                중요한 데이터 손실을 방지하기 위해 정기적으로 백업을 생성하는 것을 권장합니다.
              </p>
            </div>

            <div className="p-4 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">안전한 보관</h3>
              <p className="text-sm text-green-800">
                백업 파일은 안전한 외부 저장소에 보관하고, 여러 복사본을 유지하세요.
              </p>
            </div>

            <div className="p-4 border border-orange-200 rounded-lg">
              <h3 className="font-medium text-orange-900 mb-2">테스트 복원</h3>
              <p className="text-sm text-orange-800">
                중요한 복원 작업 전에는 개발 환경에서 먼저 테스트해보세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBackupPage;