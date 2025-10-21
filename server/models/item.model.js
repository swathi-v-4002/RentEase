const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  itemName: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  rentalPrice: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  availabilityStatus: {
    type: String,
    required: true,
    enum: ['Available', 'Rented', 'Pending'], // The status must be one of these values
    default: 'Available'
  },
  owner: {
    type: Schema.Types.ObjectId, // This is how we create a reference
    ref: 'User', // It refers to the 'User' model
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category', // It refers to the 'Category' model
    required: true
  }
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;