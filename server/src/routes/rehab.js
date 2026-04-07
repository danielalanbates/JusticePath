const express = require('express');
const router = express.Router();
const { auth } = require('./cases');
const { query } = require('../db');

// Get all rehab plans for user
router.get('/plans', auth, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM rehab_plans WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json({ plans: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rehab plans' });
  }
});

// Create rehab plan
router.post('/plans', auth, async (req, res) => {
  try {
    const { goal_type, goal_description, target_completion } = req.body;

    const result = await query(
      `INSERT INTO rehab_plans (user_id, goal_type, goal_description, target_completion, status)
       VALUES ($1, $2, $3, $4, 'in_progress')
       RETURNING *`,
      [req.userId, goal_type, goal_description, target_completion || null]
    );

    res.status(201).json({ plan: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create rehab plan' });
  }
});

// Get progress entries for a plan
router.get('/plans/:id/progress', auth, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM progress_entries WHERE rehab_plan_id = $1 ORDER BY entry_date DESC',
      [req.params.id]
    );
    res.json({ progress: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Add progress entry
router.post('/plans/:id/progress', auth, async (req, res) => {
  try {
    const { entry_type, description, hours_completed, entry_date } = req.body;

    const result = await query(
      `INSERT INTO progress_entries (rehab_plan_id, user_id, entry_type, description, hours_completed, entry_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.params.id, req.userId, entry_type, description, hours_completed || 0, entry_date || new Date()]
    );

    res.status(201).json({ progress: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add progress entry' });
  }
});

// Update rehab plan status
router.patch('/plans/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const result = await query(
      `UPDATE rehab_plans SET status = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *`,
      [status, req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({ plan: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

module.exports = router;
