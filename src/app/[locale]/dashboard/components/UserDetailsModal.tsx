"use client"

import { X, Edit, ShieldCheck, Ban, Bell, Trash2, UserX } from "lucide-react"
import Image from "next/image"
import { Badge } from "./Badge"

interface UserDetails {
  id: string
  name: string
  phoneNumber: string
  email: string
  joinedIn: string
  subscription: string
  nationality: string
  nationalityFlag?: string
  placeOfResidence: string
  maritalStatus: string
  age: string
  skinColor: string
  height: string
  weight: string
  hairType: string
  hairColor: string
  eyeColor: string
  educationLevel: string
  occupation: string
  about: string
  partnerPreferences: string
  avatar?: string
  gender?: string
  chartNumber?: string
  isVerified?: boolean
  isBanned?: boolean
  status?: "Active" | "Suspended" | "Banned" | "Deleted"
  rawId?: string
}

interface UserDetailsModalProps {
  user: UserDetails | null
  isOpen: boolean
  onClose: () => void
  onVerify?: (userId: string) => void
  onBan?: (userId: string) => void
  onUnban?: (userId: string) => void
  onDelete?: (userId: string) => void
  onSendNotification?: (userId: string) => void
}

export function UserDetailsModal({
  user,
  isOpen,
  onClose,
  onVerify,
  onBan,
  onUnban,
  onDelete,
  onSendNotification
}: UserDetailsModalProps) {
  if (!user) return null

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case "Active":
        return "success"
      case "Suspended":
        return "warning"
      case "Banned":
      case "Deleted":
        return "error"
      default:
        return "neutral"
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-8 py-6 border-b border-[#DFE1E7]">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-[#6B3FA0] to-[#2D0B5A]">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-semibold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Name and ID */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-[#0D0D12]">{user.name}</h2>
                {user.isVerified && (
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                )}
              </div>
              <p className="text-xs text-[#666D80]">
                {user.chartNumber || `ID: ${user.id}`}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {user.status && (
                  <Badge variant={getStatusBadgeVariant(user.status)} showDot>
                    {user.status}
                  </Badge>
                )}
                {user.gender && (
                  <span className="text-xs text-gray-500 capitalize">{user.gender}</span>
                )}
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#F5F5F5] rounded transition-colors"
          >
            <X className="w-5 h-5 text-[#666D80]" />
          </button>
        </div>

        {/* Action Buttons */}
        {(onVerify || onBan || onUnban || onDelete || onSendNotification) && user.rawId && (
          <div className="px-8 py-4 border-b border-[#DFE1E7] flex items-center gap-2 flex-wrap">
            {!user.isVerified && onVerify && (
              <button
                onClick={() => onVerify(user.rawId!)}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                Verify User
              </button>
            )}

            {onSendNotification && (
              <button
                onClick={() => onSendNotification(user.rawId!)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors"
              >
                <Bell className="w-4 h-4" />
                Send Notification
              </button>
            )}

            {user.isBanned ? (
              onUnban && (
                <button
                  onClick={() => onUnban(user.rawId!)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                >
                  <UserX className="w-4 h-4" />
                  Unban User
                </button>
              )
            ) : (
              onBan && (
                <button
                  onClick={() => onBan(user.rawId!)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm hover:bg-orange-100 transition-colors"
                >
                  <Ban className="w-4 h-4" />
                  Ban User
                </button>
              )
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(user.rawId!)}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete User
              </button>
            )}
          </div>
        )}

        {/* Content - Scrollable */}
        <div className="overflow-y-auto h-[calc(100vh-180px)] px-8 py-6 space-y-8">
          {/* User Information */}
          <div>
            <h3 className="text-sm font-semibold text-[#0D0D12] mb-4">User information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
              <div>
                <p className="text-xs text-[#666D80] mb-1.5">Phone number</p>
                <p className="text-sm font-medium text-[#0D0D12]">{user.phoneNumber}</p>
              </div>
              <div>
                <p className="text-xs text-[#666D80] mb-1.5">Email</p>
                <p className="text-sm font-medium text-[#0D0D12] break-all">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-[#666D80] mb-1.5">Joined in</p>
                <p className="text-sm font-medium text-[#0D0D12]">{user.joinedIn}</p>
              </div>
              <div>
                <p className="text-xs text-[#666D80] mb-1.5">Subscriptions</p>
                <p className="text-sm font-medium text-[#0D0D12]">{user.subscription}</p>
              </div>
            </div>
          </div>

          {/* Housing and Social Status */}
          <div>
            <h3 className="text-sm font-semibold text-[#0D0D12] mb-4">Housing and Social Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
              <div>
                <p className="text-xs text-[#666D80] mb-1.5">Nationality</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#301B69]">{user.nationality}</p>
                  {user.nationalityFlag && (
                    <span className="text-base">{user.nationalityFlag}</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-[#666D80] mb-1.5">Place of Residence</p>
                <p className="text-sm font-medium text-[#0D0D12]">{user.placeOfResidence}</p>
              </div>
              <div>
                <p className="text-xs text-[#666D80] mb-1.5">Marital Status</p>
                <p className="text-sm font-medium text-[#0D0D12]">{user.maritalStatus}</p>
              </div>
              <div>
                <p className="text-xs text-[#666D80] mb-1.5">Age</p>
                <p className="text-sm font-medium text-[#0D0D12]">{user.age}</p>
              </div>
            </div>
          </div>

          {/* Appearance and Body */}
          <div>
            <h3 className="text-sm font-semibold text-[#0D0D12] mb-4">Appearance and Body</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
              <div>
                <p className="text-xs text-[#666D80] mb-1.5">Skin Color</p>
                <p className="text-sm font-medium text-[#0D0D12]">{user.skinColor}</p>
              </div>
              <div>
                <p className="text-xs text-[#666D80] mb-1.5">Height</p>
                <p className="text-sm font-medium text-[#0D0D12]">{user.height}</p>
              </div>
              <div>
                <p className="text-xs text-[#666D80] mb-1.5">Weight</p>
                <p className="text-sm font-medium text-[#0D0D12]">{user.weight}</p>
              </div>
              <div>
                <p className="text-xs text-[#666D80] mb-1.5">Hair Type</p>
                <p className="text-sm font-medium text-[#0D0D12]">{user.hairType}</p>
              </div>
              <div>
                <p className="text-xs text-[#666D80] mb-1.5">Hair Color</p>
                <p className="text-sm font-medium text-[#0D0D12]">{user.hairColor}</p>
              </div>
              <div>
                <p className="text-xs text-[#666D80] mb-1.5">Eye Color</p>
                <p className="text-sm font-medium text-[#0D0D12]">{user.eyeColor}</p>
              </div>
            </div>
          </div>

          {/* Education and Work */}
          <div>
            <h3 className="text-sm font-semibold text-[#0D0D12] mb-4">Education and Work</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <p className="text-xs text-[#666D80] mb-1.5">Education Level</p>
                <p className="text-sm font-medium text-[#0D0D12]">{user.educationLevel}</p>
              </div>
              <div>
                <p className="text-xs text-[#666D80] mb-1.5">Occupation</p>
                <p className="text-sm font-medium text-[#0D0D12]">{user.occupation}</p>
              </div>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-[#0D0D12] mb-4">About</h3>
            <div>
              <p className="text-xs text-[#666D80] mb-1.5">About Myself</p>
              <p className="text-sm font-medium text-[#0D0D12] leading-relaxed">{user.about}</p>
            </div>
          </div>

          {/* Partner Preferences */}
          <div className="pb-4">
            <h3 className="text-sm font-semibold text-[#0D0D12] mb-4">Partner Preferences</h3>
            <div>
              <p className="text-xs text-[#666D80] mb-1.5">Partner Description</p>
              <p className="text-sm font-medium text-[#301B69] leading-relaxed">{user.partnerPreferences}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
