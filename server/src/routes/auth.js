const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint - coming soon' });
});

router.post('/register', (req, res) => {
  res.json({ message: 'Registration endpoint - coming soon' });
});

module.exports = router;
