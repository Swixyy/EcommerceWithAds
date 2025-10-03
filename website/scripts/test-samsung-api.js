#!/usr/bin/env node

async function testSamsungAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/products?search=Samsung');
    const data = await response.json();
    
    console.log('Samsung products found:');
    data.products.forEach(product => {
      console.log('- Name:', product.name);
      console.log('  Image:', product.image);
      console.log('  Price:', product.price);
      console.log('');
    });
    
    // Test the Galaxy S24 specifically
    const galaxyS24 = data.products.find(p => p.name === 'Samsung Galaxy S24');
    if (galaxyS24) {
      console.log('🎯 Samsung Galaxy S24 found:');
      console.log('  Image path:', galaxyS24.image);
      
      // Test if the image is accessible
      try {
        const imageResponse = await fetch(`http://localhost:3000${galaxyS24.image}`);
        console.log('  Image status:', imageResponse.status, imageResponse.statusText);
        console.log('  Image accessible:', imageResponse.ok ? '✅' : '❌');
      } catch (error) {
        console.log('  Image error:', error.message);
      }
    } else {
      console.log('❌ Samsung Galaxy S24 not found in API results');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSamsungAPI();
