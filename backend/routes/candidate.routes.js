const express = require('express');
const router = express.Router();
const { createCandidate, getCandidates, updateCandidateStatus, uploadCV, getCandidateProfile, updateCandidateProfile } = require('../controllers/candidate.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.post('/', protect, createCandidate);
router.get('/', protect, getCandidates);
router.get('/profile/me', protect, getCandidateProfile);
router.patch('/profile/me', protect, updateCandidateProfile);
router.patch('/:id/status', protect, updateCandidateStatus);
router.post('/upload', protect, upload.single('cv'), uploadCV);

module.exports = router;
