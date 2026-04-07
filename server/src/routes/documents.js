const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth } = require('./cases');
const { query } = require('../db');

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 },
});

// Get all documents for user
router.get('/', auth, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM documents WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json({ documents: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Upload a document
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, document_type, case_id } = req.body;
    const file_path = req.file ? req.file.path : null;

    const result = await query(
      `INSERT INTO documents (user_id, case_id, title, document_type, file_path, encrypted)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING *`,
      [req.userId, case_id || null, title, document_type || 'other', file_path]
    );

    res.status(201).json({ document: result.rows[0] });
  } catch (err) {
    console.error('Upload document error:', err);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// Delete document
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await query(
      'SELECT file_path FROM documents WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const doc = result.rows[0];
    if (doc.file_path && fs.existsSync(doc.file_path)) {
      fs.unlinkSync(doc.file_path);
    }

    await query('DELETE FROM documents WHERE id = $1', [req.params.id]);
    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

module.exports = router;
