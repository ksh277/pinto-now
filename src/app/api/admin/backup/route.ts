import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyRequestAuth } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const authUser = await verifyRequestAuth(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    console.log('🔄 데이터베이스 백업 시작...');

    // 전체 테이블 목록 조회
    const tables = await query('SHOW TABLES') as any[];
    const tableNames = tables.map((table: any) => Object.values(table)[0] as string);

    console.log(`📋 발견된 테이블: ${tableNames.length}개`);

    const backupData: any = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      tables: {}
    };

    // 각 테이블 데이터 백업
    for (const tableName of tableNames) {
      console.log(`📦 ${tableName} 테이블 백업 중...`);

      // 테이블 구조 조회
      const tableStructure = await query(`SHOW CREATE TABLE \`${tableName}\``) as any[];
      const createStatement = tableStructure[0]['Create Table'];

      // 테이블 데이터 조회
      const tableData = await query(`SELECT * FROM \`${tableName}\``) as any[];

      backupData.tables[tableName] = {
        structure: createStatement,
        data: tableData,
        count: tableData.length
      };

      console.log(`   ✅ ${tableName}: ${tableData.length}개 레코드 백업 완료`);
    }

    // 백업 통계
    const totalRecords = Object.values(backupData.tables).reduce(
      (sum: number, table: any) => sum + table.count, 0
    );

    console.log('🎉 데이터베이스 백업 완료!');
    console.log(`📊 총 ${tableNames.length}개 테이블, ${totalRecords}개 레코드`);

    return NextResponse.json({
      success: true,
      message: '데이터베이스 백업이 완료되었습니다.',
      backup: backupData,
      stats: {
        tables: tableNames.length,
        totalRecords,
        size: JSON.stringify(backupData).length,
        timestamp: backupData.timestamp
      }
    });

  } catch (error) {
    console.error('❌ 백업 실패:', error);
    return NextResponse.json(
      { error: 'Backup failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const authUser = await verifyRequestAuth(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { backupData, mode = 'safe' } = body;

    if (!backupData || !backupData.tables) {
      return NextResponse.json(
        { error: 'Invalid backup data' },
        { status: 400 }
      );
    }

    console.log('🔄 데이터베이스 복원 시작...');
    console.log(`📊 복원 모드: ${mode}`);

    const results: any[] = [];

    if (mode === 'full') {
      // 전체 복원: 기존 테이블 삭제 후 재생성
      console.log('⚠️ 전체 복원 모드: 기존 데이터가 삭제됩니다.');

      for (const [tableName, tableInfo] of Object.entries(backupData.tables) as any[]) {
        try {
          // 기존 테이블 삭제
          await query(`DROP TABLE IF EXISTS \`${tableName}\``);
          console.log(`🗑️ ${tableName} 테이블 삭제 완료`);

          // 테이블 재생성
          await query(tableInfo.structure);
          console.log(`🏗️ ${tableName} 테이블 생성 완료`);

          // 데이터 복원
          if (tableInfo.data && tableInfo.data.length > 0) {
            const columns = Object.keys(tableInfo.data[0]);
            const placeholders = columns.map(() => '?').join(',');
            const insertQuery = `INSERT INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(',')}) VALUES (${placeholders})`;

            for (const row of tableInfo.data) {
              const values = columns.map(col => row[col]);
              await query(insertQuery, values);
            }

            console.log(`📦 ${tableName}: ${tableInfo.data.length}개 레코드 복원 완료`);
          }

          results.push({
            table: tableName,
            status: 'success',
            records: tableInfo.data?.length || 0
          });

        } catch (error) {
          console.error(`❌ ${tableName} 복원 실패:`, error);
          results.push({
            table: tableName,
            status: 'failed',
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }
    } else {
      // 안전 복원: 데이터만 복원 (테이블 구조 유지)
      console.log('🛡️ 안전 복원 모드: 기존 테이블 구조 유지');

      for (const [tableName, tableInfo] of Object.entries(backupData.tables) as any[]) {
        try {
          // 기존 데이터 삭제
          await query(`DELETE FROM \`${tableName}\``);
          console.log(`🗑️ ${tableName} 기존 데이터 삭제 완료`);

          // 데이터 복원
          if (tableInfo.data && tableInfo.data.length > 0) {
            const columns = Object.keys(tableInfo.data[0]);
            const placeholders = columns.map(() => '?').join(',');
            const insertQuery = `INSERT INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(',')}) VALUES (${placeholders})`;

            for (const row of tableInfo.data) {
              const values = columns.map(col => row[col]);
              await query(insertQuery, values);
            }

            console.log(`📦 ${tableName}: ${tableInfo.data.length}개 레코드 복원 완료`);
          }

          results.push({
            table: tableName,
            status: 'success',
            records: tableInfo.data?.length || 0
          });

        } catch (error) {
          console.error(`❌ ${tableName} 복원 실패:`, error);
          results.push({
            table: tableName,
            status: 'failed',
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }
    }

    const successful = results.filter(r => r.status === 'success');
    const failed = results.filter(r => r.status === 'failed');

    console.log('🎉 데이터베이스 복원 완료!');
    console.log(`✅ 성공: ${successful.length}개 테이블`);
    console.log(`❌ 실패: ${failed.length}개 테이블`);

    return NextResponse.json({
      success: true,
      message: '데이터베이스 복원이 완료되었습니다.',
      results: {
        mode,
        successful: successful.length,
        failed: failed.length,
        details: results
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 복원 실패:', error);
    return NextResponse.json(
      { error: 'Restore failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';