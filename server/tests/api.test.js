/**
 * Basic server API tests
 */
const axios = require('axios');

describe('Server API Tests', () => {
  // Store the base URL for API requests
  const baseUrl = 'http://localhost:5000';
  
  // Test the root endpoint
  test('Root endpoint returns welcome message', async () => {
    try {
      const response = await axios.get(baseUrl);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
      expect(response.data.message).toBe('Welcome to Pricefy API');
    } catch (error) {
      console.error('Error testing root endpoint:', error.message);
      // Fail the test if there's an error
      expect(error).toBeUndefined();
    }
  });
  
  // Test the products endpoint
  test('Products endpoint returns array of products', async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/products`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    } catch (error) {
      console.error('Error testing products endpoint:', error.message);
      // Fail the test if there's an error
      expect(error).toBeUndefined();
    }
  });
});
