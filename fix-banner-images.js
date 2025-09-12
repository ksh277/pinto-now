// Fix banner images to use more stable placeholder service
require('dotenv').config({ path: '.env.local' });

async function fixBannerImages() {
  try {
    console.log('Checking current banner images...\n');
    
    // Get current banners
    const response = await fetch('http://localhost:3030/api/product-shelf-banners');
    if (!response.ok) {
      throw new Error('Failed to fetch banners');
    }
    
    const data = await response.json();
    const banners = data.banners || [];
    
    console.log(`Found ${banners.length} banners`);
    
    for (const banner of banners) {
      console.log(`Banner ${banner.id}: ${banner.title}`);
      console.log(`Current image: ${banner.imageUrl}`);
      
      // Check if using via.placeholder.com and replace with placehold.co
      if (banner.imageUrl && banner.imageUrl.includes('via.placeholder.com')) {
        let newImageUrl = banner.imageUrl;
        
        // Replace with more stable service
        if (banner.imageUrl.includes('FF6B6B') && banner.imageUrl.includes('T-Shirt')) {
          newImageUrl = 'https://placehold.co/400x260/e2e8f0/64748b.png?text=T-Shirt+Banner';
        } else if (banner.imageUrl.includes('4A90E2') && banner.imageUrl.includes('Keyring')) {
          newImageUrl = 'https://placehold.co/400x260/e2e8f0/64748b.png?text=Keyring+Banner';
        } else if (banner.imageUrl.includes('28A745') && banner.imageUrl.includes('Umbrella')) {
          newImageUrl = 'https://placehold.co/400x260/e2e8f0/64748b.png?text=Umbrella+Banner';
        } else {
          // Generic replacement
          newImageUrl = banner.imageUrl.replace('via.placeholder.com', 'placehold.co');
        }
        
        console.log(`  → New image: ${newImageUrl}`);
        
        // Update banner
        const updateResponse = await fetch(`http://localhost:3030/api/product-shelf-banners/${banner.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer YOUR_ADMIN_TOKEN` // You'll need to add a valid admin token
          },
          body: JSON.stringify({
            title: banner.title,
            description: banner.description,
            imageUrl: newImageUrl,
            sortOrder: banner.sortOrder,
            isActive: banner.isActive
          })
        });
        
        if (updateResponse.ok) {
          console.log(`  ✅ Updated successfully`);
        } else {
          console.log(`  ❌ Update failed: ${await updateResponse.text()}`);
        }
      } else {
        console.log(`  → No change needed`);
      }
      console.log('');
    }
    
    console.log('✅ Banner image fix completed!');
    
  } catch (error) {
    console.error('❌ Error fixing banner images:', error);
  }
}

fixBannerImages();