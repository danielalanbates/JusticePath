const express = require('express');
const router = express.Router();
const { auth } = require('./cases');
const { query } = require('../db');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, phone, email, first_name, last_name, date_of_birth, created_at, last_login FROM users WHERE id = $1',
      [req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  try {
    const { first_name, last_name, date_of_birth } = req.body;
    const result = await query(
      `UPDATE users SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        date_of_birth = COALESCE($3, date_of_birth),
        updated_at = NOW()
       WHERE id = $4
       RETURNING id, phone, email, first_name, last_name, date_of_birth, created_at, last_login`,
      [first_name, last_name, date_of_birth, req.userId]
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
