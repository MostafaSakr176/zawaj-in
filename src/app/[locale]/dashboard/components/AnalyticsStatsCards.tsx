"use client"

import { StatsCard } from "./StatsCard"
import { Users, TrendingUp, CreditCard, Activity, Eye, Heart, MessageCircle, Clock } from "lucide-react"

export function AnalyticsStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        iconSrc="/icons/dashboard/users-icon.svg"
        label="Total Users"
        value="42,589"
        change={12.5}
        changeType="increase"
      />
      <StatsCard
        iconSrc="/icons/dashboard/user-plus-icon.svg"
        label="Active Users (DAU)"
        value="8,234"
        change={8.3}
        changeType="increase"
      />
      <StatsCard
        iconSrc="/icons/dashboard/dollar-icon.svg"
        label="Monthly Revenue"
        value="$128,450"
        change={15.2}
        changeType="increase"
      />
      <StatsCard
        iconSrc="/icons/dashboard/credit-card-icon.svg"
        label="Conversion Rate"
        value="4.8%"
        change={2.1}
        changeType="increase"
      />
    </div>
  )
}

// Additional stats row for engagement metrics
export function EngagementStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="flex flex-col gap-4 p-4 pb-3.5 bg-white border border-[#DFE1E7] rounded-2xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-10 h-10 bg-violet-50 border border-[#DFE1E7] rounded-[10px]">
            <Eye className="w-5 h-5 text-violet-600" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-normal text-[#666D80]">Profile Views</span>
          <span className="text-lg font-semibold text-[#0D0D12]">1.2M</span>
          <span className="text-xs text-green-600">+18.2% from last month</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 pb-3.5 bg-white border border-[#DFE1E7] rounded-2xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-10 h-10 bg-pink-50 border border-[#DFE1E7] rounded-[10px]">
            <Heart className="w-5 h-5 text-pink-600" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-normal text-[#666D80]">Total Matches</span>
          <span className="text-lg font-semibold text-[#0D0D12]">28,456</span>
          <span className="text-xs text-green-600">+24.5% from last month</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 pb-3.5 bg-white border border-[#DFE1E7] rounded-2xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-50 border border-[#DFE1E7] rounded-[10px]">
            <MessageCircle className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-normal text-[#666D80]">Messages Sent</span>
          <span className="text-lg font-semibold text-[#0D0D12]">456K</span>
          <span className="text-xs text-green-600">+9.8% from last month</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 pb-3.5 bg-white border border-[#DFE1E7] rounded-2xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-10 h-10 bg-amber-50 border border-[#DFE1E7] rounded-[10px]">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-normal text-[#666D80]">Avg. Session Duration</span>
          <span className="text-lg font-semibold text-[#0D0D12]">12m 34s</span>
          <span className="text-xs text-green-600">+3.2% from last month</span>
        </div>
      </div>
    </div>
  )
}

