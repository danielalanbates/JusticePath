const express = require('express');
const router = express.Router();
const { auth } = require('./cases');
const { query } = require('../db');

// Get all resources (public)
router.get('/', async (req, res) => {
  try {
    const { category, service_area } = req.query;
    let sql = 'SELECT * FROM resources WHERE 1=1';
    const params = [];

    if (category) {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }
    if (service_area) {
      params.push(`%${service_area}%`);
      sql += ` AND service_area ILIKE $${params.length}`;
    }

    sql += ' ORDER BY title ASC';
    const result = await query(sql, params);
    res.json({ resources: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Get single resource
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM resources WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json({ resource: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
});

module.exports = router;
