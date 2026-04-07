const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth } = require('./cases');
const { query } = require('../db');

const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `evidence-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 },
});

// Get all evidence for user
router.get('/', auth, async (req, res) => {
  try {
    const { case_id } = req.query;
    let sql = 'SELECT * FROM evidence WHERE user_id = $1';
    const params = [req.userId];

    if (case_id) {
      params.push(case_id);
      sql += ` AND case_id = $${params.length}`;
    }

    sql += ' ORDER BY created_at DESC';
    const result = await query(sql, params);
    res.json({ evidence: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch evidence' });
  }
});

// Add evidence
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { case_id, title, description, evidence_type, date_collected, chain_of_custody } = req.body;
    const file_path = req.file ? req.file.path : null;

    const result = await query(
      `INSERT INTO evidence (user_id, case_id, title, description, evidence_type, file_path, date_collected, chain_of_custody)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [req.userId, case_id || null, title, description, evidence_type || 'document', file_path, date_collected || null, chain_of_custody || null]
    );

    res.status(201).json({ evidence: result.rows[0] });
  } catch (err) {
    console.error('Add evidence error:', err);
    res.status(500).json({ error: 'Failed to add evidence' });
  }
});

// Delete evidence
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await query(
      'SELECT file_path FROM evidence WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Evidence not found' });
    }

    const ev = result.rows[0];
    if (ev.file_path && fs.existsSync(ev.file_path)) {
      fs.unlinkSync(ev.file_path);
    }

    await query('DELETE FROM evidence WHERE id = $1', [req.params.id]);
    res.json({ message: 'Evidence deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete evidence' });
  }
});

module.exports = router;
