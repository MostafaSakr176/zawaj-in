"use client"

import { useState } from "react"
import { X, Loader2, Bell, Mail } from "lucide-react"
import { sendNotification, sendEmail } from "@/lib/adminApi"

interface SendNotificationModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  userName: string
  userEmail: string
  onSuccess: () => void
}

export function SendNotificationModal({
  isOpen,
  onClose,
  userId,
  userName,
  userEmail,
  onSuccess
}: SendNotificationModalProps) {
  const [notificationType, setNotificationType] = useState<"push" | "email">("push")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!subject.trim()) {
      setError("Please provide a subject")
      return
    }

    if (!message.trim()) {
      setError("Please provide a message")
      return
    }

    setLoading(true)
    try {
      if (notificationType === "email") {
        await sendEmail(userId, {
          subject: subject.trim(),
          message: message.trim()
        })
      } else {
        await sendNotification(userId, {
          subject: subject.trim(),
          message: message.trim(),
          notificationType: "push"
        })
      }
      setSuccess(true)
      onSuccess()
      // Reset form after short delay
      setTimeout(() => {
        onClose()
        setSubject("")
        setMessage("")
        setSuccess(false)
      }, 1500)
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send notification")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      setError(null)
      setSuccess(false)
      setSubject("")
      setMessage("")
    }
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
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              {notificationType === "email" ? (
                <Mail className="w-5 h-5 text-blue-600" />
              ) : (
                <Bell className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Send Notification</h2>
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
          {/* Notification Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="notificationType"
                  value="push"
                  checked={notificationType === "push"}
                  onChange={(e) => setNotificationType(e.target.value as "push")}
                  className="w-4 h-4 text-[#301B69] focus:ring-[#301B69]"
                />
                <Bell className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Push Notification</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="notificationType"
                  value="email"
                  checked={notificationType === "email"}
                  onChange={(e) => setNotificationType(e.target.value as "email")}
                  className="w-4 h-4 text-[#301B69] focus:ring-[#301B69]"
                />
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Email</span>
              </label>
            </div>
            {notificationType === "email" && (
              <p className="text-xs text-gray-500 mt-1">Will be sent to: {userEmail}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#301B69] focus:border-transparent outline-none"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message..."
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

          {/* Success */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-600 text-sm">Notification sent successfully!</p>
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
              disabled={loading || success}
              className="flex-1 px-4 py-2.5 bg-[#301B69] text-white rounded-lg hover:bg-[#301B69]/90 transition-colors font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : success ? (
                "Sent!"
              ) : (
                "Send Notification"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
