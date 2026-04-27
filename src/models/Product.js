const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  category: String,
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  isAvailable: { type: Boolean, default: true },
  preparationTime: Number,
  options: [{
    name: String,
    choices: [{ name: String, price: Number }]
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
