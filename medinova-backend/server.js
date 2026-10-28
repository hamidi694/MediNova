require('node:dns').setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const measurementRoutes = require('./routes/measurements');
const appointmentRoutes = require('./routes/appointments');
const alertRoutes = require('./routes/alerts');
const medicationRoutes = require('./routes/medications');
const medicalRecordRoutes = require('./routes/medicalRecords');
const analysisRoutes = require('./routes/analyses');
const emergencyRoutes = require('./routes/emergency');
const reportRoutes = require('./routes/reports');
const notificationRoutes = require('./routes/notifications');
const app = express();


app.use(cors());
app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/measurements', measurementRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/analyses', analysisRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.json({ message: ' API MediNova en ligne.' });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connecté');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Serveur sur http://localhost:${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error('Erreur MongoDB :', err));