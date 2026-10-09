import { readJSON, writeJSON, removeKey } from "./storage";

// Progress is saved per signed-in account, so two people sharing one phone or
// laptop each see only their own ticks.
//   with an account: "progress:u:<userId>:<kitId>:<bookletId>"
//   (older builds)   "progress:<kitId>:<bookletId>"  -> adopted by the first
//                    account that opens that booklet, then removed.
export const progressKey = (userId, kitId, bookletId) =>
  userId ? `progress:u:${userId}:${kitId}:${bookletId}` : `progress:${kitId}:${bookletId}`;

const legacyKey = (kitId, bookletId) => `progress:${kitId}:${bookletId}`;

export function readProgress(userId, kitId, bookletId) {
  const key = progressKey(userId, kitId, bookletId);
  const own = readJSON(key, null);
  if (own !== null) return own;
  if (userId) {
    const old = readJSON(legacyKey(kitId, bookletId), null);
    if (old !== null) {
      writeJSON(key, old);
      removeKey(legacyKey(kitId, bookletId));
      return old;
    }
  }
  return [];
}

export function writeProgress(userId, kitId, bookletId, ids) {
  return writeJSON(progressKey(userId, kitId, bookletId), ids);
}
