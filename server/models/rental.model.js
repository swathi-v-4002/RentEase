const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  renter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  // In a real app, you'd have proper date inputs
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  totalCost: { type: Number, required: true },
  rentalStatus: { type: String, enum: ['Pending', 'Approved', 'Completed'], default: 'Approved' }
}, { timestamps: true });

module.exports = mongoose.model('Rental', rentalSchema);