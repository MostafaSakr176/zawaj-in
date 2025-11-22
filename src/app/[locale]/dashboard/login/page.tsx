"use client";

import * as React from "react";
import { z } from "zod";
import api from "@/lib/axiosClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Label from "@/components/ui/label";
import { FormField } from "@/components/ui/form";
import { TextField } from "@/components/ui/text-field";
import { PasswordInput } from "@/components/ui/password-input";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";

const MailIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.5 4.375L10 11.25L2.5 4.375"
      stroke="#AFAFAF"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 4.375H17.5V15C17.5 15.1658 17.4342 15.3247 17.3169 15.4419C17.1997 15.5592 17.0408 15.625 16.875 15.625H3.125C2.95924 15.625 2.80027 15.5592 2.68306 15.4419C2.56585 15.3247 2.5 15.1658 2.5 15V4.375Z"
      stroke="#AFAFAF"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.63602 10L2.69238 15.4484"
      stroke="#AFAFAF"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.307 15.4484L11.3633 10"
      stroke="#AFAFAF"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LockIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 12.5C10.8629 12.5 11.5625 11.8004 11.5625 10.9375C11.5625 10.0746 10.8629 9.375 10 9.375C9.13706 9.375 8.4375 10.0746 8.4375 10.9375C8.4375 11.8004 9.13706 12.5 10 12.5Z"
      stroke="#AFAFAF"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 12.5V14.375"
      stroke="#AFAFAF"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.25 6.875H3.75C3.40482 6.875 3.125 7.15482 3.125 7.5V16.25C3.125 16.5952 3.40482 16.875 3.75 16.875H16.25C16.5952 16.875 16.875 16.5952 16.875 16.25V7.5C16.875 7.15482 16.5952 6.875 16.25 6.875Z"
      stroke="#AFAFAF"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.1875 6.875V4.0625C7.1875 3.31658 7.48382 2.60121 8.01126 2.07376C8.53871 1.54632 9.25408 1.25 10 1.25C10.7459 1.25 11.4613 1.54632 11.9887 2.07376C12.5162 2.60121 12.8125 3.31658 12.8125 4.0625V6.875"
      stroke="#AFAFAF"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function AdminLoginPage() {
  const [state, setState] = React.useState({ email: "", password: "" });
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
        Cookies.set("access_token", userData.access_token, {
          path: "/",
          expires: 7,
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

  const emailError =
    state.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)
      ? "Invalid email format"
      : undefined;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Zawajin Admin</h1>
          <p className="text-white/60 text-sm">Dashboard Management Portal</p>
        </div>

        <Card className="rounded-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <form onSubmit={handleSubmit}>
            <CardHeader className="pb-4 pt-8">
              <CardTitle className="text-center text-xl font-bold text-[#1D1B23]">
                Admin Sign In
              </CardTitle>
              <p className="text-center text-sm text-gray-500 mt-1">
                Enter your credentials to access the dashboard
              </p>
            </CardHeader>
            <CardContent className="space-y-5 px-8 pb-8">
              <FormField
                label={<Label className="sr-only">Email</Label>}
                error={emailError}
              >
                <TextField
                  placeholder="admin@zawajin.com"
                  startAdornment={MailIcon}
                  endAdornment={null}
                  value={state.email}
                  onChange={(e) =>
                    setState((s) => ({ ...s, email: e.target.value }))
                  }
                  className="text-[1rem]"
                  aria-label="Email"
                />
              </FormField>

              <FormField
                label={<Label className="sr-only">Password</Label>}
              >
                <PasswordInput
                  placeholder="Enter your password"
                  startAdornment={LockIcon}
                  togglePosition="end"
                  value={state.password}
                  onChange={(e) =>
                    setState((s) => ({ ...s, password: e.target.value }))
                  }
                  className="text-[1rem]"
                  aria-label="Password"
                />
              </FormField>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-center text-sm">{error}</p>
                </div>
              )}

              <div className="pt-2">
                <Button
                  className="w-full rounded-xl bg-gradient-to-r from-[#1a1a2e] to-[#16213e] hover:from-[#16213e] hover:to-[#0f3460] py-6 text-base font-semibold shadow-lg transition-all duration-200"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
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
                    "Sign In to Dashboard"
                  )}
                </Button>
              </div>

              <div className="pt-4 text-center">
                <p className="text-xs text-gray-400">
                  This portal is for authorized administrators only.
                  <br />
                  Unauthorized access attempts are logged.
                </p>
              </div>
            </CardContent>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-white/40 text-xs mt-6">
          Zawajin Matrimonial Platform
        </p>
      </div>
    </div>
  );
}
