import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateBannerImages() {
  try {
    console.log('Updating banner images to local SVG files...');
    
    // 기존 배너들 확인
    const existingBanners = await prisma.banners.findMany({
      orderBy: { id: 'asc' }
    });
    
    console.log(`Found ${existingBanners.length} existing banners`);
    
    // placeholder 이미지를 사용하는 배너들을 찾아서 SVG로 교체
    for (const banner of existingBanners) {
      let newImageUrl = banner.image_url;
      
      // placeholder URL이나 외부 URL을 로컬 SVG로 교체
      if (banner.image_url.includes('placeholder') || banner.image_url.includes('via.placeholder')) {
        const bannerIndex = existingBanners.indexOf(banner) + 1;
        newImageUrl = `/images/sample-banner${bannerIndex}.svg`;
        
        await prisma.banners.update({
          where: { id: banner.id },
          data: { image_url: newImageUrl }
        });
        
        console.log(`Updated banner ID ${banner.id}: ${banner.image_url} -> ${newImageUrl}`);
      } else if (!banner.image_url.startsWith('/images/sample-banner')) {
        // 다른 외부 URL들도 로컬 SVG로 교체
        const bannerIndex = existingBanners.indexOf(banner) + 1;
        newImageUrl = `/images/sample-banner${Math.min(bannerIndex, 4)}.svg`;
        
        await prisma.banners.update({
          where: { id: banner.id },
          data: { image_url: newImageUrl }
        });
        
        console.log(`Updated banner ID ${banner.id}: ${banner.image_url} -> ${newImageUrl}`);
      }
    }
    
    console.log('✅ Banner images updated successfully!');
  } catch (error) {
    console.error('❌ Error updating banner images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateBannerImages();