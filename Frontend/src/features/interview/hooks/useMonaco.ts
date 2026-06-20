import { useEffect, useState } from 'react';

export const useMonaco = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if ((window as any).monaco) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0/min/vs/loader.min.js';
    script.async = true;
    
    script.onload = () => {
      const require = (window as any).require;
      if (require) {
        require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0/min/vs' } });
        require(['vs/editor/main'], () => {
          setIsLoaded(true);
        }, (err: any) => {
          setError(err);
        });
      } else {
        setError(new Error('Monaco loader dependencies unresolved.'));
      }
    };

    script.onerror = () => {
      setError(new Error('Failed to download Monaco editor distribution from secure CDN grid.'));
    };

    document.body.appendChild(script);
  }, []);

  return { isLoaded, error };
};