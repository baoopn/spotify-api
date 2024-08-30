import axios from 'axios';
import { getAccessToken } from './getSpotify.js';

const CACHE_DURATION = 5 * 1000; // 5 seconds

let songIdCache = {
  data: null,
  lastFetched: null,
};

const getSongId = async (req, res) => {
  const now = Date.now();

  // Check if the cache is still valid
  if (songIdCache.data && songIdCache.lastFetched + CACHE_DURATION > now) {
    return res.json(songIdCache.data);
  }

  try {
    const accessToken = await getAccessToken();

    // Get currently playing song from Spotify
    const songResponse = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const song = songResponse.data.item;

    // Check if song exists in the response
    if (!song) {
      return res.json({ isPlaying: false });
    }

    const songId = song.id;
    const songUrl = song.external_urls.spotify;
    const title = song.name;
    const artist = song.artists.map(artist => artist.name).join(', ');
    const isPlaying = songResponse.data.is_playing;

    const data = { isPlaying, song_id: songId, songUrl, title, artist };

    // Update the cache
    songIdCache = {
      data,
      lastFetched: now,
    };

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch currently playing song' });
  }
};

export default getSongId;