"use client"

import { useState } from "react"
import { X, Loader2, AlertTriangle } from "lucide-react"
import { banUser } from "@/lib/adminApi"

interface BanUserModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  userName: string
  onSuccess: () => void
}

export function BanUserModal({ isOpen, onClose, userId, userName, onSuccess }: BanUserModalProps) {
  const [banType, setBanType] = useState<"temporary" | "permanent">("temporary")
  const [reason, setReason] = useState("")
  const [bannedUntil, setBannedUntil] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!reason.trim()) {
      setError("Please provide a reason for the ban")
      return
    }

    if (banType === "temporary" && !bannedUntil) {
      setError("Please select an end date for the temporary ban")
      return
    }

    setLoading(true)
    try {
      await banUser(userId, {
        banType,
        reason: reason.trim(),
        bannedUntil: banType === "temporary" ? new Date(bannedUntil).toISOString() : undefined
      })
      onSuccess()
      onClose()
      // Reset form
      setBanType("temporary")
      setReason("")
      setBannedUntil("")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to ban user")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      setError(null)
      setBanType("temporary")
      setReason("")
      setBannedUntil("")
    }
  }

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Ban User</h2>
              <p className="text-sm text-gray-500">{userName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Ban Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ban Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="banType"
                  value="temporary"
                  checked={banType === "temporary"}
                  onChange={(e) => setBanType(e.target.value as "temporary")}
                  className="w-4 h-4 text-[#301B69] focus:ring-[#301B69]"
                />
                <span className="text-sm text-gray-700">Temporary</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="banType"
                  value="permanent"
                  checked={banType === "permanent"}
                  onChange={(e) => setBanType(e.target.value as "permanent")}
                  className="w-4 h-4 text-[#301B69] focus:ring-[#301B69]"
                />
                <span className="text-sm text-gray-700">Permanent</span>
              </label>
            </div>
          </div>

          {/* Ban Until (for temporary) */}
          {banType === "temporary" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ban Until
              </label>
              <input
                type="date"
                value={bannedUntil}
                onChange={(e) => setBannedUntil(e.target.value)}
                min={getMinDate()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#301B69] focus:border-transparent outline-none"
              />
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Ban
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this user is being banned..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#301B69] focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Banning...
                </>
              ) : (
                "Ban User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
