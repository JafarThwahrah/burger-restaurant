import orderRoutes from './order.route';
import express from 'express';
const router = express();

router.use('/orders', orderRoutes)

export default router;