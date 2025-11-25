"use client"

import { DashboardHeader } from "../components/DashboardHeader"
import { DashboardSidebar } from "../components/DashboardSidebar"
import { UsersFilters } from "../components/UsersFilters"
import { UsersTable } from "../components/UsersTable"
import { Breadcrumb } from "../components/Breadcrumb"
import { Plus } from "lucide-react"

export default function UsersPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Breadcrumb and Add New User Button */}
            <div className="flex items-center justify-between">
              <Breadcrumb
                items={[
                  { label: "Management", href: "/dashboard" },
                  { label: "Users" }
                ]}
              />

              <button className="flex items-center gap-2 px-4 py-2 bg-[#301B69] text-white rounded-lg text-sm font-medium hover:bg-[#301B69]/90 transition-colors shadow-sm">
                <Plus className="w-4 h-4" />
                Add New User
              </button>
            </div>

            {/* Filters */}
            <UsersFilters />

            {/* Users Table */}
            <UsersTable />
          </div>
        </main>
      </div>
    </div>
  )
}
