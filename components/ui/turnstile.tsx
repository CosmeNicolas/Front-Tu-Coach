'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          theme?: 'light' | 'dark' | 'auto';
          callback?: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
        },
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileProps {
  siteKey?: string;
  theme?: 'light' | 'dark' | 'auto';
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  className?: string;
}

const SCRIPT_ID = 'cf-turnstile-script';
const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

let scriptLoadingPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  if (typeof window !== 'undefined' && window.turnstile) {
    return Promise.resolve();
  }

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Turnstile'));
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

export function Turnstile({
  siteKey,
  theme = 'auto',
  onVerify,
  onError,
  onExpire,
  className,
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  const key = siteKey ?? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

  const handleVerify = useCallback(
    (token: string) => {
      onVerify(token);
    },
    [onVerify],
  );

  const handleError = useCallback(() => {
    onError?.();
  }, [onError]);

  const handleExpire = useCallback(() => {
    onExpire?.();
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, [onExpire]);

  useEffect(() => {
    if (!key) {
      return;
    }

    let mounted = true;

    loadScript()
      .then(() => {
        if (mounted) {
          setReady(true);
        }
      })
      .catch(() => {
        handleError();
      });

    return () => {
      mounted = false;
    };
  }, [key, handleError]);

  useEffect(() => {
    if (!ready || !key || !containerRef.current || !window.turnstile) {
      return;
    }

    if (widgetIdRef.current) {
      return;
    }

    const widgetId = window.turnstile.render(containerRef.current, {
      sitekey: key,
      theme,
      callback: handleVerify,
      'error-callback': handleError,
      'expired-callback': handleExpire,
    });

    widgetIdRef.current = widgetId;

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [ready, key, theme, handleVerify, handleError, handleExpire]);

  if (!key) {
    return null;
  }

  return <div ref={containerRef} className={className} />;
}

export function useTurnstile() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const onVerify = useCallback((t: string) => {
    setToken(t);
    setError(false);
  }, []);

  const onError = useCallback(() => {
    setToken(null);
    setError(true);
  }, []);

  const onExpire = useCallback(() => {
    setToken(null);
  }, []);

  const reset = useCallback(() => {
    setToken(null);
    setError(false);
  }, []);

  return {
    token,
    error,
    isReady: !!token && !error,
    onVerify,
    onError,
    onExpire,
    reset,
  };
}
