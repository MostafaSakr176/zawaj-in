"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Loader2, RefreshCw } from "lucide-react"
import { ChatListItem } from "./ChatListItem"
import { getConversations, getReportedConversations, type Conversation } from "@/lib/adminApi"

interface Chat {
  id: string
  number: string
  status: "Active" | "Reported" | "Closed"
  participant1: {
    id: string
    name: string
    package: "Free" | "Gold"
    avatar?: string
  }
  participant2: {
    id: string
    name: string
    package: "Free" | "Gold"
    avatar?: string
  }
  lastMessage: string
  messageCount: number
  time: string
}

// Helper function to format relative time
function formatRelativeTime(dateString?: string): string {
  if (!dateString) return ""
  
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} m Ago`
  if (diffHours < 24) return `${diffHours} h Ago`
  if (diffDays < 7) return `${diffDays} d Ago`
  
  return date.toLocaleDateString()
}

// Convert API conversation to Chat format
function conversationToChat(conversation: Conversation, index: number): Chat {
  const getStatus = (): "Active" | "Reported" | "Closed" => {
    if (conversation.isClosed) return "Closed"
    if (conversation.reportCount && conversation.reportCount > 0) return "Reported"
    // Default to Active if not closed (API doesn't always send isActive)
    return "Active"
  }

  const getSubscriptionPlan = (plan?: string): "Free" | "Gold" => {
    if (!plan) return "Free"
    const lowerPlan = plan.toLowerCase()
    if (lowerPlan === "gold" || lowerPlan === "premium" || lowerPlan === "vip") return "Gold"
    return "Free"
  }

  return {
    id: conversation.id,
    number: String(index + 1).padStart(3, "0"),
    status: getStatus(),
    participant1: {
      id: conversation.participant1?.id || conversation.participant1Id,
      name: conversation.participant1?.fullName || "User",
      package: getSubscriptionPlan(conversation.participant1?.subscriptionPlan),
      avatar: conversation.participant1?.avatar
    },
    participant2: {
      id: conversation.participant2?.id || conversation.participant2Id,
      name: conversation.participant2?.fullName || "User",
      package: getSubscriptionPlan(conversation.participant2?.subscriptionPlan),
      avatar: conversation.participant2?.avatar
    },
    lastMessage: conversation.lastMessagePreview || conversation.lastMessage || "No messages yet",
    messageCount: conversation.messageCount || 0,
    time: formatRelativeTime(conversation.lastMessageAt || conversation.updatedAt)
  }
}

interface ChatListProps {
  onChatSelect: (chatId: string) => void
  selectedChatId?: string
}

export function ChatList({ onChatSelect, selectedChatId }: ChatListProps) {
  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Reported" | "Closed">("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      let response
      
      if (activeTab === "Reported") {
        response = await getReportedConversations({ limit: 50 })
      } else {
        const params: { status?: "active" | "closed" | "reported"; search?: string; limit: number } = { limit: 50 }
        
        if (activeTab === "Active") {
          params.status = "active"
        } else if (activeTab === "Closed") {
          params.status = "closed"
        }
        
        if (searchQuery) {
          params.search = searchQuery
        }
        
        response = await getConversations(params)
      }
      
      const conversations = response.data?.conversations || []
      const formattedChats = conversations.map((conv, idx) => conversationToChat(conv, idx))
      setChats(formattedChats)
    } catch (err) {
      console.error("Failed to fetch conversations:", err)
      setError("Failed to load conversations")
    } finally {
      setIsLoading(false)
    }
  }, [activeTab, searchQuery])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== "") {
        fetchConversations()
      }
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Filter chats locally for search when already loaded
  const filteredChats = chats.filter(chat => {
    if (searchQuery === "") return true
    return (
      chat.participant1.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.participant2.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.number.includes(searchQuery)
    )
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
        
        {/* Refresh Button */}
        <button
          onClick={fetchConversations}
          disabled={isLoading}
          className="ml-auto p-1 hover:bg-[#F5F5F5] rounded transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 text-[#666D80] ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 text-[#301B69] animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-32 px-4">
            <p className="text-sm text-red-500 text-center mb-2">{error}</p>
            <button
              onClick={fetchConversations}
              className="text-sm text-[#301B69] hover:underline"
            >
              Try again
            </button>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-[#666D80]">No conversations found</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              {...chat}
              isSelected={selectedChatId === chat.id}
              onClick={() => onChatSelect(chat.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
