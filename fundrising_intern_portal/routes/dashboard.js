const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const multer = require('multer');
const Submission = require('../models/submission');
const User = require('../models/user');

const upload = multer({ dest: 'uploads/' });

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) return res.sendStatus(403);
    req.userId = data.userId;
    next();
  });
}

// Get dashboard data
router.get('/', verifyToken, async (req, res) => {
  const user = await User.findById(req.userId);
  const submissions = await Submission.find({ userId: req.userId });
  res.send({ name: user.name, totalFunds: user.totalFunds, submissions });
});

// Submit proof
router.post('/submit', verifyToken, upload.single('proof'), async (req, res) => {
  const { amount } = req.body;
  const proofUrl = `/uploads/${req.file.filename}`;
  await Submission.create({ userId: req.userId, amount, proofUrl });

  const user = await User.findById(req.userId);
  user.totalFunds += parseInt(amount);
  await user.save();

  res.send({ message: 'Submission successful' });
});

module.exports = router;
