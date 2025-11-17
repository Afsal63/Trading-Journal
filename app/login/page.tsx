"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await post("/auth/login", { email, password });

      // 🔥 Store token in cookie — not localStorage
      document.cookie = `token=${res.token}; path=/; max-age=${
        60 * 60 * 24 * 7
      }; sameSite=lax`;

      setMsg("Login successful!");
      router.push("/dashboard");
    } catch (err: any) {
      setMsg(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-[0_8px_25px_rgba(0,0,0,0.25)]">

        <h1 className="text-3xl font-semibold text-white text-center mb-6">
          Welcome Back
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <input
            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            disabled={loading}
            className="mt-2 w-full p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 shadow-[0_4px_15px_rgba(0,0,255,0.3)]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {msg && (
          <p className="text-center text-white/90 mt-4 bg-black/20 p-2 rounded-lg">
            {msg}
          </p>
        )}

        <div className="text-center mt-5 text-white/80">
          <p>
            Don’t have an account?{" "}
            <span
              className="text-blue-400 hover:text-blue-300 cursor-pointer font-semibold"
              onClick={() => router.push("/register")}
            >
              Register
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}
