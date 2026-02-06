import React, { useEffect } from 'react';
import { useColorMode, IconButton } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

export function ColorModeSwitcher(props) {
  const { colorMode, toggleColorMode, setColorMode } = useColorMode();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setColorMode(mediaQuery.matches ? 'dark' : 'light');
    };

    // Set the initial color mode
    handleChange();

    // Add event listener
    mediaQuery.addEventListener('change', handleChange);

    // Clean up event listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [setColorMode]);

  return (
    <IconButton
      size="md"
      fontSize="lg"
      aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
      variant="ghost"
      color="current"
      marginLeft="2"
      onClick={toggleColorMode}
      icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
      {...props}
    />
  );
}