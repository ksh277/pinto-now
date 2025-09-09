// Helper script to add BLOB_READ_WRITE_TOKEN to .env.local
const fs = require('fs');

async function addBlobToken() {
  const envPath = './.env.local';
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local 파일을 찾을 수 없습니다.');
    return;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('BLOB_READ_WRITE_TOKEN')) {
    console.log('✅ BLOB_READ_WRITE_TOKEN이 이미 설정되어 있습니다.');
  } else {
    console.log('⚠️  BLOB_READ_WRITE_TOKEN을 .env.local에 추가해야 합니다.');
    console.log('\n다음 줄을 .env.local 파일에 추가하세요:');
    console.log('BLOB_READ_WRITE_TOKEN=여기에_토큰_붙여넣기');
  }
  
  // 현재 환경변수 확인
  console.log('\n📋 현재 환경변수 상태:');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ 설정됨' : '❌ 없음');
  console.log('GOOGLE_CLOUD_PROJECT_ID:', process.env.GOOGLE_CLOUD_PROJECT_ID ? '✅ 설정됨' : '❌ 없음');
  console.log('BLOB_READ_WRITE_TOKEN:', process.env.BLOB_READ_WRITE_TOKEN ? '✅ 설정됨' : '❌ 없음');
}

addBlobToken();