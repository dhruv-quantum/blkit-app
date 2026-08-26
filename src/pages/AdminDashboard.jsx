import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { KITS, ADDONS } from "../data/kit";
import TopBar from "../components/TopBar";
import BackButton from "../components/BackButton";

const ALL_GRANTABLE = [...KITS.map((k) => ({ id: k.id, name: k.name })), ...ADDONS];

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const isAdmin = profile?.role === "admin";

  const [parents, setParents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [kitAccess, setKitAccess] = useState([]); // all rows, admin/staff can read all
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState("");

  const [form, setForm] = useState({
    email: "",
    fullName: "",
    role: "parent",
    kitIds: [],
  });
  const [formStatus, setFormStatus] = useState({ submitting: false, error: "", success: "" });

  const loadData = useCallback(async () => {
    setLoadingList(true);
    setListError("");

    const profilesQuery = supabase.from("profiles").select("*").order("created_at", { ascending: false });
    const { data: profilesData, error: profilesError } = await profilesQuery;

    const { data: accessData, error: accessError } = await supabase
      .from("kit_access")
      .select("*");

    if (profilesError || accessError) {
      setListError((profilesError || accessError).message);
      setLoadingList(false);
      return;
    }

    setParents((profilesData || []).filter((p) => p.role === "parent"));
    setStaff((profilesData || []).filter((p) => p.role === "staff" || p.role === "admin"));
    setKitAccess(accessData || []);
    setLoadingList(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function kitsForParent(parentId) {
    return kitAccess.filter((a) => a.parent_id === parentId).map((a) => a.kit_id);
  }

  function toggleFormKit(kitId) {
    setForm((f) => ({
      ...f,
      kitIds: f.kitIds.includes(kitId) ? f.kitIds.filter((k) => k !== kitId) : [...f.kitIds, kitId],
    }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormStatus({ submitting: true, error: "", success: "" });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          email: form.email.trim(),
          fullName: form.fullName.trim(),
          role: form.role,
          kitIds: form.role === "parent" ? form.kitIds : [],
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Something went wrong.");

      setFormStatus({
        submitting: false,
        error: "",
        success: `Invite sent to ${form.email}. They'll get an email to set their password.`,
      });
      setForm({ email: "", fullName: "", role: "parent", kitIds: [] });
      loadData();
    } catch (err) {
      setFormStatus({ submitting: false, error: err.message, success: "" });
    }
  }

  async function grantKit(parentId, kitId) {
    const { error } = await supabase
      .from("kit_access")
      .insert({ parent_id: parentId, kit_id: kitId, granted_by: profile.id });
    if (!error) loadData();
  }

  async function revokeKit(parentId, kitId) {
    const { error } = await supabase
      .from("kit_access")
      .delete()
      .eq("parent_id", parentId)
      .eq("kit_id", kitId);
    if (!error) loadData();
  }

  return (
    <div>
      <TopBar pill={isAdmin ? "Admin" : "Staff"} />
      <main className="mx-auto max-w-[1080px] px-5 pb-20 pt-7">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <BackButton label="Kit Library" onClick={() => navigate("/")} />
            <h1 className="text-[26px] text-forest-deep">{isAdmin ? "Admin dashboard" : "Staff dashboard"}</h1>
            <p className="mt-1 text-[13.5px] text-muted">
              {isAdmin
                ? "Create parent or staff profiles and manage which kits each parent can access."
                : "Create parent profiles and manage which kits each parent can access."}
            </p>
          </div>
          <button
            onClick={signOut}
            className="h-fit rounded-full border border-line bg-white px-4 py-2 text-[13px] font-bold text-forest-deep hover:bg-sand-deep"
          >
            Sign out
          </button>
        </div>

        {/* --- Create profile form --- */}
        <div className="mb-8 rounded-2xl border border-line bg-white p-6 shadow-md">
          <h2 className="mb-4 text-[18px] text-forest-deep">Create a new profile</h2>
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[12.5px] font-bold text-forest-deep">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-lg border border-line px-3 py-2.5 text-[14px] outline-none focus:border-forest"
                placeholder="parent@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12.5px] font-bold text-forest-deep">Full name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                className="w-full rounded-lg border border-line px-3 py-2.5 text-[14px] outline-none focus:border-forest"
                placeholder="Jane Doe"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-[12.5px] font-bold text-forest-deep">Role</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-[13.5px]">
                  <input
                    type="radio"
                    name="role"
                    checked={form.role === "parent"}
                    onChange={() => setForm((f) => ({ ...f, role: "parent" }))}
                  />
                  Parent
                </label>
                {isAdmin && (
                  <label className="flex items-center gap-2 text-[13.5px]">
                    <input
                      type="radio"
                      name="role"
                      checked={form.role === "staff"}
                      onChange={() => setForm((f) => ({ ...f, role: "staff", kitIds: [] }))}
                    />
                    Staff
                  </label>
                )}
              </div>
            </div>

            {form.role === "parent" && (
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[12.5px] font-bold text-forest-deep">
                  Kit access
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_GRANTABLE.map((k) => (
                    <label
                      key={k.id}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-bold ${
                        form.kitIds.includes(k.id)
                          ? "border-forest bg-forest text-white"
                          : "border-line bg-sand text-forest-deep"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={form.kitIds.includes(k.id)}
                        onChange={() => toggleFormKit(k.id)}
                      />
                      {k.name}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="sm:col-span-2">
              {formStatus.error && (
                <div className="mb-2 text-[12.5px] font-bold text-coral-deep">{formStatus.error}</div>
              )}
              {formStatus.success && (
                <div className="mb-2 text-[12.5px] font-bold text-forest">{formStatus.success}</div>
              )}
              <button
                type="submit"
                disabled={formStatus.submitting}
                className="rounded-full bg-brand-gradient px-5 py-2.5 text-[13.5px] font-extrabold text-white disabled:opacity-60"
              >
                {formStatus.submitting ? "Creating…" : "Create profile"}
              </button>
            </div>
          </form>
        </div>

        {/* --- Parents table --- */}
        <div className="mb-8">
          <h2 className="mb-3 text-[18px] text-forest-deep">Parents</h2>
          {listError && <div className="text-[13px] text-coral-deep">{listError}</div>}
          {loadingList ? (
            <div className="text-[13.5px] text-muted">Loading…</div>
          ) : parents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line bg-white p-5 text-[13.5px] text-muted">
              No parent profiles yet — create one above.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-md">
              <table className="w-full text-left text-[13.5px]">
                <thead className="bg-sand-deep text-[12px] font-extrabold uppercase tracking-wide text-forest-deep">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Kit access</th>
                  </tr>
                </thead>
                <tbody>
                  {parents.map((p) => {
                    const granted = kitsForParent(p.id);
                    return (
                      <tr key={p.id} className="border-t border-sand-deep align-top">
                        <td className="px-4 py-3 font-bold text-forest-deep">{p.full_name || "—"}</td>
                        <td className="px-4 py-3 text-muted">{p.email}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {ALL_GRANTABLE.map((k) => {
                              const has = granted.includes(k.id);
                              return (
                                <button
                                  key={k.id}
                                  onClick={() => (has ? revokeKit(p.id, k.id) : grantKit(p.id, k.id))}
                                  className={`rounded-full border px-2.5 py-1 text-[11.5px] font-bold ${
                                    has
                                      ? "border-forest bg-forest text-white"
                                      : "border-line bg-sand text-muted"
                                  }`}
                                  title={has ? `Revoke ${k.name}` : `Grant ${k.name}`}
                                >
                                  {k.name}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* --- Staff table (admin only) --- */}
        {isAdmin && (
          <div>
            <h2 className="mb-3 text-[18px] text-forest-deep">Staff &amp; admins</h2>
            {staff.length === 0 ? (
              <div className="rounded-xl border border-dashed border-line bg-white p-5 text-[13.5px] text-muted">
                No staff profiles yet.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-md">
                <table className="w-full text-left text-[13.5px]">
                  <thead className="bg-sand-deep text-[12px] font-extrabold uppercase tracking-wide text-forest-deep">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map((p) => (
                      <tr key={p.id} className="border-t border-sand-deep">
                        <td className="px-4 py-3 font-bold text-forest-deep">{p.full_name || "—"}</td>
                        <td className="px-4 py-3 text-muted">{p.email}</td>
                        <td className="px-4 py-3 capitalize text-muted">{p.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
