"use client"

import { useState, useCallback } from "react"
import { DashboardHeader } from "../components/DashboardHeader"
import { DashboardSidebar } from "../components/DashboardSidebar"
import { Breadcrumb } from "../components/Breadcrumb"
import { RolesTable } from "../components/RolesTable"
import { AddAdminForm } from "../components/AddAdminForm"

export default function RolesPermissionsPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAddNew = () => {
    setShowAddForm(true)
  }

  const handleSave = () => {
    setShowAddForm(false)
    // Trigger refresh of the table
    setRefreshKey(prev => prev + 1)
  }

  const handleCancel = () => {
    setShowAddForm(false)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb
              items={
                showAddForm
                  ? [
                      { label: "Management", href: "/dashboard" },
                      { label: "Roles & Permissions", href: "/dashboard/roles" },
                      { label: "Add New" }
                    ]
                  : [
                      { label: "Management", href: "/dashboard" },
                      { label: "Roles & Permissions" }
                    ]
              }
            />

            {/* Content */}
            {showAddForm ? (
              <AddAdminForm onSave={handleSave} onCancel={handleCancel} />
            ) : (
              <RolesTable key={refreshKey} onAddNew={handleAddNew} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
