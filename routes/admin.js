const express = require('express');
const router = express.Router();
const { db } = require('../app');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get pending users
router.get('/users/pending', auth, admin, (req, res, next) => {
  db.all(
    'SELECT * FROM users WHERE approved = 0',
    (err, users) => {
      if (err) return next(err);
      res.json(users);
    }
  );
});

// Approve user
router.post('/users/:id/approve', auth, admin, (req, res, next) => {
  db.run(
    'UPDATE users SET approved = 1 WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) return next(err);
      res.json({ message: 'User approved' });
    }
  );
});

// Reject user
router.post('/users/:id/reject', auth, admin, (req, res, next) => {
  db.run(
    'DELETE FROM users WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) return next(err);
      res.json({ message: 'User rejected' });
    }
  );
});

module.exports = router;