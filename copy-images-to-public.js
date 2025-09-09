// Copy images to Next.js public folder for direct access
const fs = require('fs');
const path = require('path');

const imagesToCopy = [
  { from: './images/1.png', to: './public/category/1.png' },
  { from: './images/2.png', to: './public/category/2.png' },
  { from: './images/3.png', to: './public/category/3.png' },
  { from: './images/4.png', to: './public/category/4.png' },
  { from: './images/5.png', to: './public/category/5.png' },
  { from: './images/6.png', to: './public/category/6.png' },
  { from: './images/7.png', to: './public/category/7.png' },
  { from: './images/8.png', to: './public/category/8.png' },
  { from: './images/top1.jpg', to: './public/banners/top1.jpg' },
  { from: './images/top2.jpg', to: './public/banners/top2.jpg' }
];

async function copyImagesToPublic() {
  console.log('이미지들을 public 폴더로 복사 중...\n');
  
  // 디렉토리 생성
  const dirs = ['./public/category', './public/banners'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 디렉토리 생성: ${dir}`);
    }
  });
  
  let successCount = 0;
  let failCount = 0;
  
  for (const img of imagesToCopy) {
    try {
      if (fs.existsSync(img.from)) {
        fs.copyFileSync(img.from, img.to);
        console.log(`✅ 복사 완료: ${img.from} → ${img.to}`);
        successCount++;
      } else {
        console.log(`❌ 파일 없음: ${img.from}`);
        failCount++;
      }
    } catch (error) {
      console.log(`❌ 복사 실패: ${img.from} - ${error.message}`);
      failCount++;
    }
  }
  
  console.log(`\n--- 결과 ---`);
  console.log(`✅ 성공: ${successCount}개`);
  console.log(`❌ 실패: ${failCount}개`);
  
  if (successCount > 0) {
    console.log('\n--- URL 참조 예시 ---');
    console.log('카테고리 이미지: /category/1.png, /category/2.png, ...');
    console.log('탑배너 이미지: /banners/top1.jpg, /banners/top2.jpg');
    console.log('\n이제 이 URL들을 컴포넌트에서 사용하세요!');
  }
}

copyImagesToPublic();