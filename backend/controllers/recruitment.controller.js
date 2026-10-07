const nodemailer = require('nodemailer');
const Candidate = require('../models/Candidate');
const Application = require('../models/Application');

const sendInterviewEmail = async (req, res) => {
  const { candidateId, date, time, notes } = req.body;

  try {
    if (!candidateId || !date || !time) {
      return res.status(400).json({ message: 'Candidate ID, date, and time are required' });
    }

    const candidate = await Candidate.findByPk(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Update candidate status to interview
    candidate.status = 'interview';
    await candidate.save();

    // Find and update or create Application
    let application = await Application.findOne({ where: { candidateId } });
    if (!application) {
      application = await Application.create({
        candidateId,
        jobTitle: 'General Position',
        status: 'interview',
        interviewDate: date,
        interviewTime: time,
        notes
      });
    } else {
      application.status = 'interview';
      application.interviewDate = date;
      application.interviewTime = time;
      if (notes) {
        application.notes = notes;
      }
      await application.save();
    }

    // Nodemailer configuration
    let transporter;
    let isTestAccount = false;

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Use user-provided SMTP configuration
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      // Create Ethereal test account dynamically for demonstration
      console.log('Generating Ethereal SMTP test account...');
      const testAccount = await nodemailer.createTestAccount();
      isTestAccount = true;
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    const mailOptions = {
      from: `"HReasy Recruitment" <${process.env.SMTP_USER || 'no-reply@hreasy.com'}>`,
      to: candidate.email,
      subject: `Interview Invitation - HReasy`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Interview Invitation</h2>
          <p>Dear <strong>${candidate.name}</strong>,</p>
          <p>We are pleased to invite you for an interview regarding your application on HReasy.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; padding-bottom: 5px;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 0;"><strong>Time:</strong> ${time}</p>
          </div>
          ${notes ? `<p><strong>Additional Notes:</strong> ${notes}</p>` : ''}
          <p>Please confirm your availability by replying to this email.</p>
          <p>Best regards,<br>The Recruitment Team<br>HReasy</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    let testEmailUrl = '';
    
    if (isTestAccount) {
      testEmailUrl = nodemailer.getTestMessageUrl(info);
      console.log('Test email sent! View it at:', testEmailUrl);
    }

    return res.json({
      message: 'Interview scheduled and invitation email sent successfully!',
      candidate,
      application,
      testEmailUrl,
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Email sending/scheduling error:', error);
    return res.status(500).json({ message: 'Server error scheduling interview' });
  }
};

module.exports = { sendInterviewEmail };
