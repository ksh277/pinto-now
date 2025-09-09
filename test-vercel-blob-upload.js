// Test Vercel Blob upload with a test image
const fs = require('fs');
const FormData = require('form-data');
const { default: fetch } = require('node-fetch');

async function testVercelBlobUpload() {
  try {
    console.log('Vercel Blob 업로드 테스트 중...\n');
    
    // 기존 이미지 중 하나를 테스트용으로 사용
    const testImagePath = './images/top1.jpg';
    
    if (!fs.existsSync(testImagePath)) {
      console.log('❌ 테스트 이미지가 없습니다:', testImagePath);
      return;
    }
    
    console.log('📤 테스트 이미지 업로드 중...');
    
    const formData = new FormData();
    formData.append('image', fs.createReadStream(testImagePath));
    formData.append('title', 'Vercel Blob 테스트 배너');
    formData.append('href', '/test-vercel-blob');
    formData.append('main_title', 'Vercel Blob 테스트');
    formData.append('sub_title', 'Vercel Blob Storage 업로드 테스트');
    formData.append('more_button_link', '/test-vercel-blob');
    formData.append('banner_type', 'TOP_BANNER');
    formData.append('device_type', 'all');
    formData.append('is_active', 'true');
    formData.append('sort_order', '100');
    formData.append('start_at', '2025-01-01 00:00:00');
    formData.append('end_at', '2025-12-31 23:59:59');
    
    const response = await fetch('http://localhost:3030/api/banners', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Vercel Blob 업로드 성공!');
      console.log('   배너 ID:', result.id);
      console.log('   이미지 URL:', result.image_url);
      console.log('   제목:', result.title);
      
      // URL이 Vercel Blob인지 확인
      if (result.image_url.includes('blob.vercel-storage.com')) {
        console.log('🎉 Vercel Blob Storage가 정상 작동합니다!');
      } else {
        console.log('⚠️  다른 스토리지를 사용 중입니다:', result.image_url);
      }
    } else {
      const error = await response.text();
      console.log('❌ 업로드 실패:', response.status);
      console.log('   에러:', error);
    }
    
  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
    console.log('\n💡 .env.local에 BLOB_READ_WRITE_TOKEN이 설정되어 있는지 확인하세요!');
  }
}

testVercelBlobUpload();