import { useCallback, useEffect, useState } from "react";
import { readJSON, writeJSON } from "../utils/storage";

// Progress for a whole kit, across all of its booklets. It reads and writes
// the SAME storage keys as useProgress ("progress:<kitId>:<bookletId>"), so a
// tick made on a Quarter page shows up in the booklet view and vice versa.
const keyFor = (kitId, bookletId) => `progress:${kitId}:${bookletId}`;

export function useKitProgress(kitId, bookletIds = []) {
  const idsKey = bookletIds.join("|");

  const readAll = useCallback(() => {
    const map = {};
    for (const id of idsKey ? idsKey.split("|") : []) map[id] = readJSON(keyFor(kitId, id), []);
    return map;
  }, [kitId, idsKey]);

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
        writeJSON(keyFor(kitId, bookletId), next);
        return { ...prev, [bookletId]: next };
      });
    },
    [kitId]
  );

  // Un-tick a set of activities, given as [{ bookletId, activityId }].
  const clearMany = useCallback(
    (pairs) => {
      setByBooklet((prev) => {
        const next = { ...prev };
        for (const { bookletId } of pairs) {
          const drop = new Set(pairs.filter((p) => p.bookletId === bookletId).map((p) => p.activityId));
          next[bookletId] = (next[bookletId] || []).filter((id) => !drop.has(id));
          writeJSON(keyFor(kitId, bookletId), next[bookletId]);
        }
        return next;
      });
    },
    [kitId]
  );

  return { byBooklet, isDone, toggle, clearMany };
}
