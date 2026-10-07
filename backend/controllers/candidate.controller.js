const Candidate = require('../models/Candidate');
const Application = require('../models/Application');
const { Op } = require('sequelize');

const createCandidate = async (req, res) => {
  const { name, email, phone, source, cvUrl, jobTitle } = req.body;

  try {
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const candidate = await Candidate.create({
      name,
      email,
      phone,
      source: source || 'Email',
      cvUrl,
      status: 'received'
    });

    // Create an initial application linked to this candidate
    await Application.create({
      candidateId: candidate.id,
      jobTitle: jobTitle || 'General Position',
      status: 'applied'
    });

    return res.status(201).json(candidate);
  } catch (error) {
    console.error('Candidate creation error:', error);
    return res.status(500).json({ message: 'Server error creating candidate' });
  }
};

const getCandidates = async (req, res) => {
  const { status, search } = req.query;

  try {
    const whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const candidates = await Candidate.findAll({
      where: whereClause,
      include: [{ model: Application }],
      order: [['createdAt', 'DESC']]
    });

    return res.json(candidates);
  } catch (error) {
    console.error('Fetch candidates error:', error);
    return res.status(500).json({ message: 'Server error retrieving candidates' });
  }
};

const updateCandidateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const validStatuses = ['received', 'screening', 'shortlisted', 'rejected', 'interview'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const candidate = await Candidate.findByPk(id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    candidate.status = status;
    await candidate.save();

    // Also update associated application status if present
    const application = await Application.findOne({ where: { candidateId: id } });
    if (application) {
      application.status = status;
      await application.save();
    }

    return res.json(candidate);
  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({ message: 'Server error updating candidate status' });
  }
};

const uploadCV = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Return the relative url to the file
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.status(200).json({ 
      message: 'CV uploaded successfully', 
      cvUrl: fileUrl 
    });
  } catch (error) {
    console.error('Upload CV error:', error);
    return res.status(500).json({ message: 'Server error during upload' });
  }
};

const getCandidateProfile = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      where: { userId: req.user.id },
      include: [{ model: Application }]
    });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate profile not found' });
    }

    return res.json(candidate);
  } catch (error) {
    console.error('Fetch candidate profile error:', error);
    return res.status(500).json({ message: 'Server error retrieving candidate profile' });
  }
};

const updateCandidateProfile = async (req, res) => {
  const { phone, cvUrl } = req.body;
  try {
    const candidate = await Candidate.findOne({ where: { userId: req.user.id } });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate profile not found' });
    }
    if (phone !== undefined) candidate.phone = phone;
    if (cvUrl !== undefined) candidate.cvUrl = cvUrl;
    await candidate.save();
    return res.json(candidate);
  } catch (error) {
    console.error('Update candidate profile error:', error);
    return res.status(500).json({ message: 'Server error updating candidate profile' });
  }
};

module.exports = { createCandidate, getCandidates, updateCandidateStatus, uploadCV, getCandidateProfile, updateCandidateProfile };
