const express = require('express');
const router = express.Router();
const EmailSchedule = require('../models/emailSchedule');
const { scheduleEmail, scheduleRecurringEmails, cancelEmail } = require('../utils/emailScheduler');

// Schedule an email
router.post('/schedule-email', async (req, res) => {
  try {
    const email = req.body;
    if (email.recurring) {
      await scheduleRecurringEmails(email);
    } else {
      await scheduleEmail(email);
    }
    const newEmail = new EmailSchedule(email);
    await newEmail.save();
    res.status(201).json({ message: 'Email scheduled successfully', email: newEmail });
  } catch (error) {
    res.status(500).json({ message: 'Failed to schedule email', error: error.message });
  }
});

// Retrieve all scheduled emails
router.get('/scheduled-emails', async (req, res) => {
  try {
    const emails = await EmailSchedule.find();
    res.status(200).json(emails);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve emails', error: error.message });
  }
});

// Retrieve a specific scheduled email by ID
router.get('/scheduled-emails/:id', async (req, res) => {
  try {
    const email = await EmailSchedule.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }
    res.status(200).json(email);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve email', error: error.message });
  }
});

// Cancel a scheduled email by ID
router.delete('/scheduled-emails/:id', async (req, res) => {
  try {
    const email = await EmailSchedule.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }
    await EmailSchedule.findByIdAndDelete(req.params.id);
    await cancelEmail(req.params.id); // Ensure this is a function in your emailScheduler.js
    res.status(200).json({ message: 'Email cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel email', error: error.message });
  }
});

module.exports = router;
