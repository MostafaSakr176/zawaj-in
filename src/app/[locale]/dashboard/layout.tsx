"use client";

import { usePathname } from "next/navigation";
import { AdminAuthGuard } from "./components/AdminAuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if current page is the login page (exclude from auth guard)
  const isLoginPage = pathname?.includes("/dashboard/login");

  // If it's the login page, render without auth guard
  if (isLoginPage) {
    return (
      <div className="h-screen overflow-hidden">
        {children}
      </div>
    );
  }

  // For all other dashboard pages, wrap with auth guard
  return (
    <AdminAuthGuard>
      <div className="h-screen overflow-hidden">
        {children}
      </div>
    </AdminAuthGuard>
  );
}
