'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useCountdown(initialSeconds: number) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const onCompleteRef = useRef<(() => void) | null>(null);
  const accumulatedRestRef = useRef(0);
  const restStartedAtRef = useRef<number | null>(null);

  useEffect(() => {
    setRemaining(initialSeconds);
    setIsRunning(false);
    accumulatedRestRef.current = 0;
    restStartedAtRef.current = null;
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) return;
    const id = window.setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    if (isRunning || remaining !== 0) return;
    if (restStartedAtRef.current != null) {
      onCompleteRef.current?.();
      restStartedAtRef.current = null;
    }
  }, [isRunning, remaining]);

  const start = useCallback(
    (onComplete?: () => void) => {
      onCompleteRef.current = onComplete ?? null;
      restStartedAtRef.current = Date.now();
      setRemaining((r) => (r <= 0 ? initialSeconds : r));
      setIsRunning(true);
    },
    [initialSeconds],
  );

  const pause = useCallback(() => {
    if (isRunning && restStartedAtRef.current != null) {
      const spent = Math.floor((Date.now() - restStartedAtRef.current) / 1000);
      accumulatedRestRef.current += spent;
      restStartedAtRef.current = null;
    }
    setIsRunning(false);
  }, [isRunning]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setRemaining(initialSeconds);
    accumulatedRestRef.current = 0;
    restStartedAtRef.current = null;
  }, [initialSeconds]);

  const getAccumulatedRestSeconds = useCallback(() => {
    let total = accumulatedRestRef.current;
    if (isRunning && restStartedAtRef.current != null) {
      total += Math.floor((Date.now() - restStartedAtRef.current) / 1000);
    } else if (!isRunning && initialSeconds > 0 && remaining < initialSeconds) {
      total += initialSeconds - remaining;
    }
    return total;
  }, [initialSeconds, isRunning, remaining]);

  return {
    remaining,
    isRunning,
    start,
    pause,
    reset,
    getAccumulatedRestSeconds,
  };
}
