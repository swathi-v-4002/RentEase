const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  rental: { type: Schema.Types.ObjectId, ref: 'Rental', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Simulated Card' },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Completed' },
  transactionId: { type: String, default: () => `txn_${new Date().getTime()}` }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);