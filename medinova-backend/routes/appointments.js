const express = require('express');
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id }).sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { doctor, specialty, date, location, mode } = req.body;
    if (!doctor || !specialty || !date) {
      return res.status(400).json({ message: 'Champs requis manquants.' });
    }
    const appointment = await Appointment.create({
      user: req.user._id,
      doctor,
      specialty,
      date,
      location,
      mode,
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'RDV introuvable.' });
    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }
    await appointment.deleteOne();
    res.json({ message: 'Rendez-vous supprimé.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

module.exports = router;