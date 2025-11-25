"use client"

import { RefreshCw, UserPlus, CreditCard, Heart, MessageCircle, Shield, Bell } from "lucide-react"

interface Activity {
  id: string
  type: "signup" | "subscription" | "match" | "message" | "verification" | "notification"
  title: string
  description: string
  timestamp: string
  user?: {
    name: string
    avatar?: string
  }
}

const activities: Activity[] = [
  {
    id: "1",
    type: "signup",
    title: "New User Registration",
    description: "Ahmed Mohamed joined from Saudi Arabia",
    timestamp: "2 min ago",
    user: { name: "Ahmed Mohamed" }
  },
  {
    id: "2",
    type: "subscription",
    title: "New Gold Subscription",
    description: "Sara Ali upgraded to Gold package - $29.99/month",
    timestamp: "5 min ago",
    user: { name: "Sara Ali" }
  },
  {
    id: "3",
    type: "match",
    title: "New Match Created",
    description: "Omar Hassan matched with Fatima Khaled",
    timestamp: "12 min ago",
  },
  {
    id: "4",
    type: "verification",
    title: "Profile Verified",
    description: "Layla Ahmad's profile was verified",
    timestamp: "18 min ago",
    user: { name: "Layla Ahmad" }
  },
  {
    id: "5",
    type: "subscription",
    title: "Subscription Renewal",
    description: "Mohammed Ali renewed Silver package",
    timestamp: "25 min ago",
    user: { name: "Mohammed Ali" }
  },
  {
    id: "6",
    type: "signup",
    title: "New User Registration",
    description: "Youssef Ibrahim joined from Egypt",
    timestamp: "32 min ago",
    user: { name: "Youssef Ibrahim" }
  },
  {
    id: "7",
    type: "notification",
    title: "System Notification Sent",
    description: "Promotional campaign sent to 5,420 users",
    timestamp: "45 min ago",
  },
  {
    id: "8",
    type: "message",
    title: "High Activity Alert",
    description: "Message volume spike detected - 2,340 messages/hour",
    timestamp: "1 hr ago",
  },
]

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "signup":
      return { icon: UserPlus, bgColor: "bg-violet-100", iconColor: "text-violet-600" }
    case "subscription":
      return { icon: CreditCard, bgColor: "bg-emerald-100", iconColor: "text-emerald-600" }
    case "match":
      return { icon: Heart, bgColor: "bg-pink-100", iconColor: "text-pink-600" }
    case "message":
      return { icon: MessageCircle, bgColor: "bg-blue-100", iconColor: "text-blue-600" }
    case "verification":
      return { icon: Shield, bgColor: "bg-amber-100", iconColor: "text-amber-600" }
    case "notification":
      return { icon: Bell, bgColor: "bg-indigo-100", iconColor: "text-indigo-600" }
    default:
      return { icon: Bell, bgColor: "bg-gray-100", iconColor: "text-gray-600" }
  }
}

export function RecentActivityFeed() {
  return (
    <div className="bg-white rounded-2xl border border-[#DFE1E7] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-[#0D0D12]">Recent Activity</h3>
          <p className="text-xs text-[#666D80]">Real-time platform activity</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-green-600">Live</span>
          </span>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-[#666D80]" />
          </button>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
        {activities.map((activity, index) => {
          const { icon: Icon, bgColor, iconColor } = getActivityIcon(activity.type)
          
          return (
            <div key={activity.id} className="flex items-start gap-3">
              {/* Icon */}
              <div className={`p-2 rounded-lg ${bgColor} flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${iconColor}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-[#0D0D12]">{activity.title}</p>
                    <p className="text-xs text-[#666D80] mt-0.5">{activity.description}</p>
                  </div>
                  <span className="text-xs text-[#A4ACB9] whitespace-nowrap">{activity.timestamp}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* View All Button */}
      <button className="w-full mt-6 py-2.5 text-sm font-medium text-[#301B69] bg-[#F8F7FC] rounded-lg hover:bg-[#EAE8F0] transition-colors">
        View All Activity
      </button>
    </div>
  )
}

