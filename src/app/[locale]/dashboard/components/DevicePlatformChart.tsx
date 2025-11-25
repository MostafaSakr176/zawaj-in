"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { RefreshCw, Smartphone, Monitor, Apple, Play } from "lucide-react"

const deviceData = [
  { name: "Mobile", value: 68, color: "#8B5CF6", icon: Smartphone },
  { name: "Desktop", value: 24, color: "#06B6D4", icon: Monitor },
  { name: "Tablet", value: 8, color: "#F59E0B", icon: Monitor },
]

const platformData = [
  { name: "iOS", value: 45, color: "#0D0D12", icon: Apple },
  { name: "Android", value: 42, color: "#22C55E", icon: Play },
  { name: "Web", value: 13, color: "#6366F1", icon: Monitor },
]

const browserData = [
  { name: "Chrome", value: 52, color: "#4285F4" },
  { name: "Safari", value: 28, color: "#000000" },
  { name: "Firefox", value: 12, color: "#FF7139" },
  { name: "Edge", value: 5, color: "#0078D7" },
  { name: "Other", value: 3, color: "#9CA3AF" },
]

export function DevicePlatformChart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Device Distribution */}
      <div className="bg-white rounded-2xl border border-[#DFE1E7] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-[#0D0D12]">Device Type</h3>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-[#666D80]" />
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative w-36 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-[#666D80]" />
            </div>
          </div>

          <div className="space-y-3">
            {deviceData.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-sm text-[#666D80]">{item.name}</p>
                    <p className="text-lg font-bold text-[#0D0D12]">{item.value}%</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Platform Distribution */}
      <div className="bg-white rounded-2xl border border-[#DFE1E7] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-[#0D0D12]">Platform</h3>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-[#666D80]" />
          </button>
        </div>

        <div className="space-y-4">
          {platformData.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${item.color}15` }}
              >
                {item.name === "iOS" && (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill={item.color}>
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                )}
                {item.name === "Android" && (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill={item.color}>
                    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
                  </svg>
                )}
                {item.name === "Web" && (
                  <Monitor className="w-5 h-5" style={{ color: item.color }} />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#0D0D12]">{item.name}</span>
                  <span className="text-sm font-bold text-[#0D0D12]">{item.value}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Browser Distribution */}
      <div className="bg-white rounded-2xl border border-[#DFE1E7] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-[#0D0D12]">Browser</h3>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-[#666D80]" />
          </button>
        </div>

        <div className="space-y-3">
          {browserData.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm text-[#666D80]">{item.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-[#0D0D12] w-10 text-right">{item.value}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

