const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  storeId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    options: [{ name: String, choice: String, price: Number }]
  }],
  subtotal: Number,
  deliveryFee: Number,
  total: Number,
  status: {
    type: String,
    enum: ['pending','confirmed','preparing','ready','picked_up','delivering','delivered','cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }],
  deliveryAddress: {
    street: String,
    city: String,
    coordinates: { lat: Number, lng: Number },
    notes: String
  },
  paymentMethod: { type: String, enum: ['cash', 'card'], default: 'cash' },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  estimatedDeliveryTime: Date,
  deliveredAt: Date,
  rating: { score: Number, comment: String },
  createdAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
