"use client"

import { useState } from "react"
import { DashboardHeader } from "../components/DashboardHeader"
import { DashboardSidebar } from "../components/DashboardSidebar"
import { ChatList } from "../components/ChatList"
import { ChatMessages } from "../components/ChatMessages"
import { Breadcrumb } from "../components/Breadcrumb"

export default function ChatsPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(undefined)

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-hidden p-6">
          <div className="h-full flex flex-col">
            {/* Breadcrumb */}
            <div className="mb-4">
              <Breadcrumb
                items={[
                  { label: "Management", href: "/dashboard" },
                  { label: "Chats" }
                ]}
              />
            </div>

            {/* Chat Container */}
            <div className="flex-1 flex rounded-2xl border border-[#DFE1E7] overflow-hidden bg-white shadow-sm">
              {/* Chat List */}
              <div className="w-[400px] flex-shrink-0">
                <ChatList
                  onChatSelect={(chatId) => setSelectedChatId(chatId)}
                  selectedChatId={selectedChatId}
                />
              </div>

              {/* Chat Messages */}
              <ChatMessages chatId={selectedChatId} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
