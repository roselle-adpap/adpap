import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function MemberLoginPage() {
  const { loginMember } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [membershipNumber, setMembershipNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await loginMember(email, membershipNumber);
    setLoading(false);
    if (res.ok) {
      navigate("/portal");
    } else {
      setError(res.error ?? "Sign-in failed.");
    }
  }

  return (
    <div className="section flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="eyebrow justify-center">Member Portal</span>
          <h1 className="mt-3 font-display text-2xl font-semibold text-navy-950">Sign in to your account</h1>
          <p className="mt-2 text-sm text-navy-700/60">
            Enter the email and membership number on file with the Secretariat.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card mt-8 space-y-4 p-7">
          <div>
            <label className="label">Email Address</label>
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label">Membership Number</label>
            <input
              className="input font-mono"
              placeholder="ADPAP-I-2026-00001"
              required
              value={membershipNumber}
              onChange={(e) => setMembershipNumber(e.target.value)}
            />
          </div>
          {error && <p className="field-error">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {!isSupabaseConfigured && (
          <p className="mt-4 text-center text-xs text-navy-700/45">
            Demo mode: approve an application in the Admin Dashboard first to generate a
            membership number you can sign in with.
          </p>
        )}

        <p className="mt-6 text-center text-sm text-navy-700/60">
          Not a member yet?{" "}
          <Link to="/apply" className="font-semibold text-royal-600 hover:underline">
            Apply for membership
          </Link>
        </p>
      </div>
    </div>
  );
}
