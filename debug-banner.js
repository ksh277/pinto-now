const mysql = require('mysql2/promise');

async function main() {
  try {
    console.log('Connecting to database...');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root', 
      password: '',
      database: 'pinto'
    });
    
    console.log('Connected to database');
    
    // Check banners table structure
    console.log('\n=== Banners Table Structure ===');
    const [columns] = await connection.query('DESCRIBE banners');
    console.log(columns);
    
    // Check if there are any banners
    console.log('\n=== All Banners ===');
    const [banners] = await connection.query('SELECT * FROM banners');
    console.log(`Found ${banners.length} banners:`);
    console.log(banners);
    
    // Check TOP_BANNER specifically
    console.log('\n=== TOP_BANNER type banners ===');
    const [topBanners] = await connection.query("SELECT * FROM banners WHERE banner_type = 'TOP_BANNER'");
    console.log(`Found ${topBanners.length} TOP_BANNER banners:`);
    console.log(topBanners);
    
    // Check active banners
    console.log('\n=== Active banners ===');
    const [activeBanners] = await connection.query("SELECT * FROM banners WHERE is_active = 1");
    console.log(`Found ${activeBanners.length} active banners:`);
    console.log(activeBanners);
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

main();