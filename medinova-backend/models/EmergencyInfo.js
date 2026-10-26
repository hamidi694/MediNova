const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  contactName: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  bloodType: { type: String, default: '' },
  allergies: { type: String, default: '' },
  importantTreatments: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('EmergencyInfo', emergencySchema);