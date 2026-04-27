const router = require('express').Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.post('/', auth, role('client'), async (req, res) => {
  try {
    const order = new Order({ ...req.body, clientId: req.user._id });
    await order.save();
    req.app.get('io').emit('new_order', order);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'client') query.clientId = req.user._id;
    else if (req.user.role === 'driver') query.driverId = req.user._id;
    else if (req.user.role === 'store') query.storeId = req.user.storeId;
    const orders = await Order.find(query)
      .populate('clientId', 'name phone')
      .populate('driverId', 'name phone')
      .populate('storeId', 'name')
      .sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/available', auth, role('driver'), async (req, res) => {
  try {
    const orders = await Order.find({ status: 'ready', driverId: null })
      .populate('storeId', 'name address')
      .sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('clientId', 'name phone address')
      .populate('driverId', 'name phone currentLocation')
      .populate('storeId', 'name address');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    order.statusHistory.push({ status, note });
    if (status === 'delivered') order.deliveredAt = new Date();
    await order.save();
    req.app.get('io').emit('order_updated', order);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/assign-driver', auth, role('admin', 'store'), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { driverId: req.body.driverId, status: 'picked_up' },
      { new: true }
    );
    req.app.get('io').emit('order_updated', order);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/rate', auth, role('client'), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { rating: req.body },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
