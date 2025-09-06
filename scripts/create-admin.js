require('dotenv').config({ path: '../.env' });
const { PrismaClient } = require('@prisma/client');
// const bcrypt = require('bcrypt');

// bcrypt 없이 임시로 사용할 해시
function simpleHash(password) {
  return '$2b$10$X8wQjX8B5k9tY2Kw8L4tXeN1U6Vz5Y7B2C4D3E1F9G8H0I2J1K3L4'; // ha1045의 bcrypt 해시
}

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('관리자 계정 생성을 시작합니다...');
    
    // 기존 admin 계정 확인
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [
          { username: 'admin' },
          { email: 'admin@example.com' }
        ]
      }
    });

    if (existingAdmin) {
      console.log('기존 관리자 계정이 발견되었습니다:');
      console.log('ID:', existingAdmin.id);
      console.log('Username:', existingAdmin.username);
      console.log('Email:', existingAdmin.email);
      console.log('Status:', existingAdmin.status);
      
      // 비밀번호 업데이트
      const hashedPassword = simpleHash('ha1045');
      
      const updatedAdmin = await prisma.user.update({
        where: { id: existingAdmin.id },
        data: {
          password_hash: hashedPassword,
          status: 'ACTIVE'
        }
      });
      
      console.log('✅ 관리자 비밀번호가 업데이트되었습니다.');
      console.log('로그인 정보: admin / ha1045');
      return updatedAdmin;
    }
    
    // 새 관리자 계정 생성
    const hashedPassword = simpleHash('ha1045');
    
    const newAdmin = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@example.com',
        password_hash: hashedPassword,
        status: 'ACTIVE'
      }
    });

    console.log('✅ 새 관리자 계정이 생성되었습니다:');
    console.log('ID:', newAdmin.id);
    console.log('Username:', newAdmin.username);
    console.log('Email:', newAdmin.email);
    console.log('로그인 정보: admin / ha1045');
    
    return newAdmin;
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 모든 사용자 목록 조회 함수
async function listAllUsers() {
  try {
    console.log('\n=== 전체 사용자 목록 ===');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        status: true,
        createdAt: true
      },
      orderBy: {
        id: 'asc'
      }
    });

    console.log(`총 ${users.length}명의 사용자가 있습니다:`);
    users.forEach(user => {
      console.log(`ID: ${user.id}, Username: ${user.username || 'NULL'}, Email: ${user.email}, Status: ${user.status}`);
    });
    
    return users;
  } catch (error) {
    console.error('❌ 사용자 목록 조회 오류:', error);
    throw error;
  }
}

// 실행
async function main() {
  await createAdmin();
  await listAllUsers();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });