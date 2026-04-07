const express = require('express');
const router = express.Router();
const { auth } = require('./cases');
const { query } = require('../db');

// Get court dates for user
router.get('/', auth, async (req, res) => {
  try {
    const { case_id } = req.query;
    let sql = 'SELECT cd.*, c.case_number FROM court_dates cd LEFT JOIN cases c ON cd.case_id = c.id WHERE cd.user_id = $1';
    const params = [req.userId];

    if (case_id) {
      params.push(case_id);
      sql += ` AND cd.case_id = $${params.length}`;
    }

    sql += ' ORDER BY cd.date_time ASC';
    const result = await query(sql, params);
    res.json({ courtDates: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch court dates' });
  }
});

// Create court date
router.post('/', auth, async (req, res) => {
  try {
    const { case_id, date_time, court_location, hearing_type, notes } = req.body;

    const result = await query(
      `INSERT INTO court_dates (user_id, case_id, date_time, court_location, hearing_type, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.userId, case_id || null, date_time, court_location, hearing_type, notes || null]
    );

    res.status(201).json({ courtDate: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create court date' });
  }
});

// Delete court date
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM court_dates WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Court date not found' });
    }

    res.json({ message: 'Court date deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete court date' });
  }
});

module.exports = router;
