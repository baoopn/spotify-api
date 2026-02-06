import { useState, useEffect } from 'react';

const useDimensions = (ref) => {
  const [dimensions, setDimensions] = useState({});

  useEffect(() => {
    if (ref.current) {
      setDimensions(ref.current.getBoundingClientRect());
    }
  }, [ref]);

  return dimensions;
};

export default useDimensions;