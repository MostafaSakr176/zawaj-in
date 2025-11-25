"use client"

import { useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { RefreshCw, TrendingUp } from "lucide-react"

const monthlyData = [
  { month: "Jan", newUsers: 1200, totalUsers: 28000 },
  { month: "Feb", newUsers: 1450, totalUsers: 29450 },
  { month: "Mar", newUsers: 1680, totalUsers: 31130 },
  { month: "Apr", newUsers: 1890, totalUsers: 33020 },
  { month: "May", newUsers: 2340, totalUsers: 35360 },
  { month: "Jun", newUsers: 2100, totalUsers: 37460 },
  { month: "Jul", newUsers: 1950, totalUsers: 39410 },
  { month: "Aug", newUsers: 2200, totalUsers: 41610 },
  { month: "Sep", newUsers: 2450, totalUsers: 44060 },
  { month: "Oct", newUsers: 2680, totalUsers: 46740 },
  { month: "Nov", newUsers: 2890, totalUsers: 49630 },
  { month: "Dec", newUsers: 2959, totalUsers: 52589 },
]

const weeklyData = [
  { week: "Week 1", newUsers: 680, totalUsers: 51909 },
  { week: "Week 2", newUsers: 720, totalUsers: 52629 },
  { week: "Week 3", newUsers: 810, totalUsers: 53439 },
  { week: "Week 4", newUsers: 749, totalUsers: 54188 },
]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value?: number
    dataKey?: string
    color?: string
    name?: string
  }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#DFE1E7] rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-[#0D0D12] mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-[#666D80]">
                {entry.name === "newUsers" ? "New Users" : "Total Users"}
              </span>
              <span className="text-xs font-semibold text-[#0D0D12] ml-auto">
                {entry.value?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export function UserGrowthChart() {
  const [period, setPeriod] = useState<"month" | "week">("month")
  
  const data = period === "month" ? monthlyData : weeklyData
  const xKey = period === "month" ? "month" : "week"
  
  const totalNewUsers = data.reduce((sum, item) => sum + item.newUsers, 0)
  const latestTotal = data[data.length - 1]?.totalUsers || 0

  return (
    <div className="bg-white rounded-2xl border border-[#DFE1E7] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-violet-600" />
          </div>
          <h3 className="text-base font-semibold text-[#0D0D12]">User Growth</h3>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as "month" | "week")}
            className="px-3 py-1.5 border border-[#DFE1E7] rounded-lg text-sm text-[#666D80] bg-white focus:outline-none cursor-pointer"
          >
            <option value="month">Monthly</option>
            <option value="week">Weekly</option>
          </select>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-[#666D80]" />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-8 mb-6">
        <div>
          <p className="text-xs text-[#666D80] mb-1">Total Users</p>
          <p className="text-2xl font-bold text-[#0D0D12]">{latestTotal.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-[#666D80] mb-1">New Users (Period)</p>
          <p className="text-2xl font-bold text-violet-600">+{totalNewUsers.toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-full">
          <TrendingUp className="w-3.5 h-3.5 text-green-600" />
          <span className="text-xs font-medium text-green-600">+12.5% growth</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#301B69]" />
          <span className="text-xs text-[#666D80]">Total Users</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
          <span className="text-xs text-[#666D80]">New Users</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="totalUsersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#301B69" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#301B69" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="newUsersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
            <XAxis
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666D80", fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666D80", fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666D80", fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="totalUsers"
              name="totalUsers"
              stroke="#301B69"
              strokeWidth={2}
              fill="url(#totalUsersGradient)"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="newUsers"
              name="newUsers"
              stroke="#8B5CF6"
              strokeWidth={2}
              fill="url(#newUsersGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

