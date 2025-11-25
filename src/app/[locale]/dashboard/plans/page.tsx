"use client"

import { useState, useCallback } from "react"
import { DashboardHeader } from "../components/DashboardHeader"
import { DashboardSidebar } from "../components/DashboardSidebar"
import { Breadcrumb } from "../components/Breadcrumb"
import { PlansTable } from "../components/PlansTable"
import { AddEditPlanModal } from "../components/AddEditPlanModal"
import { SubscriptionPlan } from "@/lib/adminApi"

export default function PlansPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAddNew = () => {
    setEditingPlan(null)
    setShowModal(true)
  }

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan)
    setShowModal(true)
  }

  const handleSuccess = () => {
    setShowModal(false)
    setEditingPlan(null)
    // Trigger refresh of the table
    setRefreshKey(prev => prev + 1)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditingPlan(null)
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
              items={[
                { label: "Management", href: "/dashboard" },
                { label: "Subscription Plans" }
              ]}
            />

            {/* Plans Table */}
            <PlansTable 
              key={refreshKey} 
              onAddNew={handleAddNew} 
              onEdit={handleEdit}
              refreshKey={refreshKey}
            />
          </div>
        </main>
      </div>

      {/* Add/Edit Plan Modal */}
      <AddEditPlanModal
        isOpen={showModal}
        onClose={handleClose}
        onSuccess={handleSuccess}
        plan={editingPlan}
      />
    </div>
  )
}

