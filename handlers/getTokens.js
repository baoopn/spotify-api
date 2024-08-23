const dotenv = require('dotenv');

dotenv.config();

const REACT_APP_SPOTIFY_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REACT_APP_SPOTIFY_CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const REACT_APP_SPOTIFY_REFRESH_TOKEN = process.env.REACT_APP_SPOTIFY_REFRESH_TOKEN;

function getSpotifyTokens() {
  return {
    clientId: REACT_APP_SPOTIFY_CLIENT_ID,
    clientSecret: REACT_APP_SPOTIFY_CLIENT_SECRET,
    refreshToken: REACT_APP_SPOTIFY_REFRESH_TOKEN,
  };
}

module.exports = getSpotifyTokens;