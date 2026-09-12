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
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>({});
  const [isHydrated, setIsHydrated] = useState(false);

  // Initial load: LocalStorage + Optional Backend Sync if JWT exists
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse progress data', e);
      }
    }
    setIsHydrated(true);

    // Sync from remote backend if authenticated
    const token = localStorage.getItem('devforge_jwt');
    if (token) {
      fetch(`${API_BASE}/api/v1/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.ok ? res.json() : null)
      .then(records => {
        if (records && Array.isArray(records)) {
          setProgress(prev => {
            const merged = { ...prev };
            for (const r of records) {
              if (!merged[r.trackId]) {
                merged[r.trackId] = { completedLessons: [], xp: 0, lastAccessed: Date.now() };
              }
              if (!merged[r.trackId].completedLessons.includes(r.lessonId)) {
                merged[r.trackId].completedLessons.push(r.lessonId);
                merged[r.trackId].xp += 50;
              }
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            return merged;
          });
        }
      })
      .catch(() => {});
    }
  }, []);

  // Broadcast channel for cross-tab sync
  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event) => {
      setProgress(event.data);
    };
    return () => channel.close();
  }, []);

  const updateProgress = useCallback((newData: ProgressData) => {
    setProgress(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage(newData);
    channel.close();
  }, []);

  const markLessonComplete = useCallback((trackId: string, lessonId: string, xpReward: number, codeSnapshot = "") => {
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

      // Local Sync
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage(updated);
      channel.close();

      // Remote Enterprise Backend Sync (Strict Auth Gate)
      const token = localStorage.getItem('devforge_jwt');
      if (token) {
        fetch(`${API_BASE}/api/v1/progress/complete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            trackId,
            lessonId,
            codeSnapshot,
            executionMetricsJson: JSON.stringify({ completedAt: new Date().toISOString() })
          })
        }).catch(() => {});
      }

      return updated;
    });
  }, []);

  return { progress, isHydrated, updateProgress, markLessonComplete };
}
