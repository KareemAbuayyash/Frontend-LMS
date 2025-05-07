const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // Here you would typically:
    // 1. Check if user exists in your database
    // 2. Create user if they don't exist
    // 3. Return user data
    return cb(null, profile);
  }
));

// Passport Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/api/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // Similar to Google strategy
    return cb(null, profile);
  }
));

// Routes
app.post('/api/auth/signin', (req, res) => {
  const { email, password } = req.body;
  
  // Here you would typically:
  // 1. Validate input
  // 2. Check credentials against database
  // 3. Generate JWT if valid
  
  // For demo purposes, we'll accept any email/password
  if (email && password) {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(400).json({ message: 'Email and password are required' });
  }
});

// Google Auth Routes
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/signin' }),
  function(req, res) {
    // Generate JWT and redirect to frontend with token
    const token = jwt.sign({ id: req.user.id }, JWT_SECRET, { expiresIn: '24h' });
    res.redirect(`http://localhost:3000/signin?token=${token}`);
  }
);

// Facebook Auth Routes
app.get('/api/auth/facebook',
  passport.authenticate('facebook')
);

app.get('/api/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/signin' }),
  function(req, res) {
    // Generate JWT and redirect to frontend with token
    const token = jwt.sign({ id: req.user.id }, JWT_SECRET, { expiresIn: '24h' });
    res.redirect(`http://localhost:3000/signin?token=${token}`);
  }
);

// Protected route example
app.get('/api/protected',
  authenticateToken,
  (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
  }
);

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 