// A small in-memory stand-in for @supabase/supabase-js, covering exactly the
// query shapes this app uses (select/eq/order/single, insert, delete/eq).
// Not a general-purpose PostgREST mock — just enough to exercise real
// component behavior in tests without hitting a real network.

function applyFilters(rows, filters) {
  return rows.filter((row) => filters.every(([col, val]) => row[col] === val));
}

function makeQueryBuilder(store, table) {
  const filters = [];
  let pendingDelete = false;

  const builder = {
    select() {
      return builder;
    },
    eq(col, val) {
      filters.push([col, val]);
      return builder;
    },
    order() {
      return builder;
    },
    single() {
      const rows = applyFilters(store[table], filters);
      if (rows.length === 0) {
        return Promise.resolve({ data: null, error: { message: `No row found in ${table}` } });
      }
      return Promise.resolve({ data: rows[0], error: null });
    },
    insert(rowsToInsert) {
      const arr = Array.isArray(rowsToInsert) ? rowsToInsert : [rowsToInsert];
      arr.forEach((r) => store[table].push({ id: r.id || `${table}-${store[table].length + 1}`, ...r }));
      return Promise.resolve({ data: arr, error: null });
    },
    delete() {
      pendingDelete = true;
      return builder;
    },
    // Makes the builder awaitable directly (e.g. `await supabase.from(x).select().eq(...)`)
    then(resolve, reject) {
      if (pendingDelete) {
        const toRemove = applyFilters(store[table], filters);
        store[table] = store[table].filter((row) => !toRemove.includes(row));
        return Promise.resolve({ data: null, error: null }).then(resolve, reject);
      }
      const rows = applyFilters(store[table], filters);
      return Promise.resolve({ data: rows, error: null }).then(resolve, reject);
    },
  };

  return builder;
}

export function createFakeSupabase({ session = null, profiles = [], kitAccess = [] } = {}) {
  const store = { profiles, kit_access: kitAccess };
  let currentSession = session;
  const listeners = [];

  const auth = {
    async getSession() {
      return { data: { session: currentSession } };
    },
    onAuthStateChange(callback) {
      listeners.push(callback);
      return { data: { subscription: { unsubscribe() {} } } };
    },
    async signInWithPassword({ email, password }) {
      const match = profiles.find((p) => p.email === email);
      if (!match || password !== "correct-password") {
        return { error: { message: "Invalid login credentials" } };
      }
      currentSession = { user: { id: match.id, email: match.email }, access_token: `token-${match.id}` };
      listeners.forEach((cb) => cb("SIGNED_IN", currentSession));
      return { error: null };
    },
    async signOut() {
      currentSession = null;
      listeners.forEach((cb) => cb("SIGNED_OUT", null));
    },
  };

  return {
    auth,
    from(table) {
      return makeQueryBuilder(store, table === "kit_access" ? "kit_access" : table);
    },
    __store: store,
  };
}
