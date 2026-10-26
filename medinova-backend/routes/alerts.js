const express = require('express');
const Alert = require('../models/Alert');
const Measurement = require('../models/Measurement');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

router.put('/:id/read', protect, async (req, res) => {
  try {
    const alert = await Alert.findOne({ _id: req.params.id, user: req.user._id });
    if (!alert) return res.status(404).json({ message: 'Alerte introuvable.' });
    
    alert.read = true;
    await alert.save();
    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

router.post('/check', protect, async (req, res) => {
  try {
    const { type, value } = req.body;
    
   
    const thresholds = {
      heart_rate: { warning: 100, danger: 120, unit: 'bpm', label: 'rythme cardiaque' },
      blood_pressure: { warning: 130, danger: 140, unit: 'mmHg', label: 'tension artérielle' },
      weight: { warning: 150, danger: 180, unit: 'kg', label: 'poids' },
      blood_sugar: { warning: 1.1, danger: 1.5, unit: 'g/L', label: 'glycémie' },
    };

    const t = thresholds[type];
    if (!t) return res.json({ alert: null });

    let alertData = null;
    if (value >= t.danger) {
      alertData = {
        title: '⚠️ Alerte critique',
        message: `Votre ${t.label} est critique (${value} ${t.unit}). Consultez immédiatement un professionnel de santé.`,
        level: 'danger',
      };
    } else if (value > t.warning) {
      alertData = {
        title: 'Valeur élevée',
        message: `Votre ${t.label} dépasse le seuil recommandé (${value} ${t.unit}). Surveillez votre état.`,
        level: 'warning',
      };
    }

    if (alertData) {
      const alert = await Alert.create({ user: req.user._id, ...alertData });
      return res.json({ alert });
    }

    res.json({ alert: null });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

module.exports = router;