const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: String, enum: ['food', 'supermarket', 'pharmacy', 'other'], default: 'food' },
  logo: String,
  coverImage: String,
  address: {
    street: String,
    city: String,
    coordinates: { lat: Number, lng: Number }
  },
  phone: String,
  email: String,
  openingHours: {
    monday:    { open: String, close: String },
    tuesday:   { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday:  { open: String, close: String },
    friday:    { open: String, close: String },
    saturday:  { open: String, close: String },
    sunday:    { open: String, close: String }
  },
  deliveryTime: { min: Number, max: Number },
  deliveryFee: { type: Number, default: 0 },
  minimumOrder: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Store', storeSchema);
