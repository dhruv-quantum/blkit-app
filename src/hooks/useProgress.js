import { useEffect, useState, useCallback } from "react";
import { readJSON, writeJSON } from "../utils/storage";

// Tracks which activity ids are marked complete for a given booklet.
// Storage key shape: "progress:<kitId>:<bookletId>" -> array of activity ids.
export function useProgress(kitId, bookletId) {
  const storageKey = `progress:${kitId}:${bookletId}`;
  const [done, setDone] = useState(() => readJSON(storageKey, []));

  // Re-read if the booklet changes (e.g. navigating between booklets).
  useEffect(() => {
    setDone(readJSON(storageKey, []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const toggle = useCallback(
    (activityId) => {
      setDone((prev) => {
        const next = prev.includes(activityId)
          ? prev.filter((id) => id !== activityId)
          : [...prev, activityId];
        writeJSON(storageKey, next);
        return next;
      });
    },
    [storageKey]
  );

  const reset = useCallback(() => {
    setDone([]);
    writeJSON(storageKey, []);
  }, [storageKey]);

  return { done, toggle, reset };
}
