// controllers/users.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');



const index = async (req, res) => {
    try {
        const users = await User.find();
        res.render('users/index', { users });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
};

// Show user pantry
const showPantry = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('pantry');

        if (!user) {
            return res.redirect('/');
        }

        res.locals.pantryItems = user.pantry;
        res.render('users/show', { user });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};

module.exports = { index, showPantry }; 