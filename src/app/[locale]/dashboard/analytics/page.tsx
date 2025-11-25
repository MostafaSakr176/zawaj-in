"use client"

import { DashboardHeader } from "../components/DashboardHeader"
import { DashboardSidebar } from "../components/DashboardSidebar"
import { Breadcrumb } from "../components/Breadcrumb"
import { AnalyticsStatsCards, EngagementStatsCards } from "../components/AnalyticsStatsCards"
import { UserGrowthChart } from "../components/UserGrowthChart"
import { RevenueChart } from "../components/RevenueChart"
import { UserEngagementChart } from "../components/UserEngagementChart"
import { SubscriptionDistributionChart } from "../components/SubscriptionDistributionChart"
import { DemographicsCharts } from "../components/DemographicsCharts"
import { DevicePlatformChart } from "../components/DevicePlatformChart"
import { VisitorsByCountryMap } from "../components/VisitorsByCountryMap"
import { TopCountriesTable } from "../components/TopCountriesTable"
import { RecentActivityFeed } from "../components/RecentActivityFeed"
import { FileText, Download, Calendar, RefreshCw } from "lucide-react"
import { useState } from "react"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("last_30_days")

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Breadcrumb and Actions */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Analytics & Insights" }]} />

              <div className="flex items-center gap-3">
                {/* Date Range Selector */}
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#DFE1E7] rounded-lg">
                  <Calendar className="w-4 h-4 text-[#666D80]" />
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="text-sm text-[#0D0D12] bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="today">Today</option>
                    <option value="last_7_days">Last 7 Days</option>
                    <option value="last_30_days">Last 30 Days</option>
                    <option value="last_90_days">Last 90 Days</option>
                    <option value="this_year">This Year</option>
                    <option value="all_time">All Time</option>
                  </select>
                </div>

                {/* Refresh Button */}
                <button className="p-2 bg-white border border-[#DFE1E7] rounded-lg hover:bg-[#F9FAFB] transition-colors">
                  <RefreshCw className="w-4 h-4 text-[#666D80]" />
                </button>

                {/* Export Button */}
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#DFE1E7] rounded-lg text-sm font-medium text-[#0D0D12] hover:bg-[#F9FAFB] transition-colors shadow-sm">
                  <Download className="w-4 h-4" />
                  Export Data
                </button>

                {/* Generate Report Button */}
                <button className="flex items-center gap-2 px-4 py-2 bg-[#301B69] text-white rounded-lg text-sm font-medium hover:bg-[#301B69]/90 transition-colors shadow-sm">
                  <FileText className="w-4 h-4" />
                  Generate Report
                </button>
              </div>
            </div>

            {/* Main Stats Cards */}
            <AnalyticsStatsCards />

            {/* Engagement Stats Cards */}
            <EngagementStatsCards />

            {/* User Growth & Revenue Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UserGrowthChart />
              <RevenueChart />
            </div>

            {/* User Engagement & Subscription Distribution Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <UserEngagementChart />
              </div>
              <div className="lg:col-span-1">
                <SubscriptionDistributionChart />
              </div>
            </div>

            {/* Demographics Section */}
            <div>
              <h2 className="text-lg font-semibold text-[#0D0D12] mb-4">User Demographics</h2>
              <DemographicsCharts />
            </div>

            {/* Device & Platform Section */}
            <div>
              <h2 className="text-lg font-semibold text-[#0D0D12] mb-4">Device & Platform Analytics</h2>
              <DevicePlatformChart />
            </div>

            {/* Geographic Distribution Section */}
            <div>
              <h2 className="text-lg font-semibold text-[#0D0D12] mb-4">Geographic Distribution</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <VisitorsByCountryMap />
                <TopCountriesTable />
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {/* Performance Summary Card */}
                <div className="bg-gradient-to-br from-[#301B69] to-[#5B3BA1] rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-white/70 text-xs mb-1">User Retention</p>
                      <p className="text-2xl font-bold">78.5%</p>
                      <p className="text-green-300 text-xs mt-1">↑ 5.2% vs last month</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs mb-1">Match Success Rate</p>
                      <p className="text-2xl font-bold">42.3%</p>
                      <p className="text-green-300 text-xs mt-1">↑ 3.8% vs last month</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs mb-1">Avg. Response Time</p>
                      <p className="text-2xl font-bold">4.2m</p>
                      <p className="text-green-300 text-xs mt-1">↓ 12% vs last month</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs mb-1">Customer Satisfaction</p>
                      <p className="text-2xl font-bold">4.8/5</p>
                      <p className="text-green-300 text-xs mt-1">↑ 0.2 vs last month</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-xs">Monthly Active Users</p>
                        <p className="text-3xl font-bold">28,456</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/70 text-xs">Platform Health Score</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-32 bg-white/20 rounded-full h-2">
                            <div className="h-2 rounded-full bg-green-400" style={{ width: '92%' }} />
                          </div>
                          <span className="text-lg font-bold">92%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <RecentActivityFeed />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

