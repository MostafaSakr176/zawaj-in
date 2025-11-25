"use client"

import { DashboardHeader } from "../components/DashboardHeader"
import { DashboardSidebar } from "../components/DashboardSidebar"
import { SubscriptionStats } from "../components/SubscriptionStats"
import { SubscriptionFilters } from "../components/SubscriptionFilters"
import { SubscriptionsTable } from "../components/SubscriptionsTable"
import { Breadcrumb } from "../components/Breadcrumb"
import { Download } from "lucide-react"

export default function SubscriptionsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Breadcrumb and Export Button */}
            <div className="flex items-center justify-between">
              <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Subscriptions & Payments" }]} />

              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#DFE1E7] rounded-lg text-sm font-medium text-[#0D0D12] hover:bg-[#F9FAFB] transition-colors shadow-sm">
                <Download className="w-4 h-4" />
                Export All
              </button>
            </div>

            {/* Stats Cards */}
            <SubscriptionStats />

            {/* Filters */}
            <SubscriptionFilters />

            {/* Subscriptions Table */}
            <SubscriptionsTable />
          </div>
        </main>
      </div>
    </div>
  )
}
