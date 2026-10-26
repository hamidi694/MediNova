const express = require('express');
const EmergencyInfo = require('../models/EmergencyInfo');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    let info = await EmergencyInfo.findOne({ user: req.user._id });
    if (!info) info = await EmergencyInfo.create({ user: req.user._id });
    res.json(info);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur.' }); }
});

router.put('/', protect, async (req, res) => {
  try {
    let info = await EmergencyInfo.findOne({ user: req.user._id });
    if (!info) info = new EmergencyInfo({ user: req.user._id });
    info.contactName = req.body.contactName ?? info.contactName;
    info.contactPhone = req.body.contactPhone ?? info.contactPhone;
    info.bloodType = req.body.bloodType ?? info.bloodType;
    info.allergies = req.body.allergies ?? info.allergies;
    info.importantTreatments = req.body.importantTreatments ?? info.importantTreatments;
    await info.save();
    res.json(info);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur.' }); }
});

module.exports = router;