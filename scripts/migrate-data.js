const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// 로컬 MySQL 연결
const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.LOCAL_DATABASE_URL || "mysql://root:12345@localhost:3306/pinto"
    }
  }
});

// PlanetScale 연결  
const remotePrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.REMOTE_DATABASE_URL || process.env.DATABASE_URL
    }
  }
});

async function migrateData() {
  try {
    console.log('=== 데이터 마이그레이션 시작 ===');
    
    // 1. Users 마이그레이션
    console.log('Users 마이그레이션...');
    const users = await localPrisma.user.findMany();
    for (const user of users) {
      await remotePrisma.user.create({
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          password_hash: user.password_hash,
          status: user.status,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    }
    console.log(`✓ Users: ${users.length}개 마이그레이션 완료`);

    // 2. Categories 마이그레이션  
    console.log('Categories 마이그레이션...');
    const categories = await localPrisma.categories.findMany();
    for (const category of categories) {
      await remotePrisma.categories.create({
        data: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          parent_id: category.parent_id,
          description: category.description,
          icon_url: category.icon_url,
          sort_order: category.sort_order,
          is_active: category.is_active,
          created_at: category.created_at
        }
      });
    }
    console.log(`✓ Categories: ${categories.length}개 마이그레이션 완료`);

    // 3. Category shortcuts 마이그레이션
    console.log('Category shortcuts 마이그레이션...');
    const shortcuts = await localPrisma.category_shortcuts.findMany();
    for (const shortcut of shortcuts) {
      await remotePrisma.category_shortcuts.create({
        data: {
          id: shortcut.id,
          title: shortcut.title,
          image_url: shortcut.image_url,
          href: shortcut.href,
          sort_order: shortcut.sort_order,
          is_active: shortcut.is_active,
          created_at: shortcut.created_at,
          updated_at: shortcut.updated_at
        }
      });
    }
    console.log(`✓ Category shortcuts: ${shortcuts.length}개 마이그레이션 완료`);

    // 4. Products 마이그레이션
    console.log('Products 마이그레이션...');
    const products = await localPrisma.products.findMany();
    for (const product of products) {
      await remotePrisma.products.create({
        data: {
          id: product.id,
          seller_id: product.seller_id,
          category_id: product.category_id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          stock: product.stock,
          status: product.status,
          is_customizable: product.is_customizable,
          thumbnail_url: product.thumbnail_url,
          rating_avg: product.rating_avg,
          review_count: product.review_count,
          view_count: product.view_count,
          created_at: product.created_at,
          updated_at: product.updated_at
        }
      });
    }
    console.log(`✓ Products: ${products.length}개 마이그레이션 완료`);

    console.log('🎉 모든 데이터 마이그레이션 완료!');
    
  } catch (error) {
    console.error('마이그레이션 오류:', error);
  } finally {
    await localPrisma.$disconnect();
    await remotePrisma.$disconnect();
  }
}

migrateData();