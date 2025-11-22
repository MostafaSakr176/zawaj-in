"use client"

import { useState } from "react"
import Image from "next/image"
import { NotificationModal } from "./NotificationModal"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "@/i18n/navigation"

export function DashboardHeader() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const { profile, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/dashboard/login")
  }

  // Get display name and role
  const displayName = profile?.fullName || "Admin User"
  const displayRole = profile?.role === "super_admin" ? "Super Admin" : "Admin"

  // Get initials for avatar
  const getInitials = (name: string) => {
    const names = name.split(" ")
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <header className="relative flex items-center justify-between bg-[#FFFFFF] px-8 py-5 h-[72px]">
      {/* Title */}
      <h1 className="text-xl font-semibold text-[#0D0D12]">Dashboard</h1>

      {/* Divider Line - Absolute positioned at bottom */}
      <div className="absolute bottom-0 left-8 right-8 h-px bg-[#DFE1E7]" />

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        {/* Notification Bell Container */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative flex items-center justify-center w-8 h-8 bg-[#FFFFFF] border border-[#DFE1E7] rounded-full hover:bg-[#F9FAFB] transition-colors"
          >
            <Image
              src="/icons/dashboard/bell-icon.svg"
              alt="Notifications"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            {/* Red notification dot */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#DF1C41] rounded-full" />
          </button>

          {/* Notification Modal */}
          <NotificationModal
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-[#DFE1E7]" />

        {/* Profile Container */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            {/* Avatar */}
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#6B3FA0] to-[#2D0B5A] rounded-full text-white text-xs font-semibold">
              {getInitials(displayName)}
            </div>

            {/* Profile Info */}
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-[#0D0D12] leading-[1.5em]">
                {displayName}
              </span>
              <span className="text-xs font-normal text-[#666D80] leading-[1.5em]">
                {displayRole}
              </span>
            </div>

            {/* Dropdown Arrow */}
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsProfileMenuOpen(false)}
              />

              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile?.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    Chart: {profile?.chartNumber || "N/A"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    router.push("/dashboard/settings")
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>

                <div className="border-t border-gray-100 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
