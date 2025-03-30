const express = require('express');
const router = express.Router();
const { db, upload } = require('../app');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Upload track
router.post('/', auth, upload.single('trackFile'), (req, res) => {
  const { title } = req.body;
  const userId = req.user.id;
  const filePath = req.file.path;

  db.run(
    'INSERT INTO tracks (user_id, title, file_path) VALUES (?, ?, ?)',
    [userId, title, filePath],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to upload track' });
      }
      res.redirect('/dashboard');
    }
  );
});

// Get user tracks
router.get('/', auth, (req, res, next) => {
  db.all(
    'SELECT * FROM tracks WHERE user_id = ? ORDER BY createdAt DESC',
    [req.user.id],
    (err, tracks) => {
      if (err) {
        return next(err);
      }
      res.json(tracks);
    }
  );
});

// Admin track management routes
router.get('/pending', auth, admin, (req, res, next) => {
  db.all(
    'SELECT t.*, u.email FROM tracks t JOIN users u ON t.user_id = u.id WHERE t.status = "pending"',
    (err, tracks) => {
      if (err) return next(err);
      res.json(tracks);
    }
  );
});

router.post('/:id/approve', auth, admin, (req, res, next) => {
  db.run(
    'UPDATE tracks SET status = "approved" WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) return next(err);
      res.json({ message: 'Track approved' });
    }
  );
});

router.post('/:id/reject', auth, admin, (req, res, next) => {
  db.run(
    'UPDATE tracks SET status = "rejected" WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) return next(err);
      res.json({ message: 'Track rejected' });
    }
  );
});

module.exports = router;