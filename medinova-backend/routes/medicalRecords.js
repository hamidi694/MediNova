const express = require('express');
const MedicalRecord = require('../models/MedicalRecord');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    let record = await MedicalRecord.findOne({ user: req.user._id });
    if (!record) {
      record = await MedicalRecord.create({ user: req.user._id });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

router.put('/', protect, async (req, res) => {
  try {
    let record = await MedicalRecord.findOne({ user: req.user._id });
    if (!record) {
      record = new MedicalRecord({ user: req.user._id });
    }

    record.bloodType = req.body.bloodType ?? record.bloodType;
    record.allergies = req.body.allergies ?? record.allergies;
    record.chronicDiseases = req.body.chronicDiseases ?? record.chronicDiseases;
    record.medicalHistory = req.body.medicalHistory ?? record.medicalHistory;
    record.currentTreatments = req.body.currentTreatments ?? record.currentTreatments;
    if (req.body.doctor) record.doctor = { ...record.doctor, ...req.body.doctor };
    if (req.body.documents) record.documents = req.body.documents;

    await record.save();
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

module.exports = router;