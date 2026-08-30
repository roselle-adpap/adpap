import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function AdminLoginPage() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await loginAdmin(email, password);
    setLoading(false);
    if (res.ok) navigate("/admin");
    else setError(res.error ?? "Sign-in failed.");
  }

  return (
    <div className="section flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="eyebrow justify-center">Secretariat Access</span>
          <h1 className="mt-3 font-display text-2xl font-semibold text-navy-950">Admin Sign In</h1>
          <p className="mt-2 text-sm text-navy-700/60">Restricted to authorized ADPAP Secretariat staff.</p>
        </div>

        <form onSubmit={handleSubmit} className="card mt-8 space-y-4 p-7">
          <div>
            <label className="label">Email Address</label>
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="field-error">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {!isSupabaseConfigured && (
          <p className="mt-4 text-center text-xs text-navy-700/45">
            Demo mode: sign in with any email and the password set in{" "}
            <code className="rounded bg-mist-100 px-1 py-0.5">VITE_ADMIN_DEMO_PASSCODE</code>. Configure Supabase
            Auth for real, role-based admin access (see README).
          </p>
        )}

        <p className="mt-6 text-center text-sm text-navy-700/60">
          <Link to="/" className="font-semibold text-royal-600 hover:underline">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
