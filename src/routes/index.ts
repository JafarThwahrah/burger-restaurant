import orderRoutes from './order.route';
import express from 'express';
import productRoutes from './product.route';
const router = express();

router.use('/orders', orderRoutes)
router.use('/products', productRoutes)

export default router;