
# Spotify Tokens API

This project provides an Express.js server that interacts with the Spotify API to fetch information about the currently playing track, recently played tracks, and song IDs. The use of an API server helps protect your secret tokens since frontend apps not built securely (e.g., with Create React App) may accidentally expose tokens in built JavaScript files. The server also serves a static webpage (HTML, CSS, JS) or a static build of a frontend framework (e.g., Create React App) at the root (`/`). It includes middleware for CORS, rate limiting, and request timeouts to ensure secure and efficient API usage.

## Features

- **CORS**: Cross-Origin Resource Sharing to control access to the API.
- **Rate Limiting**: Limits the number of requests from a single IP to prevent abuse.
- **Timeout**: Sets a timeout for API requests to avoid long-running requests.
- **Referer Check**: Ensures that requests come from allowed origins.
- **Endpoints**:
  - `/`: Serves static webpage in static directory
  - `/songid`: Fetches currently playing song's ID.
  - `/currently-playing`: Fetches information about the currently playing track.
  - `/recently-played`: Fetches information about recently played tracks.

## Prerequisites

- Node.js
- npm (Node Package Manager)
- Spotify Developer Account (for API credentials)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/baoopn/spotify-api.git
   cd spotify-api
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add your Spotify API credentials:
   ```env
   CLIENT_ID=your_spotify_client_id
   CLIENT_SECRET=your_spotify_client_secret
   REFRESH_TOKEN=your_spotify_refresh_token
   PORT=3000 # or any port
   REFERER=http://your-allowed-referer.com
   ALLOWED_ORIGIN=http://your-allowed-origin.com
   ```

## Usage

1. Start the server:
   ```sh
   npm start
   ```

2. The server will be running at `http://localhost:3000`.

## Endpoints

### `/songid`

- **Description**: Fetches song ID information.
- **Method**: GET
- **Middleware**: CORS, Rate Limiting, Timeout

### `/currently-playing`

- **Description**: Fetches information about the currently playing track.
- **Method**: GET
- **Middleware**: Referer Check, Rate Limiting, Timeout

### `/recently-played`

- **Description**: Fetches information about recently played tracks.
- **Method**: GET
- **Middleware**: Referer Check, Rate Limiting, Timeout

## Middleware

- **CORS**: Configured to allow requests from the specified origin.
- **Rate Limiting**: Limits each IP to 240 requests per minute.
- **Timeout**: Sets a 10-second timeout for API requests.
- **Referer Check**: Ensures requests come from allowed referers.

## Serving Static Files

To serve a static webpage (HTML, CSS, JS) or a static build of a framework like Create React App or Next.js at the root (`/`) of the API:

1. Create a `static` directory in the root of your project:
   ```sh
   mkdir static
   ```

2. Place your static files (HTML, CSS, JS) or the static build of your framework inside the `static` directory.

3. The server is already configured to serve static files from the `static` directory. When you navigate to `http://localhost:3000`, the static files will be served.

## Get Refresh Token

Read the instructions for getting your Spotify's Refresh Token here [RefreshToken](RefreshToken.md)

## Frontend

For reference, visit my [spotify-now-playing-react](https://github.com/baoopn/spotify-now-playing-react) repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [dotenv](https://github.com/motdotla/dotenv)
- [cors](https://github.com/expressjs/cors)
- [express-rate-limit](https://github.com/nfriedly/express-rate-limit)
- [connect-timeout](https://github.com/expressjs/timeout)
- [axios](https://github.com/axios/axios)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [leerob's blog: Using the Spotify API with Next.js](https://leerob.io/blog/spotify-api-nextjs)
