const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }, 
  value: { type: Number, required: true },
  unit: { type: String, required: true }, 
  reference: { type: String, default: '' }, 
  date: { type: Date, required: true },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Analysis', analysisSchema);