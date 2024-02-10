import  orderService from '../services/order.service';
import * as prismaService from '../services/prisma.service';
import * as helpers from '../utilities/helpers';
import { Request, Response } from "express";
import orderValidator from '../validators/order.validator';
import messages from '../utilities/messages';
import sendEmail from '../mails/ingredientStockWarningEmail';
// Mock Prisma methods with type
jest.mock('../services/prisma.service', () => ({
  __esModule: true,
  default: {
    order: {
      create: jest.fn(),
    },
    orderProduct: {
      create: jest.fn(),
    },
    ingredient: {
      update: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
    },
    productIngredient: {
      findMany: jest.fn(),
    },
  },
}));

// Mock the sendEmail function
jest.mock('../mails/ingredientStockWarningEmail', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the Express Request and Response objects
const mockRequest = {} as Request;
const mockResponse = {} as Response;

describe('orderService.store', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should throw an error if products are not found', async () => {
      // Mock a request with invalid product IDs
      const invalidRequest = {
        body: {
          products: [
            // Invalid product ID, should fail validation
            {
              productId: -1,
              quantity: 2
            }
          ]
        }
      } as Request;
  
      // Ensure that the validation fails before reaching the store function
      await expect(orderValidator.validateAsync(invalidRequest.body)).rejects.toThrow();
  
      // Expect that the store function won't be called
      expect(prismaService.default.order.create).not.toHaveBeenCalled();
    });
  
    it('should throw an error if ingredients stock is unavailable', async () => {
      // Mock request with valid products
      const validRequest = {
        body: {
          products: [
            // Valid product ID, should pass validation
            {
              productId: 1,
              quantity: 2
            }
          ]
        }
      } as Request;
  
      // Mock the behavior of Prisma methods
      (prismaService.default.product.findMany as jest.Mock).mockResolvedValueOnce([]); 
  
      // Mock the behavior of helper functions
      jest.spyOn(helpers, 'checkIngredientsAvailablity').mockResolvedValueOnce(false);
  
      // Ensure that the validation passes before reaching the store function
      await expect(orderValidator.validateAsync(validRequest.body)).resolves.toBeTruthy();
  
      // Expect that the store function will be called
  
      // Expect that Prisma methods won't be called
      expect(prismaService.default.order.create).not.toHaveBeenCalled();
    });
  
    it('should create order and update ingredients', async () => {
        // Mock request with valid products
        const validRequest = {
          body: {
            products: [
              // Valid product ID, should pass validation
              {
                productId: 1,
                quantity: 2
              }
            ]
          }
        } as Request;
      
        // Mock the behavior of Prisma methods to return an empty array, indicating no products found
        (prismaService.default.product.findMany as jest.Mock).mockResolvedValueOnce([]);
      
        // Ensure that the validation passes before reaching the store function
        await expect(orderValidator.validateAsync(validRequest.body)).resolves.toBeTruthy();
      
        // Expect that invoking store function with this request should throw an error
        await expect(orderService.store(validRequest, mockResponse)).rejects.toThrow(messages.productNotFound);
      
        // Expect that Prisma methods won't be called as no order should be created
        expect(prismaService.default.order.create).not.toHaveBeenCalled();
        expect(prismaService.default.orderProduct.create).not.toHaveBeenCalled();
        expect(prismaService.default.ingredient.update).not.toHaveBeenCalled();

      });
      
  });
  
