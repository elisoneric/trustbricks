"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#081526] px-4 font-sans selection:bg-[#E8600A]">
      <div className="absolute w-[300px] h-[300px] bg-[#E8600A]/10 blur-[80px] rounded-full top-[15%] left-[20%] pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] bg-indigo-500/10 blur-[90px] rounded-full bottom-[15%] right-[20%] pointer-events-none" />

      <div className="w-full max-w-[420px] bg-[#0D1F3C]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative z-10 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-gradient-to-tr from-[#E8600A] to-[#FF8C42] rounded-2xl flex items-center justify-center shadow-lg shadow-[#E8600A]/20">
            <Lock className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
            Admin Verification
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access the Trust Bricks control panel.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest pl-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@trustbrickspropertieslimited.com.ng"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/50 focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest pl-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/50 focus:border-transparent transition-all"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#E8600A] hover:bg-[#D4530A] text-white font-bold text-sm rounded-xl cursor-pointer shadow-lg shadow-[#E8600A]/10 transition-all duration-300 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-[10px] text-slate-500">
          Authorized personnel only.
        </div>
      </div>
    </div>
  );
}
