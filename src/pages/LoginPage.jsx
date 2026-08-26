import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import LogoMark from "../components/LogoMark";

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (error) {
      setError(error.message || "Could not sign in. Check your email and password.");
      return;
    }
    const redirectTo = location.state?.from || "/";
    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-4">
      <div className="w-full max-w-[380px] rounded-2xl border border-line bg-white p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center text-center">
          <LogoMark size={48} />
          <h1 className="mt-3 text-[22px] text-forest-deep">Brainy Ladder</h1>
          <p className="mt-1 text-[13.5px] text-muted">Sign in to your kit companion</p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-4 rounded-lg border border-coral bg-coral/10 px-3 py-2.5 text-[12.5px] text-coral-deep">
            Supabase isn&apos;t configured yet. Set <code>VITE_SUPABASE_URL</code> and{" "}
            <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env.local</code> — see the README.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label htmlFor="login-email" className="mb-1 block text-[12.5px] font-bold text-forest-deep">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-line px-3 py-2.5 text-[14px] outline-none focus:border-forest"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="mb-1 block text-[12.5px] font-bold text-forest-deep">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-line px-3 py-2.5 text-[14px] outline-none focus:border-forest"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="text-[12.5px] font-bold text-coral-deep">{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-brand-gradient py-2.5 text-[14px] font-extrabold text-white disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-[12px] leading-relaxed text-muted">
          Don&apos;t have an account? Accounts are created by Brainy Ladder — ask your admin to set
          one up for you.
        </p>
      </div>
    </div>
  );
}
