const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rental: { type: Schema.Types.ObjectId, ref: 'Rental', required: true, unique: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);