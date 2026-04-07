const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { query } = require('../db');

// Middleware: authenticate JWT
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { auth };

// Get all cases for user
router.get('/', auth, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM cases WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json({ cases: result.rows });
  } catch (err) {
    console.error('Get cases error:', err);
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
});

// Create a new case
router.post('/', auth, async (req, res) => {
  try {
    const { case_number, court_name, case_type, charge_description, next_court_date } = req.body;

    const result = await query(
      `INSERT INTO cases (user_id, case_number, court_name, case_type, charge_description, next_court_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'active')
       RETURNING *`,
      [req.userId, case_number, court_name, case_type, charge_description, next_court_date || null]
    );

    res.status(201).json({ case: result.rows[0] });
  } catch (err) {
    console.error('Create case error:', err);
    res.status(500).json({ error: 'Failed to create case' });
  }
});

// Get single case
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM cases WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json({ case: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch case' });
  }
});

// Update case
router.patch('/:id', auth, async (req, res) => {
  try {
    const { case_number, court_name, case_type, charge_description, status, next_court_date } = req.body;

    const result = await query(
      `UPDATE cases SET
        case_number = COALESCE($1, case_number),
        court_name = COALESCE($2, court_name),
        case_type = COALESCE($3, case_type),
        charge_description = COALESCE($4, charge_description),
        status = COALESCE($5, status),
        next_court_date = COALESCE($6, next_court_date),
        updated_at = NOW()
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [case_number, court_name, case_type, charge_description, status, next_court_date, req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json({ case: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update case' });
  }
});

// Delete case
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM cases WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json({ message: 'Case deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete case' });
  }
});

const exports_obj = router;
exports_obj.auth = auth;
module.exports = exports_obj;
