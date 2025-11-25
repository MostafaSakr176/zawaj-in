"use client"

import { DashboardHeader } from "./components/DashboardHeader"
import { DashboardSidebar } from "./components/DashboardSidebar"
import { StatsCards } from "./components/StatsCards"
import { UsersTable } from "./components/UsersTable"
import { Breadcrumb } from "./components/Breadcrumb"
import { SubscriptionOverviewChart } from "./components/SubscriptionOverviewChart"
import { SubscriptionDistributionChart } from "./components/SubscriptionDistributionChart"
import { VisitorsByCountryMap } from "./components/VisitorsByCountryMap"
import { FileText } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Breadcrumb and Generate Reports Button */}
            <div className="flex items-center justify-between">
              <Breadcrumb items={[{ label: "Dashboard" }]} />

              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#DFE1E7] rounded-lg text-sm font-medium text-[#0D0D12] hover:bg-[#F9FAFB] transition-colors shadow-sm">
                <FileText className="w-4 h-4" />
                Generate Reports
              </button>
            </div>

            {/* Stats Cards */}
            <StatsCards />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SubscriptionOverviewChart />
              </div>
              <div className="lg:col-span-1">
                <SubscriptionDistributionChart />
              </div>
            </div>

            {/* Visitors Map */}
            <VisitorsByCountryMap />

            {/* Users Table */}
            <UsersTable />
          </div>
        </main>
      </div>
    </div>
  )
}
