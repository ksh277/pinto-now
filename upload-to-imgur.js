// Alternative: Upload images to Imgur (free image hosting)
const fs = require('fs');
const { default: fetch } = require('node-fetch');

// Imgur API - 무료 계정으로 사용 가능
const IMGUR_CLIENT_ID = 'your_client_id_here'; // 이 부분은 Imgur에서 발급받아야 함

const imagesToUpload = [
  { file: './images/1.png', title: '아크릴 굿즈' },
  { file: './images/2.png', title: '포토카드' },
  { file: './images/3.png', title: '티셔츠 인쇄' },
  { file: './images/4.png', title: '컵 만들기' },
  { file: './images/5.png', title: '다꾸 만들기' },
  { file: './images/6.png', title: '반려동물 굿즈' },
  { file: './images/7.png', title: '단체 판촉물' },
  { file: './images/8.png', title: '광고, 사인물' },
  { file: './images/top1.jpg', title: 'PINTO 신규 서비스' },
  { file: './images/top2.jpg', title: 'PINTO 특별 이벤트' }
];

async function uploadToImgur() {
  console.log('⚠️  Imgur API 사용을 위해서는 Client ID가 필요합니다.');
  console.log('https://api.imgur.com/oauth2/addclient 에서 발급받으세요.\n');
  
  // 실제 구현 예시 (Client ID가 있을 때)
  /*
  for (const img of imagesToUpload) {
    if (!fs.existsSync(img.file)) continue;
    
    const imageData = fs.readFileSync(img.file);
    const base64 = imageData.toString('base64');
    
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: base64,
        type: 'base64',
        title: img.title
      })
    });
    
    const result = await response.json();
    if (result.success) {
      console.log(`✅ ${img.title}: ${result.data.link}`);
    }
  }
  */
}

uploadToImgur();