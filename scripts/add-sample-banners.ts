import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addSampleBanners() {
  try {
    console.log('Adding sample banners...');
    
    // 기존 배너가 있는지 확인
    const existingBanners = await prisma.banners.findMany();
    console.log(`Found ${existingBanners.length} existing banners`);
    
    if (existingBanners.length < 4) {
      const sampleBanners = [
        {
          title: 'PINTO 배너 1 - 프리미엄 굿즈 제작',
          image_url: '/images/sample-banner1.svg',
          href: '/',
          start_at: new Date(),
          end_at: new Date('2025-12-31'),
          sort_order: 1,
          is_active: true,
        },
        {
          title: 'PINTO 배너 2 - 맞춤형 디자인',
          image_url: '/images/sample-banner2.svg',
          href: '/products',
          start_at: new Date(),
          end_at: new Date('2025-12-31'),
          sort_order: 2,
          is_active: true,
        },
        {
          title: 'PINTO 배너 3 - 고품질 아크릴',
          image_url: '/images/sample-banner3.svg',
          href: '/category/akril-goods',
          start_at: new Date(),
          end_at: new Date('2025-12-31'),
          sort_order: 3,
          is_active: true,
        },
        {
          title: 'PINTO 배너 4 - 신속 제작',
          image_url: '/images/sample-banner4.svg',
          href: '/guide/order',
          start_at: new Date(),
          end_at: new Date('2025-12-31'),
          sort_order: 4,
          is_active: true,
        },
      ];

      for (const banner of sampleBanners) {
        const created = await prisma.banners.create({
          data: banner,
        });
        console.log(`Created banner: ${created.title} (ID: ${created.id})`);
      }
      
      console.log('✅ Sample banners added successfully!');
    } else {
      console.log('⚠️  Sample banners already exist. Skipping creation.');
    }
  } catch (error) {
    console.error('❌ Error adding sample banners:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleBanners();