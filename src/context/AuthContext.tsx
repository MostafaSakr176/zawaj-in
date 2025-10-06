"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/lib/axiosClient";

type Profile = {
  userId: string;
  email: string;
  fullName: string;
  gender: string;
  isVerified: boolean;
  // ...add more fields as needed
};

type AuthContextType = {
  isAuthenticated: boolean;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile data from /auth/me
  const refreshProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/me");
      setProfile(res.data.data);
    } catch (err) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Logout: clear tokens and profile
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      document.cookie = "access_token=; Max-Age=0; path=/";
      document.cookie = "refresh_token=; Max-Age=0; path=/";
    }
    setProfile(null);
  };

  useEffect(() => {
    refreshProfile();
    // Optionally, listen to storage events for multi-tab logout
    // window.addEventListener("storage", refreshProfile);
    // return () => window.removeEventListener("storage", refreshProfile);
  }, []);

  const isAuthenticated = !!profile;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        profile,
        loading,
        refreshProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}