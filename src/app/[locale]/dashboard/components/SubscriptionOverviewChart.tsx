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
import { RefreshCw } from "lucide-react"

const data = [
  { month: "Jan", totalPayments: 80, activeSubscriptions: 60 },
  { month: "Feb", totalPayments: 100, activeSubscriptions: 85 },
  { month: "Mar", totalPayments: 90, activeSubscriptions: 75 },
  { month: "Apr", totalPayments: 110, activeSubscriptions: 95 },
  { month: "May", totalPayments: 147, activeSubscriptions: 187 },
  { month: "Jun", totalPayments: 95, activeSubscriptions: 80 },
  { month: "Jul", totalPayments: 85, activeSubscriptions: 70 },
  { month: "Aug", totalPayments: 75, activeSubscriptions: 65 },
  { month: "Sep", totalPayments: 90, activeSubscriptions: 80 },
  { month: "Oct", totalPayments: 100, activeSubscriptions: 85 },
  { month: "Nov", totalPayments: 95, activeSubscriptions: 75 },
  { month: "Dec", totalPayments: 110, activeSubscriptions: 90 },
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
      <div className="bg-white border border-[#DFE1E7] rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-[#0D0D12] mb-2">{label} 2025</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#301B69]" />
            <span className="text-xs text-[#666D80]">Total Payments</span>
            <span className="text-xs font-semibold text-[#0D0D12] ml-auto">{payload[0]?.value}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#E8E3F3]" />
            <span className="text-xs text-[#666D80]">Active Subscriptions</span>
            <span className="text-xs font-semibold text-[#0D0D12] ml-auto">{payload[1]?.value}</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function SubscriptionOverviewChart() {
  const [period, setPeriod] = useState("month")

  return (
    <div className="bg-white rounded-2xl border border-[#DFE1E7] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-[#0D0D12]">Subscriptions & Payments Overview</h3>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-1.5 border border-[#DFE1E7] rounded-lg text-sm text-[#666D80] bg-white focus:outline-none"
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="year">Year</option>
          </select>
          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
            <RefreshCw className="w-4 h-4 text-[#666D80]" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4">
        <div>
          <span className="text-2xl font-bold text-[#0D0D12]">$42,000</span>
          <span className="text-sm text-red-500 ml-2">▼ 4.5%</span>
        </div>
        <span className="text-xs text-[#666D80]">Last updated: Jun 18, 2025</span>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#301B69]" />
          <span className="text-xs text-[#666D80]">Total Payments</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#E8E3F3]" />
          <span className="text-xs text-[#666D80]">Active Subscriptions</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666D80", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666D80", fontSize: 12 }}
              domain={[0, 250]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
            <Bar dataKey="totalPayments" fill="#301B69" radius={[4, 4, 0, 0]} barSize={12} />
            <Bar dataKey="activeSubscriptions" fill="#E8E3F3" radius={[4, 4, 0, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
