const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const { db } = require('../app');

// Home route
router.get('/', (req, res) => {
  res.render('home', { 
    title: 'Music Distribution Platform',
    user: req.session.userId ? { 
      email: req.session.email, 
      role: req.session.role 
    } : null
  });
});

// Login page
router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login' });
});

// Signup page
router.get('/signup', (req, res) => {
  res.render('auth/signup', { title: 'Sign Up' });
});

// Mount auth routes
router.use('/auth', authRoutes);

module.exports = router;