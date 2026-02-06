# Spotify API Documentation

This API provides endpoints to interact with Spotify's Web API, allowing you to fetch information about currently playing tracks, recently played tracks, and song IDs. The API includes rate limiting, CORS support, and WebSocket real-time updates.

## Base URL
```
http://localhost:3000
```

## Authentication
The API handles Spotify OAuth authentication internally using refresh tokens. No client-side authentication is required.

## Rate Limiting
- **Limit**: 240 requests per minute per IP address
- **Window**: 1 minute

## Timeout
- **Timeout**: 3 seconds for API requests

## Endpoints

### GET /songid

Fetches basic information about the currently playing song.

#### Response

**Success (200)**
```json
{
  "isPlaying": true,
  "song_id": "4iV5W9uYEdYUVa79Axb7Rh",
  "songUrl": "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh",
  "title": "Blinding Lights",
  "artist": "The Weeknd"
}
```

**When nothing is playing (200)**
```json
{
  "isPlaying": false
}
```

**Error (500)**
```json
{
  "error": "Failed to fetch currently playing song"
}
```

#### Sample Request
```bash
curl -X GET "http://localhost:3000/songid" \
  -H "Origin: http://your-allowed-origin.com"
```

---

### GET /currently-playing

Fetches detailed information about the currently playing track, including album art, progress, and duration.

#### Response

**Success (200)**
```json
{
  "albumImageUrl": "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
  "artist": "The Weeknd",
  "isPlaying": true,
  "songUrl": "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh",
  "title": "Blinding Lights",
  "id": "4iV5W9uYEdYUVa79Axb7Rh",
  "progress_ms": 24500,
  "duration_ms": 200040
}
```

**When nothing is playing (200)**
```json
{
  "isPlaying": false
}
```

**Error (500)**
```json
{
  "error": "Failed to fetch now playing"
}
```

#### Sample Request
```bash
curl -X GET "http://localhost:3000/currently-playing" \
  -H "Origin: http://your-allowed-origin.com"
```

---

### GET /recently-played

Fetches the 5 most recently played tracks.

#### Response

**Success (200)**
```json
[
  {
    "albumImageUrl": "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
    "artist": "The Weeknd",
    "playedAt": "2024-01-15T10:30:45.123Z",
    "songUrl": "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh",
    "title": "Blinding Lights"
  },
  {
    "albumImageUrl": "https://i.scdn.co/image/ab67616d0000b2738b52c6b059731e6d457b5f2a",
    "artist": "Daft Punk, The Weeknd",
    "playedAt": "2024-01-15T10:25:12.456Z",
    "songUrl": "https://open.spotify.com/track/0DiWol3AO6WpXZgp0goxAV",
    "title": "Starboy"
  }
]
```

**Error (500)**
```json
{
  "error": "Failed to fetch recently played"
}
```

#### Sample Request
```bash
curl -X GET "http://localhost:3000/recently-played" \
  -H "Origin: http://your-allowed-origin.com"
```

---

## WebSocket Real-time Updates

The API supports WebSocket connections for real-time updates of Spotify playback data.

### Connection URL
```
ws://localhost:3000
```

### Client Messages

**Get Currently Playing**
```json
{
  "type": "get-currently-playing"
}
```

**Get Recently Played**
```json
{
  "type": "get-recently-played"
}
```

### Server Responses

**Currently Playing Update**
```json
{
  "type": "currently-playing",
  "data": {
    "albumImageUrl": "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
    "artist": "The Weeknd",
    "isPlaying": true,
    "songUrl": "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh",
    "title": "Blinding Lights",
    "id": "4iV5W9uYEdYUVa79Axb7Rh",
    "progress_ms": 24500,
    "duration_ms": 200040
  }
}
```

**Recently Played Update**
```json
{
  "type": "recently-played",
  "data": [
    {
      "albumImageUrl": "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
      "artist": "The Weeknd",
      "playedAt": "2024-01-15T10:30:45.123Z",
      "songUrl": "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh",
      "title": "Blinding Lights"
    }
  ]
}
```

### JavaScript WebSocket Example
```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = function() {
  // Request currently playing
  ws.send(JSON.stringify({ type: 'get-currently-playing' }));

  // Request recently played
  ws.send(JSON.stringify({ type: 'get-recently-played' }));
};

ws.onmessage = function(event) {
  const message = JSON.parse(event.data);
  console.log('Received:', message);
};
```

---

## Error Responses

### Rate Limit Exceeded (429)
```json
{
  "message": "Too many requests from this IP, please try again after 1 minute"
}
```

### Request Timeout (503)
```json
{
  "error": "Service Unavailable: Request timed out"
}
```

### CORS Error (404)
Returns the custom 404.html page if the request origin is not allowed.

---

## Data Types

### Track Object
```typescript
interface Track {
  albumImageUrl: string;    // URL to album artwork
  artist: string;           // Artist name(s), comma-separated
  songUrl: string;          // Spotify URL to the track
  title: string;            // Track title
  id?: string;              // Spotify track ID
  playedAt?: string;        // ISO 8601 timestamp (recently played only)
  progress_ms?: number;     // Current playback position in milliseconds
  duration_ms?: number;     // Total track duration in milliseconds
  isPlaying?: boolean;      // Whether the track is currently playing
}
```

---

## Caching

The API implements intelligent caching to reduce Spotify API calls:

- **Currently Playing**: 500ms cache
- **Recently Played**: 30 seconds cache
- **Song ID**: 5 seconds cache
- **Access Tokens**: 30 minutes cache

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `CLIENT_ID` | Spotify App Client ID | Yes |
| `CLIENT_SECRET` | Spotify App Client Secret | Yes |
| `REFRESH_TOKEN` | Spotify Refresh Token | Yes |
| `PORT` | Server port (default: 3000) | No |
| `REFERER` | Allowed referer URL | No |
| `ALLOWED_ORIGIN` | Comma-separated allowed origins | No |

---

## Development

### Starting the Server
```bash
npm install
npm start
```

### Development Mode
```bash
npm run dev
```

### Docker
```bash
docker-compose up
```