import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Branch from '../models/Branch.js';

const generatePIN = () => String(Math.floor(1000 + Math.random() * 9000));

// @desc  Place new order
// @route POST /api/orders
export const placeOrder = asyncHandler(async (req, res) => {
  const { customerName, customerPhone, customerEmail, branch, items, subtotal, notes } = req.body;
  if (!items?.length) { res.status(400); throw new Error('No order items'); }
  const branchDoc = await Branch.findById(branch);
  if (!branchDoc) { res.status(404); throw new Error('Branch not found'); }
  const pickupPIN = generatePIN();
  const order = await Order.create({
    user: req.user?._id,
    customerName, customerPhone, customerEmail,
    branch, items, subtotal, notes, pickupPIN,
    statusHistory: [{ status: 'pending' }],
  });
  await order.populate('branch', 'name address city phone');
  // Emit real-time notification to admin room
  req.io.to('admin_room').emit('new_order', {
    orderId: order._id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    branch: branchDoc.name,
    subtotal: order.subtotal,
    itemCount: items.length,
    createdAt: order.createdAt,
  });
  res.status(201).json({ success: true, order });
});

// @desc  Get logged-in user orders
// @route GET /api/orders/my
export const getMyOrders = asyncHandler(async (req, res) => {
  // Fetch by user ID (new orders after auth fix) OR by phone number
  // (legacy orders placed before the user-linking fix that have user:null)
  const query = {
    $or: [
      { user: req.user._id },
      { customerPhone: req.user.phone },
    ],
  };
  const orders = await Order.find(query)
    .populate('branch', 'name city address')
    .sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @desc  Get all orders (admin)
// @route GET /api/orders
export const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const query = {};
  if (req.query.status) query.status = req.query.status;
  if (req.query.branch) query.branch = req.query.branch;
  const [orders, total] = await Promise.all([
    Order.find(query).populate('branch', 'name city').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(query),
  ]);
  res.json({ success: true, orders, page, pages: Math.ceil(total / limit), total });
});

// @desc  Update order status (admin)
// @route PUT /api/orders/:id/status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id).populate('branch', 'name city');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.status = status;
  order.statusHistory.push({ status, updatedBy: req.user._id });
  await order.save();
  req.io.to('admin_room').emit('order_status_update', { orderId: order._id, orderNumber: order.orderNumber, status });
  req.io.emit(`order_update_${order._id}`, { status, updatedAt: new Date() });
  res.json({ success: true, order });
});

// @desc  Verify pickup PIN (admin)
// @route POST /api/orders/verify-pin
export const verifyPIN = asyncHandler(async (req, res) => {
  const { pin, branchId } = req.body;
  const order = await Order.findOne({ pickupPIN: pin, branch: branchId, status: 'ready' })
    .populate('branch', 'name city');
  if (!order) { res.status(404); throw new Error('Invalid PIN or order not ready for pickup'); }
  order.status = 'completed';
  order.statusHistory.push({ status: 'completed', updatedBy: req.user._id });
  await order.save();
  req.io.to('admin_room').emit('order_status_update', { orderId: order._id, orderNumber: order.orderNumber, status: 'completed' });
  // Notify the customer's My Orders page in real-time (same event OrderCard listens for)
  req.io.emit(`order_update_${order._id}`, { status: 'completed', updatedAt: new Date() });
  res.json({ success: true, message: 'Order completed successfully', order });
});

// @desc  Admin dashboard stats
// @route GET /api/orders/stats
export const getOrderStats = asyncHandler(async (_req, res) => {
  const [total, pending, preparing, ready, completed] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: 'pending' }),
    Order.countDocuments({ status: 'preparing' }),
    Order.countDocuments({ status: 'ready' }),
    Order.countDocuments({ status: 'completed' }),
  ]);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });
  const recentOrders = await Order.find().populate('branch', 'name').sort({ createdAt: -1 }).limit(5);
  res.json({ success: true, stats: { total, pending, preparing, ready, completed, todayOrders }, recentOrders });
});
