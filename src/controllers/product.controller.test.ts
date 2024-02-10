import productService from '../services/product.service';
import { Request, Response } from 'express';
import messages from '../utilities/messages';

// Mock Express response object
const res = {} as unknown as Response;
res.json = jest.fn();
res.status = jest.fn(() => res); // Chained

describe('Product Controller', () => {
  describe('getAll', () => {
    it('returns products and status 200', async () => {
      // Mock productService.getAll function
      const mockGetAll = jest.spyOn(productService, 'getAll');
      mockGetAll.mockResolvedValue([{ id: 1, name: 'Product 1' }]); // Mocking service response

      // Mock Request object with query parameter
      const req = {
          query: { page: '1' } // Mocking the query parameter
      } as unknown as Request;

      // Importing the controller after the mocks
      const productController = require('../controllers/product.controller').default;

      // Call the controller method
      await productController.getAll(req, res);

      // Expectations
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: [{ id: 1, name: 'Product 1' }], message: messages.productList });
      expect(mockGetAll).toHaveBeenCalledWith(1); // Expect the service method to be called with page number 1
    });

    it('returns error message and status 400 when productService.getAll throws an error', async () => {
      // Mock productService.getAll function to throw an error
      const mockGetAll = jest.spyOn(productService, 'getAll');
      mockGetAll.mockRejectedValue(new Error('Internal Server Error')); // Mocking an error response

      // Mock Request object with query parameter
      const req = {
          query: { page: '1' } // Mocking the query parameter
      } as unknown as Request;

      // Importing the controller after the mocks
      const productController = require('../controllers/product.controller').default;

      // Call the controller method
      await productController.getAll(req, res);

      // Expectations
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
      expect(mockGetAll).toHaveBeenCalledWith(1); // Expect the service method to be called with page number 1
    });
  });
});
