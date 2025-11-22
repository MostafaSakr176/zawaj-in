"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { RefreshCw } from "lucide-react"

const data = [
  { name: "Free", value: 40, color: "#0D0D12" },
  { name: "One Time", value: 15, color: "#E91E8C" },
  { name: "Gold package", value: 20, color: "#F59E0B" },
  { name: "Silver Package", value: 25, color: "#A855F7" },
]

export function SubscriptionDistributionChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="bg-white rounded-2xl border border-[#DFE1E7] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-[#0D0D12]">Subscription Distribution</h3>
        <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
          <RefreshCw className="w-4 h-4 text-[#666D80]" />
        </button>
      </div>

      {/* Chart */}
      <div className="flex items-center gap-6">
        <div className="relative w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-[#0D0D12]">4000</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-[#666D80]">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-[#0D0D12]">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
