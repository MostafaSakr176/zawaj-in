"use client";

import * as React from "react";
import { z } from "zod";
import api from "@/lib/axiosClient";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "@/i18n/navigation";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Lock, HelpCircle, FileText } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function AdminLoginPage() {
  const [state, setState] = React.useState({ email: "", password: "", keepLogin: false });
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const { refreshProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = loginSchema.safeParse(state);
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Invalid data");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(
        "/auth/login",
        {
          email: state.email,
          password: state.password,
          fcmToken: "admin-dashboard",
        },
        { headers: { skipAuth: true } }
      );

      if (res?.data?.data) {
        const userData = res.data.data;

        // Check if user is admin or super_admin
        if (userData.role !== "admin" && userData.role !== "super_admin") {
          setError("Access denied. Admin privileges required.");
          return;
        }

        // Set tokens
        const tokenExpiry = state.keepLogin ? 30 : 7;
        Cookies.set("access_token", userData.access_token, {
          path: "/",
          expires: tokenExpiry,
        });
        Cookies.set("refresh_token", userData.refresh_token, {
          path: "/",
          expires: 30,
        });

        await refreshProfile();
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #F8F5FF 0%, #F0E8FF 30%, #E8E0F8 60%, #F5F0FF 100%)",
        }}
      />

      {/* Decorative clouds/shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-32 bg-white/40 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-80 h-40 bg-purple-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-1/4 w-96 h-48 bg-white/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-72 h-36 bg-purple-50/40 rounded-full blur-3xl" />
      </div>

      {/* Logo at top */}
      <div className="relative z-10 pt-8 pb-4 flex justify-center">
        <div className="flex items-center gap-1">
          <span className="text-3xl font-bold text-[#E91E8C]">زواج</span>
          <span className="text-3xl font-bold text-[#301B69]">إن</span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-xl px-8 py-10">
            {/* User Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full border-2 border-[#301B69] flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[#301B69]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-center text-[#0D0D12] mb-2">
              Welcome Back
            </h1>
            <p className="text-center text-[#666D80] text-sm mb-8">
              Glad to see you again. Log in to your account.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-[#0D0D12] mb-2">
                  Email Address <span className="text-[#DF1C41]">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={state.email}
                  onChange={(e) => setState(s => ({ ...s, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#DFE1E7] rounded-xl text-sm text-[#0D0D12] placeholder:text-[#A4ACB9] focus:outline-none focus:ring-2 focus:ring-[#301B69]/20 focus:border-[#301B69] transition-colors"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-[#0D0D12] mb-2">
                  Password <span className="text-[#DF1C41]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={state.password}
                    onChange={(e) => setState(s => ({ ...s, password: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 border border-[#DFE1E7] rounded-xl text-sm text-[#0D0D12] placeholder:text-[#A4ACB9] focus:outline-none focus:ring-2 focus:ring-[#301B69]/20 focus:border-[#301B69] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A4ACB9] hover:text-[#666D80] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Keep me logged in & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.keepLogin}
                    onChange={(e) => setState(s => ({ ...s, keepLogin: e.target.checked }))}
                    className="w-4 h-4 rounded border-[#DFE1E7] text-[#301B69] focus:ring-[#301B69]"
                  />
                  <span className="text-sm text-[#666D80]">Keep me login</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[#301B69] hover:underline font-medium"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-red-600 text-center text-sm">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-medium text-base transition-all duration-200 disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #301B69 0%, #5B3D8F 50%, #8B6DB5 100%)",
                  boxShadow: "0 4px 15px rgba(48, 27, 105, 0.3)",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>

              {/* Register Link */}
              <p className="text-center text-sm text-[#666D80]">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="text-[#301B69] font-medium hover:underline">
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 py-6 px-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <p className="text-sm text-[#666D80]">
            &copy; 2025 Tickety. All right reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="flex items-center gap-1.5 text-sm text-[#666D80] hover:text-[#0D0D12] transition-colors">
              <Lock className="w-4 h-4" />
              Privacy
            </Link>
            <Link href="/terms" className="flex items-center gap-1.5 text-sm text-[#666D80] hover:text-[#0D0D12] transition-colors">
              <FileText className="w-4 h-4" />
              Terms
            </Link>
            <Link href="/help" className="flex items-center gap-1.5 text-sm text-[#666D80] hover:text-[#0D0D12] transition-colors">
              <HelpCircle className="w-4 h-4" />
              Get help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
