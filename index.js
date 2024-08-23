const express = require('express');
const dotenv = require('dotenv');
const path = require('path'); // Import the path module
const cors = require('cors'); // Import cors for handling Cross-Origin Resource Sharing
const rateLimit = require('express-rate-limit'); // Import express-rate-limit for rate limiting
const timeout = require('connect-timeout'); // Import connect-timeout for setting request timeout
const getSongId = require('./getSongId'); // Import the getSongId function

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3010;
const REFERER = process.env.REFERER || `http://localhost:${port}`;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || REFERER;

// Serve static files from the /static directory
app.use(express.static(path.join(__dirname, 'static')));

// Middleware to check the Referer header
const refererCheck = (req, res, next) => {
  const referer = req.get('Referer');
  if (referer && referer.startsWith(REFERER)) {
    next();
  } else {
    res.status(404).sendFile(path.join(__dirname, '404', '404.html'));
  }
};

// Endpoint to return Spotify tokens, protected by the refererCheck middleware
app.get('/tokens', refererCheck, (req, res) => {
  const tokens = {
    clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
    refreshToken: process.env.REACT_APP_SPOTIFY_REFRESH_TOKEN,
  };
  res.json(tokens);
});

// Rate limiting middleware for the /songid endpoint
const songIdLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 240, // limit each IP to 240 requests per windowMs
  message: 'Too many requests from this IP, please try again after 2 minutes'
});

// Timeout middleware for the /songid endpoint
const songIdTimeout = timeout('10s'); // 10 seconds timeout

// Apply CORS, rate limiting, and timeout to the /songid endpoint only
app.get('/songid', cors({ origin: ALLOWED_ORIGIN }), songIdLimiter, songIdTimeout, getSongId);

// Handle all other requests and return 404.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '404', '404.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});