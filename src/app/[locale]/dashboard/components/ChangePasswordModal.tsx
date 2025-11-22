"use client"

import { useState } from "react"
import { X, Eye, EyeOff } from "lucide-react"

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (currentPassword: string, newPassword: string) => void
}

export function ChangePasswordModal({ isOpen, onClose, onSave }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSave = () => {
    if (newPassword === confirmPassword && currentPassword) {
      onSave?.(currentPassword, newPassword)
      handleClose()
    }
  }

  const handleClose = () => {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#0D0D12]">Edit Password</h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5 text-[#666D80]" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0D0D12]">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full px-4 py-2.5 pr-10 border border-[#DFE1E7] rounded-lg text-sm text-[#0D0D12] placeholder:text-[#818898] focus:outline-none focus:ring-2 focus:ring-[#301B69]/20 focus:border-[#301B69]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#818898] hover:text-[#666D80]"
                >
                  {showCurrentPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0D0D12]">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full px-4 py-2.5 pr-10 border border-[#DFE1E7] rounded-lg text-sm text-[#0D0D12] placeholder:text-[#818898] focus:outline-none focus:ring-2 focus:ring-[#301B69]/20 focus:border-[#301B69]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#818898] hover:text-[#666D80]"
                >
                  {showNewPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0D0D12]">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full px-4 py-2.5 pr-10 border border-[#DFE1E7] rounded-lg text-sm text-[#0D0D12] placeholder:text-[#818898] focus:outline-none focus:ring-2 focus:ring-[#301B69]/20 focus:border-[#301B69]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#818898] hover:text-[#666D80]"
                >
                  {showConfirmPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 border border-[#DFE1E7] rounded-lg text-sm font-medium text-[#0D0D12] hover:bg-gray-50 transition-colors"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-[#301B69] text-white rounded-lg text-sm font-medium hover:bg-[#301B69]/90 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
