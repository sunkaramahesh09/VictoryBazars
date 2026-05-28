import express from 'express';
import { placeOrder, getMyOrders, getAllOrders, updateOrderStatus, verifyPIN, getOrderStats } from '../controllers/orderController.js';
import { protect, admin, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/verify-pin', protect, admin, verifyPIN);
router.get('/stats', protect, admin, getOrderStats);
router.get('/my', protect, getMyOrders);
router.get('/', protect, admin, getAllOrders);
// optionalProtect: links order to user account if logged in, allows guests too
router.post('/', optionalProtect, placeOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);
export default router;
