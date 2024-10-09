const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.js');

// Sign-up form
router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs');
});

// Sign-in form
router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs');
});

// Sign-out
router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Handle sign-up
router.post('/sign-up', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) return res.send('Username already taken.');

    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Passwords must match.');
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    await User.create(req.body);
    res.redirect('/auth/sign-in');
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// Handle sign-in
router.post('/sign-in', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) return res.send('Login failed. Please try again.');

    const validPassword = await bcrypt.compare(req.body.password, userInDatabase.password);
    if (!validPassword) return res.send('Login failed. Please try again.');

    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    };

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

module.exports = router;
