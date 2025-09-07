const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkImages() {
  try {
    console.log('=== 이미지 관련 데이터 확인 ===');
    
    // Products의 thumbnail_url 확인
    const products = await prisma.products.findMany({
      select: {
        id: true,
        name: true,
        thumbnail_url: true
      }
    });
    
    console.log('\n📦 상품 썸네일:');
    products.forEach(product => {
      console.log(`${product.name}: ${product.thumbnail_url || 'NULL'}`);
    });

    // Banners 확인 
    const banners = await prisma.banners.findMany();
    console.log(`\n🖼️ 배너: ${banners.length}개`);
    
    // Category shortcuts 이미지 확인
    const shortcuts = await prisma.category_shortcuts.findMany({
      select: {
        title: true,
        image_url: true
      }
    });
    
    console.log('\n🔗 카테고리 아이콘:');
    shortcuts.forEach(shortcut => {
      console.log(`${shortcut.title}: ${shortcut.image_url}`);
    });

    // Product assets 테이블 확인
    const productAssets = await prisma.product_assets.findMany();
    console.log(`\n📸 상품 추가 이미지: ${productAssets.length}개`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkImages();