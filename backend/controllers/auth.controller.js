const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Candidate = require('../models/Candidate');
const Application = require('../models/Application');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'HReasySecretTokenForJWTTokenGenerationKey123!', {
    expiresIn: '30d'
  });
};

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRole = role === 'candidate' ? 'candidate' : 'hr';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole
    });

    // Automatically create a candidate profile if registered as candidate
    if (userRole === 'candidate') {
      const candidate = await Candidate.create({
        name: user.name,
        email: user.email,
        source: 'Email',
        status: 'received',
        userId: user.id
      });

      await Application.create({
        candidateId: candidate.id,
        jobTitle: 'General Position',
        status: 'applied'
      });
    }

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

const getMe = async (req, res) => {
  try {
    return res.json(req.user);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

module.exports = { register, login, getMe };
