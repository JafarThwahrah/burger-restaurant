import Joi from 'joi';

// Define validation for each product
const productValidator = Joi.object({
  productId: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().positive().required(),
});

// Define validation for the request payload
const orderValidator = Joi.object({
  products: Joi.array().items(productValidator).min(1).required(),
});

export default orderValidator;  