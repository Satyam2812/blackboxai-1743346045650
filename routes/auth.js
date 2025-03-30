const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { db } = require('../app');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT INTO users (email, password, approved) VALUES (?, ?, ?)',
      [email, hashedPassword, false],
      function(err) {
        if (err) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(201).json({ 
          message: 'Signup successful! Waiting for admin approval' 
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get(
    'SELECT * FROM users WHERE email = ?', 
    [email],
    async (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      if (!user.approved) {
        return res.status(403).json({ 
          error: 'Account pending admin approval' 
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      req.session.userId = user.id;
      req.session.role = user.role;
      res.json({ 
        message: 'Login successful',
        role: user.role
      });
    }
  );
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;