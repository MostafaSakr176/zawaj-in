"use client"

import { cn } from "@/lib/utils"
import { Settings } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  isRead: boolean
}

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Report",
    message: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum",
    time: "1h ago",
    isRead: false,
  },
  {
    id: "2",
    title: "New Report",
    message: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum",
    time: "1h ago",
    isRead: false,
  },
  {
    id: "3",
    title: "New Report",
    message: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum",
    time: "1h ago",
    isRead: false,
  },
  {
    id: "4",
    title: "New Report",
    message: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum",
    time: "1h ago",
    isRead: false,
  },
]

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute right-0 top-8 z-50 w-[350px] bg-white border border-[#DFE1E7] rounded-2xl shadow-lg overflow-hidden -translate-x-8">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="text-lg font-semibold text-[#0D0D12]">Notifications</h3>
          <button
            className="text-[#A4ACB9] hover:text-[#666D80] transition-colors"
            onClick={() => {/* Settings */}}
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-[400px] overflow-y-auto">
          {mockNotifications.map((notification, index) => (
            <div
              key={notification.id}
              className={cn(
                "relative flex gap-3 px-5 py-4 hover:bg-[#F9FAFB] transition-colors cursor-pointer",
                index !== mockNotifications.length - 1 && "border-b border-[#F0F0F0]"
              )}
            >
              {/* Alert Icon */}
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 bg-[#EAE8F0] rounded-lg">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 6V10M10 14H10.01M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z" stroke="#301B69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-[#0D0D12] mb-1">
                  {notification.title}
                </h4>
                <p className="text-xs text-[#666D80] mb-2 line-clamp-2 leading-relaxed">
                  {notification.message}
                </p>
                <span className="text-xs text-[#A4ACB9]">
                  {notification.time}
                </span>
              </div>

              {/* Red Dot Indicator */}
              {!notification.isRead && (
                <div className="absolute top-4 right-5">
                  <div className="w-2 h-2 bg-[#DF1C41] rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 px-5 py-4 border-t border-[#F0F0F0]">
          <button className="text-sm font-medium text-[#666D80] hover:text-[#0D0D12] transition-colors">
            Mark all as read
          </button>
          <button className="px-4 py-2 bg-[#301B69] text-white text-sm font-medium rounded-lg hover:bg-[#301B69]/90 transition-colors">
            View All Notifications
          </button>
        </div>
      </div>
    </>
  )
}
