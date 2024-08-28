import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import moment from 'moment';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import timeout from 'connect-timeout';
import getSongId from "./handlers/getSongId.js";
import { getNowPlaying, getRecentlyPlayed } from './handlers/getSpotify.js';

// Load environment variables from .env file (for development)
// dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const localhost = `http://localhost:${port}`;
const REFERER = process.env.REFERER || localhost;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.split(',') : [REFERER];
// const ALLOWED_ORIGIN = "*";

// Set trust proxy to a specific value (e.g., 'loopback' for localhost, or a specific IP address)
app.set('trust proxy', 'loopback');

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files from the /static directory
app.use(express.static(path.join(__dirname, 'static')))

// Helper function to get the current timestamp in a human-readable format
export function getCurrentTimestamp() {
  return moment().format('YYYY-MM-DD HH:mm:ss');
}

// Middleware to check the Referer header
const refererCheck = (req, res, next) => {
  const referer = req.get('Referer');
  if (referer && (referer.startsWith(REFERER) || referer.startsWith(localhost))) {
    next();
  } else {
    res.status(404).sendFile(path.join(__dirname, '404', '404.html'));
  }
};

// Rate limiting middleware for the /songid, /currently-playing, and /recently-played endpoints
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 240, // limit each IP to 240 requests per windowMs
  message: 'Too many requests from this IP, please try again after 1 minute'
});

// Timeout middleware for the /songid, /currently-playing, and /recently-played endpoints
const apiTimeout = timeout(3000); // 3 seconds timeout

// Apply CORS, rate limiting, and timeout to the /songid endpoint
app.get('/songid', cors({ origin: ALLOWED_ORIGIN }), apiLimiter, apiTimeout, getSongId);

// Apply CORS, rate limiting, and timeout to the /currently-playing endpoint
// app.get('/currently-playing', refererCheck, apiLimiter, apiTimeout, async (req, res) => {
app.get('/currently-playing', cors({ origin: ALLOWED_ORIGIN }), apiLimiter, apiTimeout, async (req, res) => {
  try {
    const data = await getNowPlaying();
    if (!res.headersSent) {
      res.json(data);
    }
  } catch (error) {
    console.error(`[${getCurrentTimestamp()}] Error:`, error.message); // Log error with human-readable timestamp
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

// Apply CORS, rate limiting, and timeout to the /recently-played endpoint
// app.get('/recently-played', refererCheck, apiLimiter, apiTimeout, async (req, res) => {
app.get('/recently-played', cors({ origin: ALLOWED_ORIGIN }), apiLimiter, apiTimeout, async (req, res) => {
  try {
    const data = await getRecentlyPlayed();
    if (!res.headersSent) {
      res.json(data);
    }
  } catch (error) {
    console.error(`[${getCurrentTimestamp()}] Error:`, error.message); // Log error with human-readable timestamp
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

// Handle all other requests and return 404.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '404', '404.html'));
});

// Custom error-handling middleware for timeout
app.use((err, req, res, next) => {
  if (err.timeout) {
    if (!res.headersSent) {
      res.status(503).json({ error: 'Service Unavailable: Request timed out' });
    }
  } else {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});