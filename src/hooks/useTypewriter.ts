import { useState, useEffect } from 'react';

interface UseTypewriterOptions {
  speed?: number;
  startDelay?: number;
}

export function useTypewriter(
  text: string,
  speed: number = 38,
  startDelay: number = 600
): { displayed: string; done: boolean } {
  const [displayed, setDisplayed] = useState<string>('');
  const [done, setDone] = useState<boolean>(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);

    let charIndex = 0;
    let typeInterval: NodeJS.Timeout | null = null;

    const delayTimeout = setTimeout(() => {
      typeInterval = setInterval(() => {
        charIndex++;
        setDisplayed(text.slice(0, charIndex));
        if (charIndex >= text.length) {
          if (typeInterval) clearInterval(typeInterval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(delayTimeout);
      if (typeInterval) clearInterval(typeInterval);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}
