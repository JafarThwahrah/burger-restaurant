import request from 'supertest';
import express from 'express';
import { createValidator } from 'express-joi-validation';
import orderValidator from '../validators/order.validator';
import orderController from '../controllers/order.controller';
import orderService from '../services/order.service';

const mockOrderServiceStore = orderService.store as jest.Mock;

const app = express();
const validator = createValidator();

// Mocking the store function in the controller for testing purposes
orderController.store = jest.fn().mockReturnValue({});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/store', validator.body(orderValidator), orderController.store);

describe('Order routes', () => {
  it('should respond with 400 status when sending wrong data', async () => {
    const invalidOrderData = {
      products: [   
        {
          productId: 0, // Replace with an invalid productId
          quantity: 1,
        },
      ],
    };
    const invalidResponse = await request(app)
      .post('/store')
      .send(invalidOrderData);
    expect(invalidResponse.status).toBe(400);
  });
});
