// Simple test to verify API is working
const axios = require('axios');

// Basic test function
async function testAPI() {
  try {
    console.log('Testing API connectivity...');
    
    // Test the root endpoint
    const response = await axios.get('http://localhost:5000/');
    
    if (response.data.message === 'Welcome to Pricefy API') {
      console.log('✅ API root endpoint test passed!');
    } else {
      console.error('❌ API root endpoint test failed: Unexpected response:', response.data);
      process.exit(1);
    }
    
    // Test products endpoint
    const productsResponse = await axios.get('http://localhost:5000/api/products');
    
    if (Array.isArray(productsResponse.data)) {
      console.log(`✅ Products endpoint test passed! Found ${productsResponse.data.length} products.`);
    } else {
      console.error('❌ Products endpoint test failed: Response is not an array:', productsResponse.data);
      process.exit(1);
    }
    
    console.log('All tests passed! ✨');
    
  } catch (error) {
    console.error('❌ API test failed with error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    process.exit(1);
  }
}

// Run the test after a delay to ensure server is running
setTimeout(() => {
  testAPI();
}, 3000);
