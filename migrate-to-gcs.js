require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const fs = require('fs');

async function migrateToGoogleCloudSQL() {
  try {
    console.log('Starting migration to Google Cloud SQL...\n');
    
    // Connect to Google Cloud SQL
    console.log('Connecting to Google Cloud SQL...');
    const connection = await mysql.createConnection({
      host: '34.83.137.45',
      port: 3306,
      user: 'pinto-user',
      password: 'pinto123!',
      database: 'pinto',
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    console.log('✅ Connected to Google Cloud SQL');
    
    // Read the complete backup SQL file
    console.log('\nReading complete database backup...');
    const sqlContent = fs.readFileSync('complete_database_backup.sql', 'utf8');
    
    // Split SQL statements (simple approach - may need refinement)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    let successCount = 0;
    let skipCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        // Skip comments and empty statements
        if (statement.startsWith('--') || statement.trim() === '') {
          skipCount++;
          continue;
        }
        
        console.log(`\nExecuting statement ${i + 1}/${statements.length}:`);
        console.log(statement.substring(0, 100) + '...');
        
        await connection.execute(statement);
        successCount++;
        console.log('✅ Success');
        
      } catch (error) {
        console.log(`⚠️  Error (continuing): ${error.message}`);
        
        // Continue with migration even if some statements fail
        if (error.code === 'ER_TABLE_EXISTS_ERROR' || 
            error.code === 'ER_DUP_KEYNAME' ||
            error.message.includes('already exists')) {
          console.log('   (This is expected - table/key already exists)');
          skipCount++;
        }
      }
    }
    
    console.log('\n=== Migration Summary ===');
    console.log(`Total statements: ${statements.length}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Skipped: ${skipCount}`);
    console.log(`Failed: ${statements.length - successCount - skipCount}`);
    
    // Test the connection by checking tables
    console.log('\n=== Verifying Migration ===');
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`Found ${tables.length} tables in database:`);
    tables.forEach((table, index) => {
      console.log(`${index + 1}. ${Object.values(table)[0]}`);
    });
    
    // Check banners specifically
    console.log('\n=== Checking Banners Table ===');
    const [bannerCount] = await connection.query('SELECT COUNT(*) as count FROM banners');
    console.log(`Banners table has ${bannerCount[0].count} records`);
    
    if (bannerCount[0].count > 0) {
      const [bannerSample] = await connection.query('SELECT * FROM banners LIMIT 3');
      console.log('Sample banners:');
      bannerSample.forEach((banner, index) => {
        console.log(`${index + 1}. ${banner.title} (${banner.banner_type})`);
      });
    }
    
    await connection.end();
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    console.error('Error details:', error.message);
  }
}

migrateToGoogleCloudSQL();