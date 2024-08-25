const axios = require('axios');

const getSongId = async (req, res) => {
  try {
    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;

    // Get access token from Spotify
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: SPOTIFY_REFRESH_TOKEN,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
      },
    });

    const accessToken = tokenResponse.data.access_token;

    // Get currently playing song from Spotify
    const songResponse = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const songId = songResponse.data.item.id;

    res.json({ song_id: songId });
  } catch (error) {
    console.error('Error fetching currently playing song:', error);
    res.status(500).json({ error: 'Failed to fetch currently playing song' });
  }
};

module.exports = getSongId;