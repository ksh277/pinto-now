require('dotenv').config({ path: '.env.local' });
const { Storage } = require('@google-cloud/storage');

async function testGoogleCloudStorage() {
  try {
    console.log('Testing Google Cloud Storage connection...\n');
    
    // Check environment variables
    console.log('Environment Variables:');
    console.log('GOOGLE_CLOUD_PROJECT_ID:', process.env.GOOGLE_CLOUD_PROJECT_ID);
    console.log('GOOGLE_CLOUD_BUCKET_NAME:', process.env.GOOGLE_CLOUD_BUCKET_NAME);
    console.log('GOOGLE_CLOUD_ACCESS_KEY_ID:', process.env.GOOGLE_CLOUD_ACCESS_KEY_ID ? 'Set' : 'Not set');
    console.log('GOOGLE_CLOUD_SECRET_ACCESS_KEY:', process.env.GOOGLE_CLOUD_SECRET_ACCESS_KEY ? 'Set' : 'Not set');
    
    console.log('\n--- Testing Connection ---');
    
    // Initialize Storage client
    const storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    });
    
    const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME || 'pinto-images';
    console.log(`Using bucket: ${bucketName}`);
    
    const bucket = storage.bucket(bucketName);
    
    // Check if bucket exists and is accessible
    console.log('\nChecking bucket accessibility...');
    const [exists] = await bucket.exists();
    console.log(`Bucket exists: ${exists}`);
    
    if (exists) {
      // List some files to test access
      console.log('\nListing files in bucket (first 10)...');
      const [files] = await bucket.getFiles({ maxResults: 10 });
      console.log(`Found ${files.length} files:`);
      files.forEach((file, index) => {
        console.log(`${index + 1}. ${file.name} (${file.metadata.size} bytes)`);
      });
    }
    
    console.log('\n✅ Google Cloud Storage connection test completed successfully');
    
  } catch (error) {
    console.error('\n❌ Google Cloud Storage test failed:');
    console.error('Error:', error.message);
    
    if (error.code) {
      console.error('Error Code:', error.code);
    }
    
    if (error.details) {
      console.error('Details:', error.details);
    }
  }
}

testGoogleCloudStorage();