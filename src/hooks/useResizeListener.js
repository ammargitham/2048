import { useCallback, useEffect } from 'react';

export default function useResizeListener(fn) {
  const memoizedListener = useCallback(fn, [fn]);

  useEffect(() => {
    window.addEventListener('resize', memoizedListener);
    return () => {
      window.removeEventListener('resize', memoizedListener);
    };
  }, [memoizedListener]);
}
