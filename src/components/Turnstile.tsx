'use client';

import { useEffect, useRef, useState } from 'react';

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: () => void;
}

export default function Turnstile({ siteKey, onVerify, onError }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Load Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => {
      setIsError(true);
      onError?.();
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [onError]);

  useEffect(() => {
    // Render Turnstile widget when script is loaded
    if (isLoaded && containerRef.current && window.turnstile) {
      try {
        const widgetId = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            onVerify(token);
          },
          'error-callback': () => {
            setIsError(true);
            onError?.();
          },
          theme: 'dark',
        });

        return () => {
          if (window.turnstile && widgetId) {
            window.turnstile.remove(widgetId);
          }
        };
      } catch (error) {
        console.error('Turnstile error:', error);
        setIsError(true);
        onError?.();
      }
    }
  }, [isLoaded, siteKey, onVerify, onError]);

  return (
    <div ref={containerRef} className="min-h-[65px]">
      {!isLoaded && (
        <div className="text-dim text-sm">Loading CAPTCHA...</div>
      )}
      {isError && (
        <div className="text-red text-sm">Failed to load CAPTCHA. Please refresh the page.</div>
      )}
    </div>
  );
}

// Extend window interface for Turnstile
declare global {
  interface Window {
    turnstile: {
      render: (
        container: HTMLElement,
        params: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
        }
      ) => string | number;
      reset: (widgetId: string | number) => void;
      remove: (widgetId: string | number) => void;
    };
  }
}
