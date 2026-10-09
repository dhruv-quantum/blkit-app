import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { readProgress, writeProgress } from "../utils/progressStore";

// Tracks which activity ids are marked complete for a given booklet.
// Saved per signed-in account (see utils/progressStore.js).
export function useProgress(kitId, bookletId) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const storageKey = `${userId}:${kitId}:${bookletId}`;
  const [done, setDone] = useState(() => readProgress(userId, kitId, bookletId));

  // Re-read if the booklet changes (e.g. navigating between booklets).
  useEffect(() => {
    setDone(readProgress(userId, kitId, bookletId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const toggle = useCallback(
    (activityId) => {
      setDone((prev) => {
        const next = prev.includes(activityId)
          ? prev.filter((id) => id !== activityId)
          : [...prev, activityId];
        writeProgress(userId, kitId, bookletId, next);
        return next;
      });
    },
    [storageKey]
  );

  const reset = useCallback(() => {
    setDone([]);
    writeProgress(userId, kitId, bookletId, []);
  }, [storageKey]);

  return { done, toggle, reset };
}
