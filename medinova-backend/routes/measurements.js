const express = require('express');
const Measurement = require('../models/Measurement');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const measures = await Measurement.find({ user: req.user._id }).sort({ date: -1 });
    res.json(measures);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { type, value, unit } = req.body;
    if (!type || value === undefined || !unit) {
      return res.status(400).json({ message: 'Type, valeur et unité requis.' });
    }

    const measure = await Measurement.create({
      user: req.user._id,
      type,
      value,
      unit,
    });

    res.status(201).json(measure);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const measure = await Measurement.findById(req.params.id);
    if (!measure) return res.status(404).json({ message: 'Mesure introuvable.' });
    if (measure.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    await measure.deleteOne();
    res.json({ message: 'Mesure supprimée.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

module.exports = router;