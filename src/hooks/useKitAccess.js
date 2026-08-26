import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";

// Admin and staff implicitly have every kit — represented as `null` here so
// hasAccess() always returns true for them without a real query. Parents get
// a real list fetched from kit_access, protected by Row Level Security (a
// parent's session can only ever read their own rows — see
// supabase/schema.sql).
export function useKitAccess() {
  const { user, role } = useAuth();
  const [grantedIds, setGrantedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user) {
        setGrantedIds([]);
        setLoading(false);
        return;
      }
      if (role === "admin" || role === "staff") {
        setGrantedIds(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase.from("kit_access").select("kit_id").eq("parent_id", user.id);
      if (cancelled) return;
      if (error) {
        console.error("Could not load kit access", error);
        setGrantedIds([]);
      } else {
        setGrantedIds((data || []).map((r) => r.kit_id));
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user, role]);

  function hasAccess(kitId) {
    if (grantedIds === null) return true; // admin/staff
    return grantedIds.includes(kitId);
  }

  return { grantedIds, hasAccess, loading };
}
