import { ChakraProvider, extendTheme, Box, Flex, Text, Link } from '@chakra-ui/react';
import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import '@fontsource/inter'; // Import Inter font

// Lazy load the Spotify components
const SpotifyNowPlaying = lazy(() => import('./spotify/SpotifyNowPlaying'));
const SpotifyRecentTracks = lazy(() => import('./spotify/SpotifyRecentTracks'));

// Extend the theme to include the Inter font
const theme = extendTheme({
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Box textAlign="right" p={3}>
        <ColorModeSwitcher />
      </Box>

      <Flex direction="column" justifyContent="center" alignItems="center" minHeight="90vh" mb={6}>
        <Box textAlign="start" mb={6} mx={12}>
          <h1>Explore the tracks I'm listening to right now and check out my recent Spotify activity.</h1>
          <Text mt={4}>
            Discover more about me and my work on my personal page: <Link href="https://baoopn.com" color="teal.500" isExternal>baoopn.com</Link>.
          </Text>
        </Box>

        <Flex direction={{ base: "column", md: "row" }} justifyContent="center" alignItems="top" gap={6} overflowY={{ base: "auto", md: "hidden" }} overflowX="auto">
          <Suspense fallback={<div>Loading Now Playing...</div>}>
            <SpotifyNowPlaying />
          </Suspense>
          <Suspense fallback={<div>Loading Recent Tracks...</div>}>
            <SpotifyRecentTracks />
          </Suspense>
        </Flex>
      </Flex>

    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);