"use client";
import { useState } from "react";
import Link from "next/link";
import { post } from "../lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await post("/auth/register", { email, password });
      setMsg(res.msg);
    } catch (err: any) {
      setMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-[0_8px_25px_rgba(0,0,0,0.25)]">
        
        <h1 className="text-3xl font-semibold text-white text-center mb-6">
          Create Account
        </h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          
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
            className="mt-2 w-full p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 shadow-[0_4px_15px_rgba(0,0,255,0.3)]"
          >
            Register
          </button>
        </form>

        {msg && (
          <p className="text-center text-white/90 mt-4 bg-black/20 p-2 rounded-lg">
            {msg}
          </p>
        )}

        {/* 💡 Login Link */}
        <p className="text-center text-white/80 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 underline transition-all"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}