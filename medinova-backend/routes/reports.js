const express = require('express');
const Measurement = require('../models/Measurement');
const Analysis = require('../models/Analysis');
const Medication = require('../models/Medication');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const { start, end } = req.query; 
    const startDate = start ? new Date(start) : new Date(Date.now() - 30 * 86400000);
    const endDate = end ? new Date(end) : new Date();

    const measurements = await Measurement.find({
      user: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    const analyses = await Analysis.find({
      user: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    const medications = await Medication.find({ user: req.user._id });

  
    const stats = {};
    measurements.forEach(m => {
      if (!stats[m.type]) stats[m.type] = { values: [], unit: m.unit };
      stats[m.type].values.push(m.value);
    });

    const formattedStats = {};
    Object.keys(stats).forEach(type => {
      const vals = stats[type].values;
      formattedStats[type] = {
        unit: stats[type].unit,
        count: vals.length,
        min: Math.min(...vals),
        max: Math.max(...vals),
        avg: vals.reduce((a, b) => a + b, 0) / vals.length,
      };
    });

    res.json({
      period: { start: startDate, end: endDate },
      measurements,
      analyses,
      medications,
      stats: formattedStats,
      totalMeasures: measurements.length,
      totalAnalyses: analyses.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

module.exports = router;