// Remove placeholder and test banners, keep only the real banner images
const { default: fetch } = require('node-fetch');

const bannersToRemove = [
  { id: 12, reason: 'Test banner with placeholder' },
  { id: 11, reason: 'Test banner with placeholder' },
  { id: 10, reason: 'Test banner with placeholder' },
  { id: 8, reason: 'Placeholder banner' },
  { id: 9, reason: 'Placeholder banner' },
  { id: 17, reason: 'Test upload banner' },
  { id: 16, reason: 'Test upload banner' },
  { id: 15, reason: 'Test upload banner' },
  { id: 14, reason: 'Test upload banner' },
  { id: 13, reason: 'Test upload banner' }
];

async function cleanupPlaceholderBanners() {
  try {
    console.log('Removing placeholder and test banners...\n');
    
    let successCount = 0;
    let failCount = 0;
    
    for (const banner of bannersToRemove) {
      try {
        console.log(`Removing banner ID ${banner.id} (${banner.reason})...`);
        
        const response = await fetch(`http://localhost:3030/api/banners/${banner.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          console.log(`✅ Success: Removed banner ID ${banner.id}`);
          successCount++;
        } else {
          const error = await response.text();
          console.log(`❌ Failed to remove banner ID ${banner.id}: ${error}`);
          failCount++;
        }
        
      } catch (error) {
        console.log(`❌ Error removing banner ID ${banner.id}:`, error.message);
        failCount++;
      }
      
      // Wait between deletions
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(`\n--- Results ---`);
    console.log(`✅ Successfully removed: ${successCount}`);
    console.log(`❌ Failed to remove: ${failCount}`);
    
    // Check final banner count
    const listResponse = await fetch('http://localhost:3030/api/banners?banner_type=TOP_BANNER');
    const banners = await listResponse.json();
    console.log(`\nRemaining TOP_BANNER banners: ${banners.length}`);
    
    // Show remaining banners
    banners.forEach((banner, index) => {
      const imageType = banner.imgSrc.includes('storage.googleapis.com') ? '🟢 Real' : '🟡 Placeholder';
      console.log(`${index + 1}. ${imageType} - ${banner.title || banner.alt}`);
    });
    
  } catch (error) {
    console.error('❌ Cleanup process failed:', error.message);
  }
}

cleanupPlaceholderBanners();