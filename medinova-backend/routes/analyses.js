const express = require('express');
const Analysis = require('../models/Analysis');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const analyses = await Analysis.find({ user: req.user._id }).sort({ date: -1 });
    res.json(analyses);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { name, value, unit, reference, date, notes } = req.body;
    if (!name || value === undefined || !unit || !date) {
      return res.status(400).json({ message: 'Champs requis manquants.' });
    }
    const analysis = await Analysis.create({
      user: req.user._id, name, value, unit, reference, date, notes,
    });
    res.status(201).json(analysis);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, user: req.user._id });
    if (!analysis) return res.status(404).json({ message: 'Analyse introuvable.' });
    await analysis.deleteOne();
    res.json({ message: 'Analyse supprimée.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

module.exports = router;