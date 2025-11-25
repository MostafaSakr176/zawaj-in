"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { RefreshCw } from "lucide-react"

const data = [
  { name: "Free", value: 40, color: "#2D2A5E" },
  { name: "one time", value: 15, color: "#E91E8C" },
  { name: "Gold package", value: 20, color: "#3B82F6" },
  { name: "Silver Package", value: 25, color: "#C4B5D0" },
]

export function SubscriptionDistributionChart() {
  return (
    <div className="bg-white rounded-2xl border border-[#DFE1E7] p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[#0D0D12]">Subscription Distribution</h3>
        <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
          <RefreshCw className="w-4 h-4 text-[#666D80]" />
        </button>
      </div>

      {/* Chart */}
      <div className="flex flex-col items-center flex-1 justify-center">
        <div className="relative w-44 h-44 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
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
        <div className="w-full space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-[#666D80]">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-[#0D0D12]">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
