"use client"

import { useState } from "react"
import { MoreVertical, Play, Mic, Paperclip, Check, CheckCheck, AlertCircle } from "lucide-react"
import Image from "next/image"
import { Badge } from "./Badge"
import { ChatOptionsModal } from "./ChatOptionsModal"

interface Message {
  id: string
  type: "text" | "audio" | "image"
  content: string
  sender: "left" | "right"
  time: string
  isReported?: boolean
  duration?: string
  imageUrl?: string
  status?: "sent" | "delivered" | "read"
}

interface ChatMessagesProps {
  chatId?: string
}

const mockMessages: Message[] = [
  {
    id: "1",
    type: "text",
    content: "Hello Marilyn! consectetur adipiscing elit ames.",
    sender: "right",
    time: "9:10",
    status: "read"
  },
  {
    id: "2",
    type: "text",
    content: "Fames eros urna, felis morbi a est est.",
    sender: "left",
    time: "09:40"
  },
  {
    id: "3",
    type: "audio",
    content: "",
    sender: "left",
    time: "09:40",
    duration: "00:24"
  },
  {
    id: "4",
    type: "text",
    content: "How confident are we on presenting this?",
    sender: "right",
    time: "09:50",
    isReported: true,
    status: "read"
  },
  {
    id: "5",
    type: "image",
    content: "Find out who is in charge of this portion of the process.",
    sender: "left",
    time: "10:00",
    imageUrl: "/images/chat-sample.jpg"
  }
]

export function ChatMessages({ chatId }: ChatMessagesProps) {
  const [newMessage, setNewMessage] = useState("")
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)

  // Mock participants for the options modal
  const participant1 = { name: "Ola", avatar: undefined }
  const participant2 = { name: "Ahmed", avatar: undefined }

  const handleBlockUser = (user: string) => {
    console.log(`Blocking ${user}`)
    setIsOptionsOpen(false)
  }

  const handleBlockBoth = () => {
    console.log("Blocking both users")
    setIsOptionsOpen(false)
  }

  const handleSendWarning = (user: string) => {
    console.log(`Sending warning to ${user}`)
    setIsOptionsOpen(false)
  }

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <p className="text-[#666D80] text-sm">Select a chat to view messages</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB]">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#DFE1E7]">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#F5F5F5]">
            <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-[#301B69]">
              M
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#0D0D12]">Marilyn George</h3>
            <p className="text-xs text-[#666D80]">Last Seen 09:40</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsOptionsOpen(true)}
            className="p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-[#666D80]" />
          </button>

          {/* Chat Options Dropdown */}
          <ChatOptionsModal
            isOpen={isOptionsOpen}
            onClose={() => setIsOptionsOpen(false)}
            participant1={participant1}
            participant2={participant2}
            onBlockUser={handleBlockUser}
            onBlockBoth={handleBlockBoth}
            onSendWarning={handleSendWarning}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {mockMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "right" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[70%] ${message.sender === "right" ? "order-2" : ""}`}>
              {/* Reported Badge */}
              {message.isReported && (
                <div className="flex items-center gap-1 mb-1 justify-end">
                  <Badge variant="error" showDot>
                    Reported
                  </Badge>
                </div>
              )}

              {/* Message Content */}
              {message.type === "text" && (
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.sender === "right"
                      ? "bg-[#301B69] text-white rounded-br-md"
                      : "bg-white text-[#0D0D12] border border-[#DFE1E7] rounded-bl-md"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              )}

              {message.type === "audio" && (
                <div className="flex items-center gap-3 px-4 py-3 bg-white border border-[#DFE1E7] rounded-2xl rounded-bl-md">
                  <button className="w-8 h-8 flex items-center justify-center bg-[#301B69] rounded-full">
                    <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                  </button>
                  <div className="flex items-center gap-1">
                    {/* Audio waveform visualization */}
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="w-0.5 bg-[#301B69] rounded-full"
                        style={{ height: `${Math.random() * 16 + 4}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#666D80] ml-2">{message.duration}</span>
                </div>
              )}

              {message.type === "image" && (
                <div className="bg-white border border-[#DFE1E7] rounded-2xl rounded-bl-md overflow-hidden">
                  <div className="relative w-64 h-40 bg-[#F5F5F5]">
                    <div className="absolute inset-0 flex items-end">
                      <div className="w-full bg-gradient-to-t from-black/60 to-transparent p-3">
                        <p className="text-xs text-white">{message.content}</p>
                      </div>
                    </div>
                    {/* Placeholder for image */}
                    <div className="absolute top-2 right-2 w-8 h-8 rounded-full overflow-hidden bg-white/20">
                      <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-white">
                        A
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Time and Status */}
              <div className={`flex items-center gap-1 mt-1 ${message.sender === "right" ? "justify-end" : "justify-start"}`}>
                <span className="text-xs text-[#A4ACB9]">{message.time}</span>
                {message.sender === "right" && message.status && (
                  <span className="text-[#A4ACB9]">
                    {message.status === "read" ? (
                      <CheckCheck className="w-3.5 h-3.5 text-[#00BFA6]" />
                    ) : message.status === "delivered" ? (
                      <CheckCheck className="w-3.5 h-3.5" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 bg-white border-t border-[#DFE1E7]">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-[#666D80]" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Write message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#DFE1E7] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#301B69]/20 placeholder:text-[#818898]"
            />
          </div>
          <button className="w-10 h-10 flex items-center justify-center bg-[#301B69] rounded-full hover:bg-[#301B69]/90 transition-colors">
            <Mic className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
