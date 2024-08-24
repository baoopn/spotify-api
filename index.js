const express = require('express');
const dotenv = require('dotenv');
const path = require('path'); // Import the path module
const cors = require('cors'); // Import cors for handling Cross-Origin Resource Sharing
const rateLimit = require('express-rate-limit'); // Import express-rate-limit for rate limiting
const timeout = require('connect-timeout'); // Import connect-timeout for setting request timeout
const getSongId = require('./handlers/getSongId'); // Import the getSongId function
const getSpotifyTokens = require('./handlers/getTokens'); // Import the getSpotifyTokens function
const { getNowPlaying, getRecentlyPlayed } = require('./handlers/getSpotify'); // Import the getNowPlaying and getRecentlyPlayed functions

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const localhost = `http://localhost:${port}`;
const REFERER = process.env.REFERER || localhost;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || REFERER;
// const ALLOWED_ORIGIN = "*";

// Serve static files from the /static directory
app.use(express.static(path.join(__dirname, 'static')));

// Middleware to check the Referer header
const refererCheck = (req, res, next) => {
  const referer = req.get('Referer');
  if (referer && (referer.startsWith(REFERER) || referer.startsWith(localhost))) {
    next();
  } else {
    res.status(404).sendFile(path.join(__dirname, '404', '404.html'));
  }
};

// Endpoint to return Spotify tokens, protected by the refererCheck middleware
// app.get('/tokens', refererCheck, (req, res) => {
//   const tokens = getSpotifyTokens();
//   res.json(tokens);
// });

// Rate limiting middleware for the /songid, /currently-playing, and /recently-played endpoints
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 240, // limit each IP to 240 requests per windowMs
  message: 'Too many requests from this IP, please try again after 2 minutes'
});

// Timeout middleware for the /songid, /currently-playing, and /recently-played endpoints
const apiTimeout = timeout('10s'); // 10 seconds timeout

// Apply CORS, rate limiting, and timeout to the /songid endpoint
app.get('/songid', cors({ origin: ALLOWED_ORIGIN }), apiLimiter, apiTimeout, getSongId);

// Apply CORS, rate limiting, and timeout to the /currently-playing endpoint
app.get('/currently-playing', refererCheck, apiLimiter, apiTimeout, async (req, res) => {
// app.get('/currently-playing', cors({ origin: ALLOWED_ORIGIN }), apiLimiter, apiTimeout, async (req, res) => {
  try {
    const data = await getNowPlaying();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply CORS, rate limiting, and timeout to the /recently-played endpoint
app.get('/recently-played', refererCheck, apiLimiter, apiTimeout, async (req, res) => {
// app.get('/recently-played', cors({ origin: ALLOWED_ORIGIN }), apiLimiter, apiTimeout, async (req, res) => {
  try {
    const data = await getRecentlyPlayed();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle all other requests and return 404.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '404', '404.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});