// Node.js script to check banner API
const https = require('https');
const http = require('http');

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function checkBanners() {
  try {
    console.log('Checking banner API endpoints...\n');
    
    // Check all banners
    console.log('1. Checking /api/banners');
    const allBanners = await makeRequest('http://localhost:3000/api/banners');
    console.log(`Found ${Array.isArray(allBanners) ? allBanners.length : 0} banners total`);
    console.log(allBanners);
    
    // Check TOP_BANNER specifically
    console.log('\n2. Checking /api/banners?banner_type=TOP_BANNER');
    const topBanners = await makeRequest('http://localhost:3000/api/banners?banner_type=TOP_BANNER');
    console.log(`Found ${Array.isArray(topBanners) ? topBanners.length : 0} TOP_BANNER banners`);
    console.log(topBanners);
    
    // Check with debug logging
    console.log('\n3. Checking with debug parameters');
    const debugBanners = await makeRequest('http://localhost:3000/api/banners?include_inactive=true&limit=100');
    console.log(`Found ${Array.isArray(debugBanners) ? debugBanners.length : 0} banners (including inactive)`);
    console.log(debugBanners);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkBanners();