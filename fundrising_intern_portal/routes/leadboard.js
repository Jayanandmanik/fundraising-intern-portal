const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', async (req, res) => {
  const users = await User.find().sort({ totalFunds: -1 }).select('name totalFunds');
  res.send(users);
});

module.exports = router;
