const express = require('express');
const router = express.Router();
const User = require('../models/user.js'); 

// Get pantry items
router.get('/users/:userId/foods', async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) return res.redirect('/');

    res.locals.pantryItems = user.pantry;
    res.render('foods/index', { user });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Add new food item form
router.get('/users/:userId/foods/new', (req, res) => {
  const userId = req.params.userId;
  res.render('foods/new', { userId });
});

// Create a new food item
router.post('/users/:userId/foods', async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) return res.redirect('/');

    user.pantry.push(req.body);
    await user.save();
    res.redirect(`/users/${userId}/foods`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Delete a food item
router.post('/users/:userId/foods/:itemId/delete', async (req, res) => {
  const userId = req.params.userId;
  const itemId = req.params.itemId;
  try {
    const user = await User.findById(userId);
    if (!user) return res.redirect('/');

    user.pantry = user.pantry.filter(item => item._id.toString() !== itemId);
    await user.save();
    res.redirect(`/users/${userId}/foods`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

module.exports = router;

