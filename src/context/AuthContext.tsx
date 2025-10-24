"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/lib/axiosClient";
import { useLocale } from "next-intl";
import Cookies from "js-cookie";
type Profile = {
  id: string;
  fullName: string;
  email: string;
  gender: string;
  phone: string;
  chartNumber: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  termsAccepted: boolean;
  isActive: boolean;
  dateOfBirth: string | null;
  age: number | null;
  location: {
    city: string;
    country: string;
  } | null;
  origin: string | null;
  username: string | null;
  nationality: string | null;
  placeOfResidence: string | null;
  tribe: string | null;
  maritalStatus: string | null;
  numberOfChildren: number | null;
  profession: string | null;
  educationLevel: string | null;
  financialStatus: string | null;
  healthStatus: string | null;
  religiosityLevel: string | null;
  weight: string | null;
  height: string | null;
  skinColor: string | null;
  beauty: string | null;
  bodyColor: string | null;
  hairColor: string | null;
  hairType: string | null;
  eyeColor: string | null;
  houseAvailable: boolean | null;
  natureOfWork: string | null;
  bio: string | null;
  preferredAgeFrom: number | null;
  preferredAgeTo: number | null;
  preferredMinWeight: string | null;
  preferredMaxWeight: string | null;
  preferredMinHeight: string | null;
  preferredMaxHeight: string | null;
  preferredNationality: string | null;
  preferredResidencePlace: string | null;
  preferredEducationLevel: string | null;
  preferredWorkNature: string | null;
  preferredMaritalStatus: string | null;
  preferredFinancialStatus: string | null;
  preferredHasHouse: boolean | null;
  preferredHealthStatus: string | null;
  preferredBeauty: string | null;
  preferredSkinColor: string | null;
  preferredReligiosityLevel: string | null;
  preferredAcceptPolygamy: string | null;
  preferredMarriageType: string | null;
  preferredBodyColors: string[] | null;
  preferredHairColors: string[] | null;
  preferredEyeColors: string[] | null;
  partnerPreferencesBio: string | null;
  marriageType: string | null;
  acceptPolygamy: boolean | null;
  polygamyStatus: string | null;
  detailedProfile: string | null;
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
  isOnline: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  roleAssignedBy: string | null;
  roleAssignedAt: string | null;
  createdAt: string;
  updatedAt: string;
  profileCompletion: {
    percentage: number;
    completedFields: string[];
    missingFields: string[];
  };
};

type AuthContextType = {
  isAuthenticated: boolean;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  accessToken: string | null;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  profile: null,
  loading: true,
  accessToken: null,
  refreshProfile: async () => { },
  logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const Locale = useLocale()

  // Fetch profile data from /auth/me
  const refreshProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/auth/me?lang=${Locale}`);
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
    const token = Cookies.get("access_token");
    setAccessToken(token ? token : null);
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
        accessToken,
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