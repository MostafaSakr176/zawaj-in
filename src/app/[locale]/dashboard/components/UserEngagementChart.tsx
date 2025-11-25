"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { RefreshCw, Activity } from "lucide-react"

const dailyData = [
  { day: "Mon", dau: 6800, sessions: 12400, likes: 45000 },
  { day: "Tue", dau: 7200, sessions: 13100, likes: 48500 },
  { day: "Wed", dau: 7500, sessions: 13800, likes: 51200 },
  { day: "Thu", dau: 7800, sessions: 14200, likes: 53800 },
  { day: "Fri", dau: 8500, sessions: 16200, likes: 62000 },
  { day: "Sat", dau: 9200, sessions: 18500, likes: 72000 },
  { day: "Sun", dau: 8800, sessions: 17200, likes: 68000 },
]

const hourlyData = [
  { hour: "6am", dau: 1200, sessions: 1800, likes: 5200 },
  { hour: "9am", dau: 3200, sessions: 4800, likes: 14500 },
  { hour: "12pm", dau: 4500, sessions: 6800, likes: 21000 },
  { hour: "3pm", dau: 4200, sessions: 6200, likes: 19500 },
  { hour: "6pm", dau: 5800, sessions: 9200, likes: 32000 },
  { hour: "9pm", dau: 7200, sessions: 12500, likes: 45000 },
  { hour: "12am", dau: 3500, sessions: 5200, likes: 18000 },
]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value?: number
    dataKey?: string
    color?: string
  }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#DFE1E7] rounded-lg shadow-lg p-3 min-w-[160px]">
        <p className="text-sm font-semibold text-[#0D0D12] mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
              <span className="text-xs text-[#666D80]">Active Users</span>
            </div>
            <span className="text-xs font-semibold text-[#0D0D12]">
              {payload[0]?.value?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#06B6D4]" />
              <span className="text-xs text-[#666D80]">Sessions</span>
            </div>
            <span className="text-xs font-semibold text-[#0D0D12]">
              {payload[1]?.value?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#F472B6]" />
              <span className="text-xs text-[#666D80]">Likes</span>
            </div>
            <span className="text-xs font-semibold text-[#0D0D12]">
              {payload[2]?.value?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function UserEngagementChart() {
  const [period, setPeriod] = useState<"daily" | "hourly">("daily")
  
  const data = period === "daily" ? dailyData : hourlyData
  const xKey = period === "daily" ? "day" : "hour"

  const avgDau = Math.round(data.reduce((sum, item) => sum + item.dau, 0) / data.length)
  const totalSessions = data.reduce((sum, item) => sum + item.sessions, 0)
  const totalLikes = data.reduce((sum, item) => sum + item.likes, 0)

  return (
    <div className="bg-white rounded-2xl border border-[#DFE1E7] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-50 rounded-lg">
            <Activity className="w-5 h-5 text-cyan-600" />
          </div>
          <h3 className="text-base font-semibold text-[#0D0D12]">User Engagement</h3>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as "daily" | "hourly")}
            className="px-3 py-1.5 border border-[#DFE1E7] rounded-lg text-sm text-[#666D80] bg-white focus:outline-none cursor-pointer"
          >
            <option value="daily">Daily (This Week)</option>
            <option value="hourly">Hourly (Today)</option>
          </select>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-[#666D80]" />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-xs text-[#666D80] mb-1">Avg. DAU</p>
          <p className="text-lg font-bold text-[#8B5CF6]">{avgDau.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[#666D80] mb-1">Total Sessions</p>
          <p className="text-lg font-bold text-[#06B6D4]">{totalSessions.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[#666D80] mb-1">Total Likes</p>
          <p className="text-lg font-bold text-[#F472B6]">{totalLikes.toLocaleString()}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
          <span className="text-xs text-[#666D80]">Active Users</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#06B6D4]" />
          <span className="text-xs text-[#666D80]">Sessions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#F472B6]" />
          <span className="text-xs text-[#666D80]">Likes</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
            <XAxis
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666D80", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666D80", fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
            <Bar dataKey="dau" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={16} />
            <Bar dataKey="sessions" fill="#06B6D4" radius={[4, 4, 0, 0]} barSize={16} />
            <Bar dataKey="likes" fill="#F472B6" radius={[4, 4, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

