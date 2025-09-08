const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function migrateBannersTable() {
  let connection;
  
  try {
    // 데이터베이스 연결
    connection = await mysql.createConnection(process.env.DATABASE_URL);
    console.log('✅ Google Cloud SQL MySQL 연결 성공');
    
    // 현재 banners 테이블 구조 확인
    console.log('\n📋 현재 banners 테이블 구조:');
    const [columns] = await connection.execute('DESCRIBE banners');
    console.table(columns);
    
    // 필요한 컬럼들이 이미 존재하는지 확인
    const existingColumns = columns.map(col => col.Field);
    const columnsToAdd = [
      { name: 'banner_type', exists: existingColumns.includes('banner_type') },
      { name: 'main_title', exists: existingColumns.includes('main_title') },
      { name: 'sub_title', exists: existingColumns.includes('sub_title') },
      { name: 'more_button_link', exists: existingColumns.includes('more_button_link') },
      { name: 'device_type', exists: existingColumns.includes('device_type') }
    ];
    
    console.log('\n🔍 컬럼 존재 여부 확인:');
    columnsToAdd.forEach(col => {
      console.log(`  ${col.name}: ${col.exists ? '✅ 존재' : '❌ 없음'}`);
    });
    
    // 필요한 컬럼들 추가
    const alterStatements = [];
    
    if (!columnsToAdd.find(c => c.name === 'banner_type').exists) {
      alterStatements.push("ADD COLUMN banner_type VARCHAR(50) DEFAULT 'IMAGE_BANNER' AFTER href");
    }
    
    if (!columnsToAdd.find(c => c.name === 'main_title').exists) {
      alterStatements.push("ADD COLUMN main_title VARCHAR(255) NULL AFTER banner_type");
    }
    
    if (!columnsToAdd.find(c => c.name === 'sub_title').exists) {
      alterStatements.push("ADD COLUMN sub_title VARCHAR(255) NULL AFTER main_title");
    }
    
    if (!columnsToAdd.find(c => c.name === 'more_button_link').exists) {
      alterStatements.push("ADD COLUMN more_button_link VARCHAR(255) NULL AFTER sub_title");
    }
    
    if (!columnsToAdd.find(c => c.name === 'device_type').exists) {
      alterStatements.push("ADD COLUMN device_type VARCHAR(20) DEFAULT 'all' AFTER more_button_link");
    }
    
    if (alterStatements.length === 0) {
      console.log('\n✅ 모든 필요한 컬럼이 이미 존재합니다!');
      return;
    }
    
    // ALTER TABLE 실행
    console.log('\n🔄 데이터베이스 마이그레이션 시작...');
    const alterQuery = `ALTER TABLE banners ${alterStatements.join(', ')}`;
    console.log('실행할 쿼리:', alterQuery);
    
    await connection.execute(alterQuery);
    console.log('✅ 마이그레이션 완료!');
    
    // 업데이트된 테이블 구조 확인
    console.log('\n📋 업데이트된 banners 테이블 구조:');
    const [updatedColumns] = await connection.execute('DESCRIBE banners');
    console.table(updatedColumns);
    
    // 인덱스 추가 (성능 향상)
    console.log('\n🔄 인덱스 추가 중...');
    try {
      await connection.execute('CREATE INDEX idx_banner_type ON banners(banner_type)');
      console.log('✅ banner_type 인덱스 추가 완료');
    } catch (e) {
      if (e.code !== 'ER_DUP_KEYNAME') {
        console.log('⚠️  banner_type 인덱스 추가 실패:', e.message);
      } else {
        console.log('ℹ️  banner_type 인덱스 이미 존재');
      }
    }
    
    try {
      await connection.execute('CREATE INDEX idx_device_type ON banners(device_type)');
      console.log('✅ device_type 인덱스 추가 완료');
    } catch (e) {
      if (e.code !== 'ER_DUP_KEYNAME') {
        console.log('⚠️  device_type 인덱스 추가 실패:', e.message);
      } else {
        console.log('ℹ️  device_type 인덱스 이미 존재');
      }
    }
    
    console.log('\n🎉 전체 마이그레이션이 성공적으로 완료되었습니다!');
    
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔐 데이터베이스 연결 종료');
    }
  }
}

// 스크립트 실행
if (require.main === module) {
  migrateBannersTable()
    .then(() => {
      console.log('\n✅ 마이그레이션 스크립트 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ 마이그레이션 스크립트 실패:', error);
      process.exit(1);
    });
}

module.exports = { migrateBannersTable };