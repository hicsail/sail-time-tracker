import { useRef, useEffect } from 'react';

export const useTimeout = (callback: () => void, timer: number | null) => {
  const timeoutIdRef = useRef<() => void | undefined>();

  useEffect(() => {
    timeoutIdRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (timer !== null && timeoutIdRef.current !== undefined) {
      const fn = () => timeoutIdRef.current!();
      const timeoutId = setTimeout(fn, timer);
      return () => clearTimeout(timeoutId);
    }
  }, [timer]);
};
