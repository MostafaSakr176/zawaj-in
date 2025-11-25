"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { MoreVertical, Play, Mic, Paperclip, Check, CheckCheck, AlertCircle, Loader2, Trash2 } from "lucide-react"
import Image from "next/image"
import { Badge } from "./Badge"
import { ChatOptionsModal } from "./ChatOptionsModal"
import { 
  getConversationById, 
  deleteMessage,
  closeConversation,
  banUser,
  sendNotification,
  type ChatMessage as APIChatMessage,
  type ChatParticipant
} from "@/lib/adminApi"

interface Message {
  id: string
  type: "text" | "audio" | "image"
  content: string
  sender: "left" | "right"
  senderId: string
  time: string
  isReported?: boolean
  isDeleted?: boolean
  duration?: string
  imageUrl?: string
  status?: "sent" | "delivered" | "read"
}

interface ConversationDetails {
  id: string
  participant1: ChatParticipant
  participant2: ChatParticipant
  messages: Message[]
  isClosed: boolean
}

interface ChatMessagesProps {
  chatId?: string
  onConversationClosed?: () => void
}

// Format time from ISO string
function formatMessageTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Convert API message to display format
function apiMessageToMessage(
  msg: any, 
  participant1Id: string
): Message {
  // Map messageType from API to our type
  const getMessageType = (messageType: string): "text" | "audio" | "image" => {
    if (messageType === "audio") return "audio"
    if (messageType === "image") return "image"
    return "text"
  }

  // Format audio duration (API returns seconds as number)
  const formatDuration = (seconds?: number): string | undefined => {
    if (!seconds) return undefined
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return {
    id: msg.id,
    type: getMessageType(msg.messageType || msg.type || "text"),
    content: msg.content || "",
    sender: msg.senderId === participant1Id ? "right" : "left",
    senderId: msg.senderId,
    time: formatMessageTime(msg.createdAt),
    isReported: msg.isReported,
    isDeleted: msg.isDeleted,
    duration: formatDuration(msg.audioDuration),
    imageUrl: msg.fileUrl || msg.imageUrl,
    status: msg.status || "sent"
  }
}

export function ChatMessages({ chatId, onConversationClosed }: ChatMessagesProps) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [conversation, setConversation] = useState<ConversationDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null)
  const [isClosingConversation, setIsClosingConversation] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation?.messages])

  // Fetch conversation when chatId changes
  useEffect(() => {
    if (!chatId) {
      setConversation(null)
      return
    }

    const fetchConversation = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await getConversationById(chatId)
        // API returns data directly in response.data (not response.data.conversation)
        const conv = response.data
        
        if (conv) {
          const participant1: ChatParticipant = conv.participant1 || {
            id: conv.participant1Id,
            fullName: "User 1"
          }
          const participant2: ChatParticipant = conv.participant2 || {
            id: conv.participant2Id,
            fullName: "User 2"
          }

          const messages = (conv.messages || []).map((msg: any) => 
            apiMessageToMessage(msg, participant1.id)
          )

          setConversation({
            id: conv.id,
            participant1,
            participant2,
            messages,
            isClosed: conv.isClosed || false
          })
        }
      } catch (err) {
        console.error("Failed to fetch conversation:", err)
        setError("Failed to load conversation")
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversation()
  }, [chatId])

  // Memoize participants for modal
  const participant1ForModal = useMemo(() => ({
    id: conversation?.participant1?.id || "",
    name: conversation?.participant1?.fullName || "User 1",
    avatar: conversation?.participant1?.avatar
  }), [conversation?.participant1])

  const participant2ForModal = useMemo(() => ({
    id: conversation?.participant2?.id || "",
    name: conversation?.participant2?.fullName || "User 2",
    avatar: conversation?.participant2?.avatar
  }), [conversation?.participant2])

  const handleBlockUser = async (userId: string, userName: string) => {
    try {
      await banUser(userId, {
        banType: "permanent",
        reason: "Blocked by admin from chat management"
      })
      alert(`${userName} has been blocked`)
    } catch (err) {
      console.error("Failed to block user:", err)
      alert("Failed to block user")
    }
    setIsOptionsOpen(false)
  }

  const handleBlockBoth = async () => {
    try {
      await Promise.all([
        banUser(participant1ForModal.id, {
          banType: "permanent",
          reason: "Blocked by admin from chat management"
        }),
        banUser(participant2ForModal.id, {
          banType: "permanent",
          reason: "Blocked by admin from chat management"
        })
      ])
      alert("Both users have been blocked")
    } catch (err) {
      console.error("Failed to block users:", err)
      alert("Failed to block users")
    }
    setIsOptionsOpen(false)
  }

  const handleSendWarning = async (userId: string, userName: string) => {
    try {
      await sendNotification(userId, {
        subject: "Warning from Admin",
        message: "Your chat behavior has been flagged. Please follow community guidelines.",
        notificationType: "push"
      })
      alert(`Warning sent to ${userName}`)
    } catch (err) {
      console.error("Failed to send warning:", err)
      alert("Failed to send warning")
    }
    setIsOptionsOpen(false)
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return
    
    setDeletingMessageId(messageId)
    try {
      await deleteMessage(messageId, { reason: "Deleted by admin" })
      
      // Update local state
      if (conversation) {
        setConversation({
          ...conversation,
          messages: conversation.messages.map(msg =>
            msg.id === messageId ? { ...msg, isDeleted: true, content: "[Message deleted]" } : msg
          )
        })
      }
    } catch (err) {
      console.error("Failed to delete message:", err)
      alert("Failed to delete message")
    } finally {
      setDeletingMessageId(null)
    }
  }

  const handleCloseConversation = async () => {
    if (!chatId || !confirm("Are you sure you want to close this conversation? This will delete all messages.")) return
    
    setIsClosingConversation(true)
    try {
      await closeConversation(chatId, { reason: "Closed by admin" })
      alert("Conversation closed successfully")
      onConversationClosed?.()
    } catch (err) {
      console.error("Failed to close conversation:", err)
      alert("Failed to close conversation")
    } finally {
      setIsClosingConversation(false)
      setIsOptionsOpen(false)
    }
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

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F9FAFB]">
        <Loader2 className="w-8 h-8 text-[#301B69] animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB]">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#DFE1E7]">
        <div className="flex items-center gap-3">
          {/* Both participants */}
          <div className="flex -space-x-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#F5F5F5] border-2 border-white z-10">
              {conversation?.participant1?.avatar ? (
                <Image
                  src={conversation.participant1.avatar}
                  alt={conversation.participant1.fullName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-[#301B69]">
                  {conversation?.participant1?.fullName?.charAt(0) || "?"}
                </div>
              )}
            </div>
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#F5F5F5] border-2 border-white">
              {conversation?.participant2?.avatar ? (
                <Image
                  src={conversation.participant2.avatar}
                  alt={conversation.participant2.fullName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-[#301B69]">
                  {conversation?.participant2?.fullName?.charAt(0) || "?"}
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#0D0D12]">
              {conversation?.participant1?.fullName} & {conversation?.participant2?.fullName}
            </h3>
            <p className="text-xs text-[#666D80]">
              {conversation?.messages?.length || 0} messages
              {conversation?.isClosed && " • Closed"}
            </p>
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
            participant1={participant1ForModal}
            participant2={participant2ForModal}
            onBlockUser={(userId, userName) => handleBlockUser(userId, userName)}
            onBlockBoth={handleBlockBoth}
            onSendWarning={(userId, userName) => handleSendWarning(userId, userName)}
            onCloseConversation={handleCloseConversation}
            isClosingConversation={isClosingConversation}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {conversation?.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-[#666D80]">No messages in this conversation</p>
          </div>
        ) : (
          conversation?.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "right" ? "justify-end" : "justify-start"} group`}
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
                <div className="relative">
                  {message.isDeleted ? (
                    <div className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-400 italic border border-gray-200">
                      <p className="text-sm">[Message deleted]</p>
                    </div>
                  ) : (
                    <>
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
                            {message.imageUrl && (
                              <Image
                                src={message.imageUrl}
                                alt="Chat image"
                                fill
                                className="object-cover"
                              />
                            )}
                            {message.content && (
                              <div className="absolute inset-0 flex items-end">
                                <div className="w-full bg-gradient-to-t from-black/60 to-transparent p-3">
                                  <p className="text-xs text-white">{message.content}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Delete button (visible on hover) */}
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        disabled={deletingMessageId === message.id}
                        className={`absolute -top-2 ${
                          message.sender === "right" ? "-left-8" : "-right-8"
                        } p-1.5 bg-white border border-[#DFE1E7] rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-200`}
                        title="Delete message"
                      >
                        {deletingMessageId === message.id ? (
                          <Loader2 className="w-3.5 h-3.5 text-red-500 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        )}
                      </button>
                    </>
                  )}
                </div>

                {/* Time and Status */}
                <div className={`flex items-center gap-1 mt-1 ${message.sender === "right" ? "justify-end" : "justify-start"}`}>
                  <span className="text-xs text-[#A4ACB9]">{message.time}</span>
                  {message.sender === "right" && message.status && !message.isDeleted && (
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
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Admin Notice (instead of message input) */}
      <div className="px-6 py-4 bg-white border-t border-[#DFE1E7]">
        <div className="flex items-center justify-center gap-2 text-sm text-[#666D80]">
          <AlertCircle className="w-4 h-4" />
          <span>Admin view only - You cannot send messages in this conversation</span>
        </div>
      </div>
    </div>
  )
}
