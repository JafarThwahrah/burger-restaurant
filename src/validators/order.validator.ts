import Joi from 'joi';
import messages from '../utilities/messages';

// Define validation for each product
const productValidator = Joi.object({
  productId: Joi.number().integer().positive().required().messages({
    'number.base': messages.joiProductIdBase,
    'number.integer': messages.joiProductIdInteger,
    'number.positive': messages.joiProductIdPositive  ,
    'any.required':   messages.joiProductRequired,

  }),
  quantity: Joi.number().integer().positive().required().messages({
    'number.base': messages.joiQuantityBase,
    'number.integer': messages.joiQuantityInteger,
    'number.positive': messages.joiQuantityPositive,
    'any.required': messages.joiQuantityRequired,

  }),
});

// Define validation for the request payload
const orderValidator = Joi.object({
  products: Joi.array().items(productValidator).min(1).required().messages({
    'array.min': messages.joiOrderArray,
    'any.required': messages.joiProductsArrayRequired,
  }),
});

export default orderValidator;
