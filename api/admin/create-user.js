import { createClient } from "@supabase/supabase-js";

// SUPABASE_URL falls back to VITE_SUPABASE_URL so you only have to set the
// project URL once. SUPABASE_SERVICE_ROLE_KEY must be set separately and
// MUST NEVER have a VITE_ prefix — that prefix would make Vite bundle it
// into client-side JavaScript, which would leak full database access to
// anyone who opens the browser console.
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!supabaseUrl || !serviceRoleKey) {
    res.status(500).json({
      error:
        "Server is missing Supabase configuration (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars).",
    });
    return;
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: "Missing authorization token." });
    return;
  }

  // Service-role client: full database access, bypasses Row Level Security.
  // Only ever used here, server-side — never in browser code.
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Verify the token belongs to a real, currently-valid session.
  const { data: callerData, error: callerError } = await admin.auth.getUser(token);
  if (callerError || !callerData?.user) {
    res.status(401).json({ error: "Invalid or expired session." });
    return;
  }

  // Verify the caller is actually an admin or staff member — never trust
  // a role sent from the client.
  const { data: callerProfile, error: callerProfileError } = await admin
    .from("profiles")
    .select("role")
    .eq("id", callerData.user.id)
    .single();

  if (callerProfileError || !callerProfile) {
    res.status(403).json({ error: "Could not verify your role." });
    return;
  }

  const callerRole = callerProfile.role;
  if (!["admin", "staff"].includes(callerRole)) {
    res.status(403).json({ error: "You don't have permission to create profiles." });
    return;
  }

  const { email, fullName, role, kitIds } = req.body || {};

  if (!email || typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "A valid email is required." });
    return;
  }
  if (!["parent", "staff"].includes(role)) {
    res.status(400).json({ error: "Role must be 'parent' or 'staff'." });
    return;
  }
  if (role === "staff" && callerRole !== "admin") {
    res.status(403).json({ error: "Only admins can create staff profiles." });
    return;
  }

  // Create the auth user by emailing them an invite link — they set their
  // own password, so it never passes through this server or the admin's
  // browser.
  const { data: created, error: createError } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName || null, role },
  });

  if (createError) {
    res.status(400).json({ error: createError.message });
    return;
  }

  const newUserId = created.user.id;

  // The database trigger (see supabase/schema.sql) already inserted a
  // profiles row from the invite metadata above — this update just makes
  // the role/name/creator explicit and certain.
  const { error: updateError } = await admin
    .from("profiles")
    .update({ role, full_name: fullName || null, created_by: callerData.user.id })
    .eq("id", newUserId);

  if (updateError) {
    res
      .status(500)
      .json({ error: `User invited, but finishing their profile failed: ${updateError.message}` });
    return;
  }

  if (role === "parent" && Array.isArray(kitIds) && kitIds.length > 0) {
    const rows = kitIds.map((kitId) => ({
      parent_id: newUserId,
      kit_id: kitId,
      granted_by: callerData.user.id,
    }));
    const { error: accessError } = await admin.from("kit_access").insert(rows);
    if (accessError) {
      res
        .status(500)
        .json({ error: `Profile created, but granting kit access failed: ${accessError.message}` });
      return;
    }
  }

  res.status(200).json({ success: true, userId: newUserId });
}
