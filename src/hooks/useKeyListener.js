import { useCallback, useEffect } from 'react';

export default function useKeyListener(fn) {
  const memoizedListener = useCallback(e => fn(e.code), [fn]);

  useEffect(() => {
    document.addEventListener('keyup', memoizedListener);
    return () => {
      document.removeEventListener('keyup', memoizedListener);
    };
  }, [memoizedListener]);
}
