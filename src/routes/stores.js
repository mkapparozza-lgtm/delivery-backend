const router = require('express').Router();
const Store = require('../models/Store');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isActive: true, isApproved: true };
    if (category) query.category = category;
    const stores = await Store.find(query).sort('-rating');
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/all', auth, role('admin'), async (req, res) => {
  try {
    const stores = await Store.find().populate('ownerId', 'name email');
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, role('admin', 'store'), async (req, res) => {
  try {
    const store = new Store({ ...req.body, ownerId: req.user._id });
    await store.save();
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, role('admin', 'store'), async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/approve', auth, role('admin'), async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
