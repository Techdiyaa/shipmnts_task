const mongoose = require('mongoose');

const emailScheduleSchema = new mongoose.Schema({
  recipient: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  scheduleTime: { type: Date, required: true },
  attachments: [String],
  recurring: {
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'quarterly','hourly'] },
    time: { type: String },
    dayOfWeek: { type: String },
    dayOfMonth: { type: Number },
    dayOfQuarter: { type: Number }
  }
});

module.exports = mongoose.model('EmailSchedule', emailScheduleSchema);
