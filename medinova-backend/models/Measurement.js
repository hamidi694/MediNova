const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true, enum: ['heart_rate', 'blood_pressure', 'weight', 'blood_sugar'] },
  value: { type: Number, required: true },
  unit: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

measurementSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Measurement', measurementSchema);