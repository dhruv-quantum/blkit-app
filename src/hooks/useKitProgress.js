import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { readProgress, writeProgress } from "../utils/progressStore";

// Progress for a whole kit, across all of its booklets, for the signed-in
// account. It reads and writes the SAME storage as useProgress, so a tick made
// on a Quarter page shows up in the booklet view and vice versa.

export function useKitProgress(kitId, bookletIds = []) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const idsKey = bookletIds.join("|");

  const readAll = useCallback(() => {
    const map = {};
    for (const id of idsKey ? idsKey.split("|") : []) map[id] = readProgress(userId, kitId, id);
    return map;
  }, [userId, kitId, idsKey]);

  const [byBooklet, setByBooklet] = useState(readAll);

  useEffect(() => {
    setByBooklet(readAll());
  }, [readAll]);

  const isDone = useCallback((bookletId, activityId) => !!byBooklet[bookletId]?.includes(activityId), [byBooklet]);

  const toggle = useCallback(
    (bookletId, activityId) => {
      setByBooklet((prev) => {
        const current = prev[bookletId] || [];
        const next = current.includes(activityId)
          ? current.filter((id) => id !== activityId)
          : [...current, activityId];
        writeProgress(userId, kitId, bookletId, next);
        return { ...prev, [bookletId]: next };
      });
    },
    [userId, kitId]
  );

  // Un-tick a set of activities, given as [{ bookletId, activityId }].
  const clearMany = useCallback(
    (pairs) => {
      setByBooklet((prev) => {
        const next = { ...prev };
        for (const { bookletId } of pairs) {
          const drop = new Set(pairs.filter((p) => p.bookletId === bookletId).map((p) => p.activityId));
          next[bookletId] = (next[bookletId] || []).filter((id) => !drop.has(id));
          writeProgress(userId, kitId, bookletId, next[bookletId]);
        }
        return next;
      });
    },
    [userId, kitId]
  );

  return { byBooklet, isDone, toggle, clearMany };
}
