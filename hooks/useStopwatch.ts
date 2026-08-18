'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface StopwatchSnapshot {
  elapsedSeconds: number;
  isRunning: boolean;
  /** Timestamp (ms) del último inicio/reanudación — para restaurar tras recarga. */
  runningSince?: number;
}

function resolveElapsed(snapshot: StopwatchSnapshot): number {
  let total = Math.max(0, Math.floor(snapshot.elapsedSeconds));
  if (snapshot.isRunning && snapshot.runningSince) {
    total += Math.floor((Date.now() - snapshot.runningSince) / 1000);
  }
  return total;
}

export function useStopwatch(initial: StopwatchSnapshot = { elapsedSeconds: 0, isRunning: false }) {
  const [snapshot, setSnapshot] = useState<StopwatchSnapshot>(() => ({
    elapsedSeconds: initial.elapsedSeconds,
    isRunning: initial.isRunning,
    runningSince: initial.isRunning ? initial.runningSince ?? Date.now() : undefined,
  }));
  const [, tick] = useState(0);
  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;

  useEffect(() => {
    if (!snapshot.isRunning) return;
    const id = window.setInterval(() => tick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [snapshot.isRunning]);

  const elapsedSeconds = resolveElapsed(snapshot);

  const start = useCallback(() => {
    setSnapshot((prev) => {
      if (prev.isRunning) return prev;
      return {
        elapsedSeconds: resolveElapsed(prev),
        isRunning: true,
        runningSince: Date.now(),
      };
    });
  }, []);

  const pause = useCallback(() => {
    setSnapshot((prev) => {
      if (!prev.isRunning) return prev;
      return {
        elapsedSeconds: resolveElapsed(prev),
        isRunning: false,
        runningSince: undefined,
      };
    });
  }, []);

  const reset = useCallback(() => {
    setSnapshot({ elapsedSeconds: 0, isRunning: false, runningSince: undefined });
  }, []);

  const getSnapshot = useCallback((): StopwatchSnapshot => {
    const prev = snapshotRef.current;
    const elapsed = resolveElapsed(prev);
    return {
      elapsedSeconds: elapsed,
      isRunning: prev.isRunning,
      runningSince: prev.isRunning ? prev.runningSince : undefined,
    };
  }, []);

  return {
    elapsedSeconds,
    isRunning: snapshot.isRunning,
    start,
    pause,
    reset,
    getSnapshot,
    setSnapshot,
  };
}
