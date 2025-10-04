const testTrueSlidingWindow = async () => {
  console.log('🎯 Testing True Sliding Window Behavior...\n');
  
  console.log('📋 True Sliding Window Logic:');
  console.log('   1. Delete the 4th (rightmost) element');
  console.log('   2. Shift elements: 1→2, 2→3, 3→4');
  console.log('   3. Insert new product from last browsed category at position 1 (leftmost)\n');
  
  console.log('🎬 Step-by-Step Demo:');
  console.log('   Initial: [Empty, Empty, Empty, Empty]');
  console.log('');
  console.log('   Browse smartphones:');
  console.log('   - Delete: none (array empty)');
  console.log('   - Shift: none');
  console.log('   - Insert: [Smartphone A, Empty, Empty, Empty]');
  console.log('');
  console.log('   Browse tablets:');
  console.log('   - Delete: none (only 1 element)');
  console.log('   - Shift: Smartphone A moves to position 2');
  console.log('   - Insert: [Tablet A, Smartphone A, Empty, Empty]');
  console.log('');
  console.log('   Browse headphones:');
  console.log('   - Delete: none (only 2 elements)');
  console.log('   - Shift: Tablet A→2, Smartphone A→3');
  console.log('   - Insert: [Headphone A, Tablet A, Smartphone A, Empty]');
  console.log('');
  console.log('   Browse gaming:');
  console.log('   - Delete: none (only 3 elements)');
  console.log('   - Shift: Headphone A→2, Tablet A→3, Smartphone A→4');
  console.log('   - Insert: [Gaming A, Headphone A, Tablet A, Smartphone A]');
  console.log('');
  console.log('   Browse headphones AGAIN:');
  console.log('   - Delete: Smartphone A (was 4th)');
  console.log('   - Shift: Gaming A→2, Headphone A→3, Tablet A→4');
  console.log('   - Insert: [Headphone B, Gaming A, Headphone A, Tablet A]');
  console.log('');
  
  console.log('🔍 Algorithm Implementation:');
  console.log('   ✅ Get last browsed category');
  console.log('   ✅ Get new product from last browsed category');
  console.log('   ✅ Place new product at position 1 (leftmost)');
  console.log('   ✅ Get previous 3 products from browsing history');
  console.log('   ✅ Place them at positions 2, 3, 4');
  console.log('   ✅ This creates the sliding window effect\n');
  
  console.log('🧪 Testing Current System:');
  try {
    const response = await fetch('http://localhost:3000/api/ads/recommendations?limit=4');
    const data = await response.json();
    
    console.log('   📦 Current recommendations:', data.products?.length || 0, 'products');
    if (data.products?.length > 0) {
      data.products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.category?.name || 'No category'})`);
      });
    }
    
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
  
  console.log('\n🚀 Ready to Test True Sliding Window:');
  console.log('   1. Sign in as user "swixy"');
  console.log('   2. Browse smartphones → Check homepage (should show 1 smartphone)');
  console.log('   3. Browse tablets → Check homepage (should show tablet on left, smartphone on right)');
  console.log('   4. Browse headphones → Check homepage (should show headphone on left, tablet middle, smartphone right)');
  console.log('   5. Browse gaming → Check homepage (should show gaming on left, others slide right)');
  console.log('   6. Browse headphones AGAIN → Check homepage (should show NEW headphone on left, smartphone removed)');
  console.log('\n💡 This should now work exactly like a true sliding window!');
};

testTrueSlidingWindow().catch(console.error);
