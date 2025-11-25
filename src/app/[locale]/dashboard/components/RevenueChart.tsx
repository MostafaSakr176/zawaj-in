"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { RefreshCw, DollarSign, TrendingUp, TrendingDown } from "lucide-react"

const data = [
  { month: "Jan", revenue: 45000, subscriptions: 1200 },
  { month: "Feb", revenue: 52000, subscriptions: 1350 },
  { month: "Mar", revenue: 48000, subscriptions: 1280 },
  { month: "Apr", revenue: 61000, subscriptions: 1520 },
  { month: "May", revenue: 78000, subscriptions: 1890 },
  { month: "Jun", revenue: 72000, subscriptions: 1750 },
  { month: "Jul", revenue: 85000, subscriptions: 2100 },
  { month: "Aug", revenue: 92000, subscriptions: 2280 },
  { month: "Sep", revenue: 98000, subscriptions: 2450 },
  { month: "Oct", revenue: 115000, subscriptions: 2680 },
  { month: "Nov", revenue: 108000, subscriptions: 2520 },
  { month: "Dec", revenue: 128450, subscriptions: 2890 },
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
            <div className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-xs text-[#666D80]">Revenue</span>
            <span className="text-xs font-semibold text-[#0D0D12] ml-auto">
              ${payload[0]?.value?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
            <span className="text-xs text-[#666D80]">Subscriptions</span>
            <span className="text-xs font-semibold text-[#0D0D12] ml-auto">
              {payload[1]?.value?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function RevenueChart() {
  const [period, setPeriod] = useState("year")
  
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
  const avgMonthlyRevenue = totalRevenue / data.length
  const lastMonthRevenue = data[data.length - 1]?.revenue || 0
  const previousMonthRevenue = data[data.length - 2]?.revenue || 0
  const monthlyGrowth = ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1)
  const isPositiveGrowth = parseFloat(monthlyGrowth) >= 0

  return (
    <div className="bg-white rounded-2xl border border-[#DFE1E7] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-base font-semibold text-[#0D0D12]">Revenue Analytics</h3>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-1.5 border border-[#DFE1E7] rounded-lg text-sm text-[#666D80] bg-white focus:outline-none cursor-pointer"
          >
            <option value="year">This Year</option>
            <option value="quarter">This Quarter</option>
            <option value="month">This Month</option>
          </select>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-[#666D80]" />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-xs text-[#666D80] mb-1">Total Revenue (YTD)</p>
          <p className="text-xl font-bold text-[#0D0D12]">${(totalRevenue / 1000).toFixed(0)}K</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-xs text-[#666D80] mb-1">Avg Monthly Revenue</p>
          <p className="text-xl font-bold text-[#0D0D12]">${(avgMonthlyRevenue / 1000).toFixed(1)}K</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-xs text-[#666D80] mb-1">Monthly Growth</p>
          <div className="flex items-center gap-2">
            <p className={`text-xl font-bold ${isPositiveGrowth ? 'text-emerald-600' : 'text-red-600'}`}>
              {isPositiveGrowth ? '+' : ''}{monthlyGrowth}%
            </p>
            {isPositiveGrowth ? (
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#10B981]" />
          <span className="text-xs text-[#666D80]">Revenue ($)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#6366F1]" />
          <span className="text-xs text-[#666D80]">New Subscriptions</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666D80", fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666D80", fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666D80", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="subscriptions"
              stroke="#6366F1"
              strokeWidth={2}
              dot={{ fill: "#6366F1", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

