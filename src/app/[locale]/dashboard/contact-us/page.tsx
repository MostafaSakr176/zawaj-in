"use client"

import { DashboardHeader } from "../components/DashboardHeader"
import { DashboardSidebar } from "../components/DashboardSidebar"
import { ContactMessagesTable } from "../components/ContactMessagesTable"
import { Breadcrumb } from "../components/Breadcrumb"

export default function ContactUsPage() {
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
                { label: "Contact Us Messages" }
              ]}
            />

            {/* Contact Messages Table */}
            <ContactMessagesTable />
          </div>
        </main>
      </div>
    </div>
  )
}

