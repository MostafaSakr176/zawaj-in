"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/lib/axiosClient";

type Profile = {
  id: string;
  fullName: string;
  email: string;
  gender: string;
  phone: string;
  chartNumber: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  dateOfBirth: string | null;
  age: number | null;
  location: {
    city: string;
    country: string;
  } | null;
  origin: string | null;
  maritalStatus: string | null;
  profession: string | null;
  weight: number | null;
  height: number | null;
  bodyColor: string | null;
  hairColor: string | null;
  hairType: string | null;
  eyeColor: string | null;
  houseAvailable: boolean | null;
  natureOfWork: string | null;
  bio: string | null;
  preferredMinWeight: number | null;
  preferredMaxWeight: number | null;
  preferredMinHeight: number | null;
  preferredMaxHeight: number | null;
  preferredBodyColors: string[] | null;
  preferredHairColors: string[] | null;
  preferredEyeColors: string[] | null;
  partnerPreferencesBio: string | null;
  marriageType: string | null;
  acceptPolygamy: boolean | null;
  religiousPractice: string | null;
  sect: string | null;
  prayerLevel: string | null;
  role: string;
  permissions: any;
  isBanned: boolean;
  banType: string | null;
  bannedAt: string | null;
  bannedUntil: string | null;
  bannedReason: string | null;
  bannedBy: string | null;
  isVerified: boolean;
  verifiedAt: string | null;
  verifiedBy: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  roleAssignedBy: string | null;
  roleAssignedAt: string | null;
  createdAt: string;
  updatedAt: string;
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