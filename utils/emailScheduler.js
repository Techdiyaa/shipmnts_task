const cron = require('node-cron');
const nodemailer = require('nodemailer');
const moment = require('moment');
const EmailSchedule = require('../models/emailSchedule');
require('dotenv').config();


const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (email) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email.recipient,
      subject: email.subject,
      text: email.body,
      attachments: email.attachments || []
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
};

const scheduleEmail = (email) => {
    const date = moment(email.scheduleTime).toDate();
    const cronTime = `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;
  
    console.log(`Scheduling email with cron pattern: ${cronTime}`);
  
    cron.schedule(cronTime, () => {
      console.log(`Executing scheduled task at: ${new Date()}`);
      sendEmail(email);
    }, {
      scheduled: true,
      timezone: "UTC"
    });
  
    console.log('Email scheduled for:', email.scheduleTime);
  };
  

const scheduleRecurringEmails = async (email) => {
    let cronPattern;
    const { frequency, time, dayOfWeek, dayOfMonth } = email.recurring;
  
    switch (frequency) {
      case 'hourly':
        cronPattern = `0 ${time.split(':')[1]} ${time.split(':')[0]} * * *`;
        break;
      case 'daily':
        cronPattern = `0 ${time.split(':')[1]} ${time.split(':')[0]} * * *`;
        break;
      case 'weekly':
        if (typeof dayOfWeek !== 'number' || dayOfWeek < 0 || dayOfWeek > 6) {
          throw new Error('Invalid dayOfWeek');
        }
        cronPattern = `0 ${time.split(':')[1]} ${time.split(':')[0]} * * ${dayOfWeek}`;
        break;
      case 'monthly':
        if (typeof dayOfMonth !== 'number' || dayOfMonth < 1 || dayOfMonth > 31) {
          throw new Error('Invalid dayOfMonth');
        }
        cronPattern = `0 ${time.split(':')[1]} ${time.split(':')[0]} ${dayOfMonth} * *`;
        break;
      default:
        throw new Error('Invalid frequency');
    }
  
    if (typeof cronPattern !== 'string') {
      throw new Error('Cron pattern must be a string!');
    }
  
    cron.schedule(cronPattern, () => {
      sendEmail(email);
    }, {
      scheduled: true,
      timezone: "UTC"
    });
  
    console.log('Recurring email scheduled with pattern:', cronPattern);
  };
  

module.exports = {
  sendEmail,
  scheduleEmail,
  scheduleRecurringEmails
};
