// Upload category shortcut images to Google Cloud Storage
const fs = require('fs');
const FormData = require('form-data');
const { default: fetch } = require('node-fetch');

const categoryImages = [
  { id: 1, title: '아크릴 굿즈', filename: '1.png' },
  { id: 2, title: '포토카드', filename: '2.png' },
  { id: 3, title: '티셔츠 인쇄', filename: '3.png' },
  { id: 4, title: '컵 만들기', filename: '4.png' },
  { id: 5, title: '다꾸 만들기', filename: '5.png' },
  { id: 6, title: '반려동물 굿즈', filename: '6.png' },
  { id: 7, title: '단체 판촉물', filename: '7.png' },
  { id: 8, title: '광고, 사인물', filename: '8.png' }
];

async function uploadCategoryImages() {
  try {
    console.log('카테고리 이미지들을 구글 클라우드 스토리지에 업로드 중...\n');
    
    const uploadedImages = [];
    
    for (const category of categoryImages) {
      const imagePath = `./images/${category.filename}`;
      
      // 파일 존재 확인
      if (!fs.existsSync(imagePath)) {
        console.log(`❌ 파일을 찾을 수 없음: ${imagePath}`);
        continue;
      }
      
      try {
        console.log(`${category.id}. ${category.title} (${category.filename}) 업로드 중...`);
        
        // FormData 생성
        const formData = new FormData();
        formData.append('image', fs.createReadStream(imagePath));
        formData.append('title', `Category ${category.id} - ${category.title}`);
        formData.append('href', `/category/${category.id}`);
        formData.append('main_title', category.title);
        formData.append('sub_title', '카테고리 바로가기');
        formData.append('more_button_link', `/category/${category.id}`);
        formData.append('banner_type', 'CATEGORY_SHORTCUT');
        formData.append('device_type', 'all');
        formData.append('is_active', 'true');
        formData.append('sort_order', category.id.toString());
        formData.append('start_at', '2025-01-01 00:00:00');
        formData.append('end_at', '2025-12-31 23:59:59');
        
        const response = await fetch('http://localhost:3030/api/banners', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(`✅ 성공: ${category.title}`);
          console.log(`   이미지 URL: ${result.image_url}`);
          
          uploadedImages.push({
            id: category.id,
            title: category.title,
            image_url: result.image_url,
            filename: category.filename
          });
        } else {
          const error = await response.text();
          console.log(`❌ 실패: ${category.title} - ${error}`);
        }
        
      } catch (error) {
        console.log(`❌ 에러: ${category.title} - ${error.message}`);
      }
      
      // 업로드 간 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n--- 업로드 결과 ---`);
    console.log(`✅ 성공한 업로드: ${uploadedImages.length}개`);
    console.log(`❌ 실패한 업로드: ${categoryImages.length - uploadedImages.length}개`);
    
    if (uploadedImages.length > 0) {
      console.log('\n--- 업로드된 이미지 URL들 ---');
      uploadedImages.forEach(img => {
        console.log(`${img.id}. ${img.title}: ${img.image_url}`);
      });
      
      console.log('\n--- CategoryShortcuts 컴포넌트용 코드 ---');
      console.log('const categories: ShortcutCategory[] = [');
      uploadedImages.forEach((img, index) => {
        const href = `/category/${img.id === 1 ? 'acrylic' : 
          img.id === 2 ? 'photocard' : 
          img.id === 3 ? 'tshirt' : 
          img.id === 4 ? 'cup' : 
          img.id === 5 ? 'diary' : 
          img.id === 6 ? 'pet' : 
          img.id === 7 ? 'promotion' : 'sign'}`;
        
        console.log(`  { id: '${img.id}', title: '${img.title}', image_url: '${img.image_url}', href: '${href}', sort_order: ${img.id}, is_active: true }${index < uploadedImages.length - 1 ? ',' : ''}`);
      });
      console.log('];');
    }
    
  } catch (error) {
    console.error('❌ 업로드 과정 실패:', error.message);
  }
}

uploadCategoryImages();