import { describe, it, expect, vi, beforeEach } from "vitest";

// Build a fake admin Supabase client tailored to exactly what
// api/admin/create-user.js calls, and make @supabase/supabase-js's
// createClient() return it.
function makeFakeAdminClient({ callerId, callerRole, inviteShouldFail = false }) {
  const updates = [];
  const inserts = [];

  return {
    auth: {
      async getUser(token) {
        if (token !== "valid-token") return { data: { user: null }, error: { message: "bad token" } };
        return { data: { user: { id: callerId, email: "caller@example.com" } }, error: null };
      },
      admin: {
        async inviteUserByEmail(email) {
          if (inviteShouldFail) return { data: null, error: { message: "Email already registered" } };
          return { data: { user: { id: "new-user-id", email } }, error: null };
        },
      },
    },
    from(table) {
      return {
        select() {
          return {
            eq(col, val) {
              return {
                async single() {
                  if (table === "profiles" && val === callerId) {
                    return { data: { role: callerRole }, error: null };
                  }
                  return { data: null, error: { message: "not found" } };
                },
              };
            },
          };
        },
        update(payload) {
          updates.push({ table, payload });
          return {
            eq() {
              return Promise.resolve({ error: null });
            },
          };
        },
        insert(rows) {
          inserts.push({ table, rows });
          return Promise.resolve({ error: null });
        },
      };
    },
    __updates: updates,
    __inserts: inserts,
  };
}

let fakeClient;

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => fakeClient),
}));

let handler;

beforeEach(async () => {
  process.env.SUPABASE_URL = "https://fake.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "fake-service-key";
  vi.resetModules();
  ({ default: handler } = await import("./create-user.js"));
});

function makeRes() {
  const res = { statusCode: null, body: null };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (obj) => {
    res.body = obj;
    return res;
  };
  return res;
}

describe("api/admin/create-user", () => {
  it("rejects non-POST requests", async () => {
    fakeClient = makeFakeAdminClient({ callerId: "admin-1", callerRole: "admin" });
    const res = makeRes();
    await handler({ method: "GET" }, res);
    expect(res.statusCode).toBe(405);
  });

  it("rejects requests with no authorization header", async () => {
    fakeClient = makeFakeAdminClient({ callerId: "admin-1", callerRole: "admin" });
    const res = makeRes();
    await handler({ method: "POST", headers: {}, body: {} }, res);
    expect(res.statusCode).toBe(401);
  });

  it("rejects an invalid/expired token", async () => {
    fakeClient = makeFakeAdminClient({ callerId: "admin-1", callerRole: "admin" });
    const res = makeRes();
    await handler(
      { method: "POST", headers: { authorization: "Bearer garbage" }, body: {} },
      res
    );
    expect(res.statusCode).toBe(401);
  });

  it("rejects a caller whose profile role is 'parent'", async () => {
    fakeClient = makeFakeAdminClient({ callerId: "parent-1", callerRole: "parent" });
    const res = makeRes();
    await handler(
      {
        method: "POST",
        headers: { authorization: "Bearer valid-token" },
        body: { email: "new@example.com", role: "parent" },
      },
      res
    );
    expect(res.statusCode).toBe(403);
  });

  it("rejects a staff caller trying to create a staff profile", async () => {
    fakeClient = makeFakeAdminClient({ callerId: "staff-1", callerRole: "staff" });
    const res = makeRes();
    await handler(
      {
        method: "POST",
        headers: { authorization: "Bearer valid-token" },
        body: { email: "new@example.com", fullName: "New Person", role: "staff" },
      },
      res
    );
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/only admins/i);
  });

  it("allows a staff caller to create a parent profile with kit access", async () => {
    fakeClient = makeFakeAdminClient({ callerId: "staff-1", callerRole: "staff" });
    const res = makeRes();
    await handler(
      {
        method: "POST",
        headers: { authorization: "Bearer valid-token" },
        body: {
          email: "newparent@example.com",
          fullName: "New Parent",
          role: "parent",
          kitIds: ["nursery", "phonics"],
        },
      },
      res
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(fakeClient.__inserts).toHaveLength(1);
    expect(fakeClient.__inserts[0].rows).toHaveLength(2);
    expect(fakeClient.__inserts[0].rows[0]).toMatchObject({ kit_id: "nursery", granted_by: "staff-1" });
  });

  it("allows an admin caller to create a staff profile", async () => {
    fakeClient = makeFakeAdminClient({ callerId: "admin-1", callerRole: "admin" });
    const res = makeRes();
    await handler(
      {
        method: "POST",
        headers: { authorization: "Bearer valid-token" },
        body: { email: "newstaff@example.com", fullName: "New Staff", role: "staff" },
      },
      res
    );
    expect(res.statusCode).toBe(200);
    expect(fakeClient.__updates[0].payload).toMatchObject({ role: "staff" });
  });

  it("rejects an invalid role value", async () => {
    fakeClient = makeFakeAdminClient({ callerId: "admin-1", callerRole: "admin" });
    const res = makeRes();
    await handler(
      {
        method: "POST",
        headers: { authorization: "Bearer valid-token" },
        body: { email: "x@example.com", role: "superuser" },
      },
      res
    );
    expect(res.statusCode).toBe(400);
  });

  it("surfaces an invite failure (e.g. email already registered)", async () => {
    fakeClient = makeFakeAdminClient({ callerId: "admin-1", callerRole: "admin", inviteShouldFail: true });
    const res = makeRes();
    await handler(
      {
        method: "POST",
        headers: { authorization: "Bearer valid-token" },
        body: { email: "dup@example.com", role: "parent" },
      },
      res
    );
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/already registered/i);
  });
});
