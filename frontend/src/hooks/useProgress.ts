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

function persistProgress(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>({});
  const [isHydrated, setIsHydrated] = useState(false);

  // Progress is intentionally local-only: there are no accounts or profile APIs.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        // Persisted progress is read after hydration to keep the server render deterministic.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProgress(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse progress data', e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Broadcast channel for cross-tab sync
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        setProgress(JSON.parse(event.newValue));
      } catch {
        // Ignore malformed data from another tab.
      }
    };
    window.addEventListener('storage', onStorage);

    const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(CHANNEL_NAME);
    if (channel) channel.onmessage = (event) => setProgress(event.data);

    return () => {
      window.removeEventListener('storage', onStorage);
      channel?.close();
    };
  }, []);

  const updateProgress = useCallback((newData: ProgressData) => {
    setProgress(newData);
    persistProgress(newData);
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage(newData);
      channel.close();
    }
  }, []);

  const markLessonComplete = useCallback((trackId: string, lessonId: string, xpReward: number) => {
    setProgress((prev) => {
      const trackProgress = prev[trackId] || { completedLessons: [], xp: 0, lastAccessed: Date.now() };
      
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
