const express = require('express');
const Medication = require('../models/Medication');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const meds = await Medication.find({ user: req.user._id }).sort({ startDate: -1 });
    res.json(meds);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { name, description, dosage, times, startDate, endDate } = req.body;
    if (!name || !dosage || !times?.length || !startDate || !endDate) {
      return res.status(400).json({ message: 'Champs requis manquants.' });
    }
    const med = await Medication.create({
      user: req.user._id,
      name,
      description,
      dosage,
      times,
      startDate,
      endDate,
    });
    res.status(201).json(med);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

router.put('/:id/mark', protect, async (req, res) => {
  try {
    const { date, time, status } = req.body;
    const med = await Medication.findOne({ _id: req.params.id, user: req.user._id });
    if (!med) return res.status(404).json({ message: 'Médicament introuvable.' });

    med.taken.push({ date, time, status });
    await med.save();
    res.json(med);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const med = await Medication.findOne({ _id: req.params.id, user: req.user._id });
    if (!med) return res.status(404).json({ message: 'Médicament introuvable.' });
    await med.deleteOne();
    res.json({ message: 'Médicament supprimé.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

module.exports = router;