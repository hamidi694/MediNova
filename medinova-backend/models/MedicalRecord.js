const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bloodType: { type: String, default: '' }, 
  allergies: [{ type: String }], 
  chronicDiseases: [{ type: String }], 
  medicalHistory: { type: String, default: '' }, 
  currentTreatments: { type: String, default: '' },
  doctor: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    specialty: { type: String, default: '' },
  },
  documents: [{
    name: { type: String },
    url: { type: String },
    date: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);