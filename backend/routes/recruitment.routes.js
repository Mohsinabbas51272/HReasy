const express = require('express');
const router = express.Router();
const { sendInterviewEmail } = require('../controllers/recruitment.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/send-email', protect, sendInterviewEmail);

module.exports = router;
