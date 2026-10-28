const express = require('express');
const Notification = require('../models/Notification');
const Appointment = require('../models/Appointment');
const Medication = require('../models/Medication');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

router.put('/:id/read', protect, async (req, res) => {
  try {
    const notif = await Notification.findOne({ _id: req.params.id, user: req.user._id });
    if (!notif) return res.status(404).json({ message: 'Notification introuvable.' });
    notif.read = true;
    await notif.save();
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

router.put('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ message: 'Toutes les notifications sont lues.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { type, title, message, level } = req.body;
    const notif = await Notification.create({
      user: req.user._id,
      type,
      title,
      message,
      level: level || 'info',
    });
    res.status(201).json(notif);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});


router.delete('/:id', protect, async (req, res) => {
  try {
    const notif = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!notif) return res.status(404).json({ message: 'Notification introuvable.' });
    res.json({ success: true, message: 'Notification supprimée.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});


router.post('/check-reminders', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

   
    const appointments = await Appointment.find({ user: userId });
    for (const appt of appointments) {
      const apptDateStr = new Date(appt.date).toISOString().split('T')[0];
      if (apptDateStr === tomorrowStr) {
        const exists = await Notification.findOne({ 
          user: userId, 
          type: 'appointment', 
          message: { $regex: appt.doctor, $options: 'i' } 
        });
        if (!exists) {
          await Notification.create({
            user: userId,
            type: 'appointment',
            title: 'Rendez-vous demain',
            message: `Rappel : Rendez-vous avec ${appt.doctor} (${appt.specialty}) demain.`,
            level: 'warning',
          });
        }
      }
    }

    
    const medications = await Medication.find({ user: userId });
    const today = new Date();
    for (const med of medications) {
      if (today >= new Date(med.startDate) && today <= new Date(med.endDate)) {
        const exists = await Notification.findOne({ 
          user: userId, 
          type: 'medication', 
          message: { $regex: med.name, $options: 'i' } 
        });
        if (!exists) {
          await Notification.create({
            user: userId,
            type: 'medication',
            title: 'Rappel de médicament',
            message: `N'oubliez pas de prendre ${med.name} (${med.dosage}).`,
            level: 'info',
          });
        }
      }
    }

    res.json({ success: true, message: 'Vérification terminée.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

router.post('/test', protect, async (req, res) => {
  try {
    await Notification.create([
      {
        user: req.user._id,
        type: 'appointment',
        title: 'Rappel de rendez-vous',
        message: 'Vous avez un rendez-vous avec Dr. Sarah Lee demain à 16:30.',
        level: 'info',
        read: false,
      },
      {
        user: req.user._id,
        type: 'medication',
        title: 'Prise de médicament',
        message: "N'oubliez pas de prendre votre Paracétamol (500mg).",
        level: 'warning',
        read: false,
      },
      {
        user: req.user._id,
        type: 'alert',
        title: 'Tension élevée',
        message: 'Votre tension a été mesurée à 150 mmHg.',
        level: 'danger',
        read: false,
      },
    ]);
    res.json({ message: '3 notifications de test créées.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur.', error: err.message });
  }
});

module.exports = router;