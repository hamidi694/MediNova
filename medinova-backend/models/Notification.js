const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['alert', 'appointment', 'medication', 'info'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  level: { type: String, enum: ['info', 'warning', 'danger'], default: 'info' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);