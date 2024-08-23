const axios = require('axios');
const getSpotifyTokens = require('./getTokens');

const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=5`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

async function getAccessToken() {
  try {
    const { clientId, clientSecret, refreshToken } = getSpotifyTokens();

    const response = await axios.post(TOKEN_ENDPOINT, null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch access token');
  }
}

async function getNowPlaying() {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 204 || response.data === '') {
      return { isPlaying: false };
    }

    const { item, is_playing, progress_ms } = response.data;
    const { name: title, artists, album, external_urls, duration_ms } = item;

    return {
      albumImageUrl: album.images[0].url,
      artist: artists.map(artist => artist.name).join(', '),
      isPlaying: is_playing,
      songUrl: external_urls.spotify,
      title,
      progress_ms,
      duration_ms,
    };
  } catch (error) {
    console.error('Error fetching now playing:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch now playing');
  }
}

async function getRecentlyPlayed() {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(RECENTLY_PLAYED_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = response.data;
    return data.items.map(track => ({
      albumImageUrl: track.track.album.images[0].url,
      artist: track.track.artists.map(artist => artist.name).join(", "),
      playedAt: track.played_at,
      songUrl: track.track.external_urls.spotify,
      title: track.track.name,
    }));
  } catch (error) {
    console.error('Error fetching recently played:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch recently played');
  }
}

module.exports = { getAccessToken, getNowPlaying, getRecentlyPlayed };