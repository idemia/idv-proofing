import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  const handleResize = useCallback(
    debounce(
      () =>
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        }),
      100,
      {
        leading: true,
      },
    ),
    [],
  );

  useEffect(() => {
    // Handler to call on window resize

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}
