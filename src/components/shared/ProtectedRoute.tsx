'use client';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading,profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth/sign-in");
    }
  }, [isAuthenticated, loading, router, profile]);

  if (loading || !isAuthenticated) return null; // Or a loading spinner

  return <>{children}</>;
}