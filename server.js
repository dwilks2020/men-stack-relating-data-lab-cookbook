// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const User = require('./models/user.js'); 

// Import middleware
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

// Import controllers
const authController = require('./controllers/auth.js');
const foodsController = require('./controllers/foods.js');
const usersController = require('./controllers/users.js');

// Initialize the app
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI); 
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB: ${mongoose.connection.name}.`);
});

// Middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Set view engine
app.set('view engine', 'ejs');

// Use session-related middleware
app.use(passUserToView);

// Define routes
app.get('/', (req, res) => {
  res.render('index.ejs', { user: req.session.user });
});

// Protected routes requiring authentication
app.get('/users', isSignedIn, usersController.index);
app.get('/users/:userId/pantry', isSignedIn, usersController.showPantry);
app.get('/vip-lounge', isSignedIn, (req, res) => {
  res.send(`Welcome to the party, ${req.session.user.username}.`);
});

// Authentication routes
app.use('/auth', authController);
app.use('/users/:userId/foods', foodsController);

// Sign-out
app.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Start the server
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
