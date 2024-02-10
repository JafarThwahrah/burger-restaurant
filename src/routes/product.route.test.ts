import request from 'supertest';
import express from 'express';
import productRoutes from './product.route';
import productService from '../services/product.service';
// Create an Express app
const app = express();

// Mount the product routes
app.use('/products', productRoutes);

describe('GET /products', () => {
  it('responds with JSON', async () => {
    // Make a GET request to the /products endpoint
    const response = await request(app).get('/products');

    // Expect the response to have a JSON content type and a status code of 200
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });

  it('calls the productController.getAll function', async () => {
    // Mock the productController.getAll function
    const mockGetAllFunction =  jest.spyOn(productService, 'getAll');
    
    // Make a GET request to the /products endpoint
    await request(app).get('/products');

    // Expect the productController.getAll function to have been called
    expect(mockGetAllFunction).toHaveBeenCalled();
  });
});
