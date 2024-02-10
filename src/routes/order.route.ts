import express from 'express';
import orderController from '../controllers/order.controller';
import { createValidator } from 'express-joi-validation';
import orderValidator from '../validators/order.validator';

const router = express.Router();
const validator = createValidator();

router.post('/store', validator.body(orderValidator), orderController.store);

export default router;
