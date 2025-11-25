"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Users, RefreshCw } from "lucide-react"

const genderData = [
  { name: "Male", value: 52, color: "#6366F1" },
  { name: "Female", value: 48, color: "#EC4899" },
]

const ageData = [
  { age: "18-24", users: 8500, percentage: 20 },
  { age: "25-34", users: 14800, percentage: 35 },
  { age: "35-44", users: 10200, percentage: 24 },
  { age: "45-54", users: 5100, percentage: 12 },
  { age: "55+", users: 3800, percentage: 9 },
]

const maritalStatusData = [
  { name: "Single", value: 35, color: "#10B981" },
  { name: "Divorced", value: 28, color: "#F59E0B" },
  { name: "Widowed", value: 22, color: "#8B5CF6" },
  { name: "Never Married", value: 15, color: "#06B6D4" },
]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value?: number
    payload?: {
      age?: string
      users?: number
      percentage?: number
    }
  }>
}

const AgeTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length && payload[0].payload) {
    const data = payload[0].payload
    return (
      <div className="bg-white border border-[#DFE1E7] rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-[#0D0D12] mb-1">{data.age} years</p>
        <p className="text-xs text-[#666D80]">Users: {data.users?.toLocaleString()}</p>
        <p className="text-xs text-[#666D80]">{data.percentage}% of total</p>
      </div>
    )
  }
  return null
}

export function DemographicsCharts() {
  const totalUsers = ageData.reduce((sum, item) => sum + item.users, 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Gender Distribution */}
      <div className="bg-white rounded-2xl border border-[#DFE1E7] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-[#0D0D12]">Gender Distribution</h3>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-[#666D80]" />
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative w-36 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#666D80]" />
            </div>
          </div>

          <div className="space-y-3">
            {genderData.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <p className="text-sm font-medium text-[#0D0D12]">{item.name}</p>
                  <p className="text-lg font-bold text-[#0D0D12]">{item.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Age Distribution */}
      <div className="bg-white rounded-2xl border border-[#DFE1E7] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-[#0D0D12]">Age Distribution</h3>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-[#666D80]" />
          </button>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F0F0F0" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="age" 
                type="category" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#666D80", fontSize: 12 }}
                width={50}
              />
              <Tooltip content={<AgeTooltip />} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
              <Bar 
                dataKey="users" 
                fill="#8B5CF6" 
                radius={[0, 4, 4, 0]} 
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-[#666D80]">Total Users: <span className="font-semibold text-[#0D0D12]">{totalUsers.toLocaleString()}</span></p>
        </div>
      </div>

      {/* Marital Status Distribution */}
      <div className="bg-white rounded-2xl border border-[#DFE1E7] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-[#0D0D12]">Marital Status</h3>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-[#666D80]" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={maritalStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {maritalStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-2">
            {maritalStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-[#666D80]">{item.name}</span>
                </div>
                <span className="text-xs font-semibold text-[#0D0D12]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

