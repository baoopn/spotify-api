import axios from 'axios';
import getSpotifyTokens from "./getTokens.js";

const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=5`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

let recentlyPlayedCache = {
  data: null,
  lastFetched: null,
};

let tokenCache = {
  accessToken: null,
  lastFetched: null,
};

let nowPlayingCache = {
  data: null,
  lastFetched: null,
};

const RECENTLY_PLAYED_CACHE_DURATION = 30 * 1000; // 30 seconds
const TOKEN_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const NOW_PLAYING_CACHE_DURATION = 500; // 500 milliseconds

async function getAccessToken() {
  const now = Date.now();

  // Check if the cache is still valid
  if (tokenCache.accessToken && tokenCache.lastFetched + TOKEN_CACHE_DURATION > now) {
    return tokenCache.accessToken;
  }

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

    const { access_token } = response.data;

    // Update the cache
    tokenCache = {
      accessToken: access_token,
      lastFetched: now,
    };

    return access_token;
  } catch (error) {
    throw new Error('Failed to fetch access token');
  }
}

async function getNowPlaying() {
  const now = Date.now();

  // Check if the cache is still valid
  if (nowPlayingCache.data && nowPlayingCache.lastFetched + NOW_PLAYING_CACHE_DURATION > now) {
    return nowPlayingCache.data;
  }

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

    const data = {
      albumImageUrl: album.images[0].url,
      artist: artists.map(artist => artist.name).join(', '),
      isPlaying: is_playing,
      songUrl: external_urls.spotify,
      title,
      progress_ms,
      duration_ms,
    };

    // Update the cache
    nowPlayingCache = {
      data,
      lastFetched: now,
    };

    return data;
  } catch (error) {
    throw new Error('Failed to fetch now playing');
  }
}

async function getRecentlyPlayed() {
  const now = Date.now();

  // Check if the cache is still valid
  if (recentlyPlayedCache.data && recentlyPlayedCache.lastFetched + RECENTLY_PLAYED_CACHE_DURATION > now) {
    return recentlyPlayedCache.data;
  }

  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(RECENTLY_PLAYED_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = response.data.items.map(track => ({
      albumImageUrl: track.track.album.images[0].url,
      artist: track.track.artists.map(artist => artist.name).join(", "),
      playedAt: track.played_at,
      songUrl: track.track.external_urls.spotify,
      title: track.track.name,
    }));

    // Update the cache
    recentlyPlayedCache = {
      data,
      lastFetched: now,
    };

    return data;

  } catch (error) {
    throw new Error('Failed to fetch recently played');
  }
}

export { getNowPlaying, getRecentlyPlayed, getAccessToken };