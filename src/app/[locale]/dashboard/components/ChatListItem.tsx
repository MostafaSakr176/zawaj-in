"use client"

import { Badge } from "./Badge"
import { ArrowLeftRight } from "lucide-react"
import Image from "next/image"

interface ChatListItemProps {
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
  isSelected?: boolean
  onClick?: () => void
}

export function ChatListItem({
  id,
  number,
  status,
  participant1,
  participant2,
  lastMessage,
  messageCount,
  time,
  isSelected = false,
  onClick
}: ChatListItemProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "success"
      case "Reported":
        return "error"
      case "Closed":
        return "neutral"
      default:
        return "neutral"
    }
  }

  const getPackageBadgeVariant = (packageType: string) => {
    return packageType === "Gold" ? "gold" : "free"
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 p-4 border-b border-[#DFE1E7] cursor-pointer transition-colors ${
        isSelected ? "bg-[#F9FAFB]" : "hover:bg-[#F9FAFB]"
      }`}
    >
      {/* Chat Number and Status */}
      <div className="flex flex-col items-start gap-1 min-w-[60px]">
        <span className="text-xs font-semibold text-[#0D0D12]">#{number}</span>
        <Badge variant={getStatusBadgeVariant(status)} showDot>
          {status}
        </Badge>
      </div>

      {/* Participants */}
      <div className="flex items-center gap-2 min-w-[140px]">
        {/* Participant 1 */}
        <div className="flex flex-col items-center">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#F5F5F5] mb-1">
            {participant1.avatar ? (
              <Image
                src={participant1.avatar}
                alt={participant1.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-[#301B69]">
                {participant1.name.charAt(0)}
              </div>
            )}
          </div>
          <span className="text-xs text-[#0D0D12] font-medium">{participant1.name}</span>
          <Badge variant={getPackageBadgeVariant(participant1.package)}>
            {participant1.package}
          </Badge>
        </div>

        {/* Arrow Icon */}
        <ArrowLeftRight className="w-4 h-4 text-[#A4ACB9] flex-shrink-0" />

        {/* Participant 2 */}
        <div className="flex flex-col items-center">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#F5F5F5] mb-1">
            {participant2.avatar ? (
              <Image
                src={participant2.avatar}
                alt={participant2.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-[#301B69]">
                {participant2.name.charAt(0)}
              </div>
            )}
          </div>
          <span className="text-xs text-[#0D0D12] font-medium">{participant2.name}</span>
          <Badge variant={getPackageBadgeVariant(participant2.package)}>
            {participant2.package}
          </Badge>
        </div>
      </div>

      {/* Last Message */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#666D80] truncate">{lastMessage}</p>
      </div>

      {/* Message Count and Time */}
      <div className="flex flex-col items-end gap-1 min-w-[60px]">
        <span className="text-xs text-[#A4ACB9]">{time}</span>
        {messageCount > 0 && (
          <div className="flex items-center justify-center w-5 h-5 bg-[#301B69] rounded-full">
            <span className="text-xs text-white font-medium">{messageCount}</span>
          </div>
        )}
      </div>
    </div>
  )
}
