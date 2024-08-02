const Email = require('../models/email');
const { scheduleEmail, initializeSchedulers } = require('../utils/emailScheduler');

// Initialize schedulers on startup
initializeSchedulers();

const scheduleNewEmail = async (req, res) => {
  try {
    const { recipient, subject, body, attachments, scheduleTime, recurring } = req.body;
    const email = new Email({ recipient, subject, body, attachments, scheduleTime, recurring });
    await email.save();
    if (recurring) {
      scheduleRecurringEmails(email);
    } else {
      scheduleEmail(email);
    }
    res.status(201).json(email);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllScheduledEmails = async (req, res) => {
  try {
    const emails = await Email.find();
    res.status(200).json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getScheduledEmailById = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }
    res.status(200).json(email);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteScheduledEmail = async (req, res) => {
  try {
    const email = await Email.findByIdAndDelete(req.params.id);
    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }
    res.status(200).json({ message: 'Email cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  scheduleNewEmail,
  getAllScheduledEmails,
  getScheduledEmailById,
  deleteScheduledEmail,
};
