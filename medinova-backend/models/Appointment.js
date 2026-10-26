const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: String, required: true },
  specialty: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, default: 'Clinique du Parc' },
  mode: { type: String, enum: ['visio', 'cabinet'], default: 'cabinet' },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);