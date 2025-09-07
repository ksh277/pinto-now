const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('=== 로컬 MySQL 데이터 확인 ===');
    
    // 각 테이블의 레코드 수 확인
    const tables = [
      'User', 'banners', 'categories', 'products', 
      'category_shortcuts', 'sellers', 'orders'
    ];
    
    for (const table of tables) {
      try {
        const count = await prisma[table].count();
        console.log(`${table}: ${count}개 레코드`);
        
        // 첫 번째 레코드 예시
        if (count > 0) {
          const first = await prisma[table].findFirst();
          console.log(`  예시:`, Object.keys(first));
        }
      } catch (error) {
        console.log(`${table}: 테이블 없음 또는 오류`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();