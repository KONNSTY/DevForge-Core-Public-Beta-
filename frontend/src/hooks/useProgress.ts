import { useState, useEffect, useCallback } from 'react';

export type ProgressData = {
  [trackId: string]: {
    completedLessons: string[];
    xp: number;
    lastAccessed: number;
  };
};

const STORAGE_KEY = 'weblearn-progress';
const CHANNEL_NAME = 'weblearn-progress-sync';

function normalizeProgress(value: unknown): ProgressData {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value).flatMap(([trackId, track]) => {
      if (!track || typeof track !== 'object' || Array.isArray(track)) return [];

      const record = track as Record<string, unknown>;
      return [[trackId, {
        completedLessons: Array.isArray(record.completedLessons)
          ? record.completedLessons.filter((id): id is string => typeof id === 'string')
          : [],
        xp: typeof record.xp === 'number' && Number.isFinite(record.xp) && record.xp > 0 ? record.xp : 0,
        lastAccessed: typeof record.lastAccessed === 'number' && Number.isFinite(record.lastAccessed)
          ? record.lastAccessed
          : 0,
      }]];
    }),
  );
}

function persistProgress(data: ProgressData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // The in-memory progress still works when browser storage is unavailable.
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>({});
  const [isHydrated, setIsHydrated] = useState(false);

  // Progress is intentionally local-only: there are no accounts or profile APIs.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // Persisted progress is read after hydration to keep the server render deterministic.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProgress(normalizeProgress(JSON.parse(stored)));
      }
    } catch {
      // Storage can be disabled by browser privacy settings; keep progress in memory.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Broadcast channel for cross-tab sync
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      if (!event.newValue) {
        setProgress({});
        return;
      }
      try {
        setProgress(normalizeProgress(JSON.parse(event.newValue)));
      } catch {
        // Ignore malformed data from another tab.
      }
    };
    window.addEventListener('storage', onStorage);

    const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(CHANNEL_NAME);
    if (channel) channel.onmessage = (event) => setProgress(normalizeProgress(event.data));

    return () => {
      window.removeEventListener('storage', onStorage);
      channel?.close();
    };
  }, []);

  const updateProgress = useCallback((newData: ProgressData) => {
    const normalizedData = normalizeProgress(newData);
    setProgress(normalizedData);
    persistProgress(normalizedData);
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage(normalizedData);
      channel.close();
    }
  }, []);

  const markLessonComplete = useCallback((trackId: string, lessonId: string, xpReward: number) => {
    setProgress((prev) => {
      const trackProgress = normalizeProgress(prev)[trackId] || { completedLessons: [], xp: 0, lastAccessed: Date.now() };
      
      if (trackProgress.completedLessons.includes(lessonId)) {
        return prev; // Already completed
      }

      const updated = {
        ...prev,
        [trackId]: {
          ...trackProgress,
          completedLessons: [...trackProgress.completedLessons, lessonId],
          xp: trackProgress.xp + xpReward,
          lastAccessed: Date.now(),
        },
      };

      persistProgress(updated);
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel(CHANNEL_NAME);
        channel.postMessage(updated);
        channel.close();
      }

      return updated;
    });
  }, []);

  return { progress, isHydrated, updateProgress, markLessonComplete };
}
