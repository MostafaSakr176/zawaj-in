"use client"

import { X } from "lucide-react"
import { Badge } from "./Badge"
import * as adminApi from "@/lib/adminApi"

interface ContactMessageDetailsModalProps {
  message: adminApi.ContactMessage | null
  isOpen: boolean
  onClose: () => void
}

export function ContactMessageDetailsModal({
  message,
  isOpen,
  onClose
}: ContactMessageDetailsModalProps) {
  if (!message) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "resolved":
        return "success"
      case "in_progress":
        return "warning"
      case "pending":
        return "neutral"
      case "closed":
        return "error"
      default:
        return "neutral"
    }
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "error"
      case "medium":
        return "warning"
      case "low":
        return "neutral"
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
          <div>
            <h2 className="text-lg font-semibold text-[#0D0D12]">Contact Message Details</h2>
            <p className="text-xs text-[#666D80] mt-1">Message ID: {message.id}</p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#F5F5F5] rounded transition-colors"
          >
            <X className="w-5 h-5 text-[#666D80]" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto h-[calc(100vh-100px)] px-8 py-6 space-y-6">


          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-[#0D0D12] mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-xs text-[#666D80] mb-1.5">Name</p>
                <p className="text-sm font-medium text-[#0D0D12]">{message.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-[#666D80] mb-1.5">Email</p>
                <p className="text-sm font-medium text-[#0D0D12] break-all">{message.email}</p>
              </div>
              {message.userId && (
                <div>
                  <p className="text-xs text-[#666D80] mb-1.5">User ID</p>
                  <p className="text-sm font-medium text-[#0D0D12]">{message.userId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Message Content */}
          <div>
            <h3 className="text-sm font-semibold text-[#0D0D12] mb-4">Message</h3>
            <div className="bg-[#F5F5F5] rounded-lg p-4">
              <p className="text-sm text-[#0D0D12] leading-relaxed whitespace-pre-wrap">
                {message.message}
              </p>
            </div>
          </div>

          {/* Ratings (if available)
          {(message.satisfactionRating !== null || message.serviceRating !== null) && (
            <div>
              <h3 className="text-sm font-semibold text-[#0D0D12] mb-4">Ratings</h3>
              <div className="grid grid-cols-2 gap-4">
                {message.satisfactionRating !== null && (
                  <div>
                    <p className="text-xs text-[#666D80] mb-1.5">Satisfaction Rating</p>
                    <p className="text-sm font-medium text-[#0D0D12]">
                      {message.satisfactionRating} / 5
                    </p>
                  </div>
                )}
                {message.serviceRating !== null && (
                  <div>
                    <p className="text-xs text-[#666D80] mb-1.5">Service Rating</p>
                    <p className="text-sm font-medium text-[#0D0D12]">
                      {message.serviceRating} / 5
                    </p>
                  </div>
                )}
              </div>
            </div>
          )} */}

          {/* Admin Response (if available) */}
          {/* {message.adminResponse && (
            <div>
              <h3 className="text-sm font-semibold text-[#0D0D12] mb-4">Admin Response</h3>
              <div className="bg-[#E8F5E9] rounded-lg p-4">
                <p className="text-sm text-[#0D0D12] leading-relaxed whitespace-pre-wrap">
                  {message.adminResponse}
                </p>
              </div>
              {message.respondedAt && (
                <p className="text-xs text-[#666D80] mt-2">
                  Responded at: {formatDate(message.respondedAt)}
                </p>
              )}
            </div>
          )} */}

          {/* Assigned Admin (if available) */}
          {/* {message.assignedToAdminId && (
            <div>
              <h3 className="text-sm font-semibold text-[#0D0D12] mb-4">Assigned To</h3>
              <div>
                <p className="text-xs text-[#666D80] mb-1.5">Admin ID</p>
                <p className="text-sm font-medium text-[#0D0D12]">{message.assignedToAdminId}</p>
                {message.assignedToAdmin && (
                  <p className="text-xs text-[#666D80] mt-1">
                    {message.assignedToAdmin.fullName || message.assignedToAdmin.email || "N/A"}
                  </p>
                )}
              </div>
            </div>
          )} */}

          {/* Timestamps */}
          <div>
            {/* <h3 className="text-sm font-semibold text-[#0D0D12] mb-4">Timestamps</h3> */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-xs text-[#666D80] mb-1.5">Sent At</p>
                <p className="text-sm font-medium text-[#0D0D12]">{formatDate(message.createdAt)}</p>
              </div>
              {/* <div>
                <p className="text-xs text-[#666D80] mb-1.5">Last Updated</p>
                <p className="text-sm font-medium text-[#0D0D12]">{formatDate(message.updatedAt)}</p>
              </div> */}
            </div>
          </div>

          {/* Metadata (if available) */}
          {message.metadata && (
            <div className="pb-4">
              <h3 className="text-sm font-semibold text-[#0D0D12] mb-4">Additional Information</h3>
              <div className="bg-[#F5F5F5] rounded-lg p-4">
                <pre className="text-xs text-[#666D80] overflow-auto">
                  {JSON.stringify(message.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

