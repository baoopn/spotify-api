import { RECENTLY_PLAYED_ENDPOINT, CURRENTLY_PLAYING_ENDPOINT } from "./Constants";

export const getNowPlaying = async () => {
  return fetch(CURRENTLY_PLAYING_ENDPOINT);
};

export const getRecentlyPlayed = async () => {
  return fetch(RECENTLY_PLAYED_ENDPOINT);
};

export default async function getNowPlayingItem() {
  const response = await getNowPlaying();
  if (response.status === 204 || response.status > 400) {
    return false;
  }

  try {
    const song = await response.json();
    // Backend already processes the Spotify response, so return it directly
    return song;
  } catch (error) {
    return false;
  }

}

export async function getRecentlyPlayedTracks() {
  const response = await getRecentlyPlayed();
  if (response.status > 400) {
    return false;
  }

  try {
    const data = await response.json();
    // Backend already returns the processed array
    return data;
  } catch (error) {
    return false;
  }
}