"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { ChatListItem } from "./ChatListItem"

interface Chat {
  id: string
  number: string
  status: "Active" | "Reported" | "Closed"
  participant1: {
    name: string
    package: "Free" | "Gold"
    avatar?: string
  }
  participant2: {
    name: string
    package: "Free" | "Gold"
    avatar?: string
  }
  lastMessage: string
  messageCount: number
  time: string
}

const mockChats: Chat[] = [
  {
    id: "1",
    number: "144",
    status: "Reported",
    participant1: { name: "Abdullah", package: "Free" },
    participant2: { name: "Sara", package: "Gold" },
    lastMessage: "Sure! let me tell y...",
    messageCount: 2,
    time: "2 m Ago"
  },
  {
    id: "2",
    number: "144",
    status: "Active",
    participant1: { name: "Abdullah", package: "Free" },
    participant2: { name: "Sara", package: "Gold" },
    lastMessage: "Sure! let me tell y...",
    messageCount: 2,
    time: "2 m Ago"
  },
  {
    id: "3",
    number: "144",
    status: "Closed",
    participant1: { name: "Abdullah", package: "Free" },
    participant2: { name: "Sara", package: "Gold" },
    lastMessage: "Sure! let me tell y...",
    messageCount: 2,
    time: "2 m Ago"
  },
  {
    id: "4",
    number: "144",
    status: "Active",
    participant1: { name: "Abdullah", package: "Free" },
    participant2: { name: "Sara", package: "Gold" },
    lastMessage: "Sure! let me tell y...",
    messageCount: 2,
    time: "2 m Ago"
  },
  {
    id: "5",
    number: "144",
    status: "Reported",
    participant1: { name: "Abdullah", package: "Free" },
    participant2: { name: "Sara", package: "Gold" },
    lastMessage: "Sure! let me tell y...",
    messageCount: 2,
    time: "2 m Ago"
  },
  {
    id: "6",
    number: "144",
    status: "Active",
    participant1: { name: "Abdullah", package: "Free" },
    participant2: { name: "Sara", package: "Gold" },
    lastMessage: "Sure! let me tell y...",
    messageCount: 2,
    time: "2 m Ago"
  },
  {
    id: "7",
    number: "144",
    status: "Active",
    participant1: { name: "Abdullah", package: "Free" },
    participant2: { name: "Sara", package: "Gold" },
    lastMessage: "Sure! let me tell y...",
    messageCount: 2,
    time: "2 m Ago"
  },
]

interface ChatListProps {
  onChatSelect: (chatId: string) => void
  selectedChatId?: string
}

export function ChatList({ onChatSelect, selectedChatId }: ChatListProps) {
  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Reported" | "Closed">("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChats = mockChats.filter(chat => {
    const matchesTab = activeTab === "All" || chat.status === activeTab
    const matchesSearch = searchQuery === "" ||
      chat.participant1.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.participant2.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.number.includes(searchQuery)
    return matchesTab && matchesSearch
  })

  return (
    <div className="flex flex-col h-full bg-white border-r border-[#DFE1E7]">
      {/* Search */}
      <div className="p-4 border-b border-[#DFE1E7]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#818898]" />
          <input
            type="text"
            placeholder="Search Chat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#DFE1E7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#301B69]/20 placeholder:text-[#818898]"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-[#DFE1E7]">
        {(["All", "Active", "Reported", "Closed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium transition-colors pb-2 border-b-2 ${
              activeTab === tab
                ? "text-[#301B69] border-[#301B69]"
                : "text-[#666D80] border-transparent hover:text-[#301B69]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <ChatListItem
            key={chat.id}
            {...chat}
            isSelected={selectedChatId === chat.id}
            onClick={() => onChatSelect(chat.id)}
          />
        ))}
      </div>
    </div>
  )
}
