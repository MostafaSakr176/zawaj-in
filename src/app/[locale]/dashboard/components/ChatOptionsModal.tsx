"use client"

import { Settings, Loader2, XCircle, AlertTriangle, Ban, MessageSquareWarning } from "lucide-react"
import Image from "next/image"

interface Participant {
  id: string
  name: string
  avatar?: string
}

interface ChatOptionsModalProps {
  isOpen: boolean
  onClose: () => void
  participant1: Participant
  participant2: Participant
  onBlockUser?: (userId: string, userName: string) => void
  onBlockBoth?: () => void
  onSendWarning?: (userId: string, userName: string) => void
  onCloseConversation?: () => void
  isClosingConversation?: boolean
}

export function ChatOptionsModal({
  isOpen,
  onClose,
  participant1,
  participant2,
  onBlockUser,
  onBlockBoth,
  onSendWarning,
  onCloseConversation,
  isClosingConversation = false
}: ChatOptionsModalProps) {
  if (!isOpen) return null

  const blockOptions = [
    {
      type: "block",
      label: `Block ${participant1.name}`,
      avatar: participant1.avatar,
      name: participant1.name,
      id: participant1.id,
      icon: Ban,
      textColor: "text-[#DF1C41]",
      onClick: () => onBlockUser?.(participant1.id, participant1.name)
    },
    {
      type: "block",
      label: `Block ${participant2.name} Only`,
      avatar: participant2.avatar,
      name: participant2.name,
      id: participant2.id,
      icon: Ban,
      textColor: "text-[#DF1C41]",
      onClick: () => onBlockUser?.(participant2.id, participant2.name)
    },
    {
      type: "block-both",
      label: `Block Both Users`,
      avatars: [participant2.avatar, participant1.avatar],
      names: [participant2.name, participant1.name],
      icon: Ban,
      textColor: "text-[#DF1C41]",
      onClick: () => onBlockBoth?.()
    }
  ]

  const warningOptions = [
    {
      type: "warning",
      label: `Send Warning to ${participant1.name}`,
      avatar: participant1.avatar,
      name: participant1.name,
      id: participant1.id,
      icon: MessageSquareWarning,
      textColor: "text-[#F59E0B]",
      onClick: () => onSendWarning?.(participant1.id, participant1.name)
    },
    {
      type: "warning",
      label: `Send Warning to ${participant2.name}`,
      avatar: participant2.avatar,
      name: participant2.name,
      id: participant2.id,
      icon: MessageSquareWarning,
      textColor: "text-[#F59E0B]",
      onClick: () => onSendWarning?.(participant2.id, participant2.name)
    }
  ]

  return (
    <>
      {/* Invisible backdrop to close dropdown */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Dropdown Menu */}
      <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-lg border border-[#DFE1E7] z-50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#DFE1E7]">
          <h2 className="text-base font-semibold text-[#0D0D12]">Chat Options</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F5F5F5] rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4 text-[#666D80]" />
          </button>
        </div>

        {/* Warning Options */}
        <div className="p-3 space-y-1">
          <p className="text-xs text-[#666D80] font-medium px-2.5 mb-2">Send Warning</p>
          {warningOptions.map((option, index) => (
            <button
              key={`warning-${index}`}
              onClick={option.onClick}
              className="w-full flex items-center gap-3 p-2.5 hover:bg-[#FEF3C7] rounded-xl transition-colors"
            >
              {/* Avatar */}
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#F5F5F5] flex-shrink-0">
                {option.avatar ? (
                  <Image
                    src={option.avatar}
                    alt={option.name || ""}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-[#301B69]">
                    {option.name?.charAt(0)}
                  </div>
                )}
              </div>

              {/* Label */}
              <span className={`text-sm font-medium ${option.textColor} flex-1 text-left`}>
                {option.label}
              </span>
              
              <option.icon className="w-4 h-4 text-[#F59E0B]" />
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#DFE1E7] mx-3" />

        {/* Block Options */}
        <div className="p-3 space-y-1">
          <p className="text-xs text-[#666D80] font-medium px-2.5 mb-2">Block Users</p>
          {blockOptions.map((option, index) => (
            <button
              key={`block-${index}`}
              onClick={option.onClick}
              className="w-full flex items-center gap-3 p-2.5 hover:bg-[#FEE2E2] rounded-xl transition-colors"
            >
              {/* Avatar(s) */}
              {option.type === "block-both" ? (
                <div className="relative w-10 h-10 flex-shrink-0">
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-full overflow-hidden bg-[#F5F5F5] border-2 border-white z-10">
                    {option.avatars?.[0] ? (
                      <Image
                        src={option.avatars[0]}
                        alt={option.names?.[0] || ""}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-[#301B69]">
                        {option.names?.[0]?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="absolute right-1 bottom-0 w-7 h-7 rounded-full overflow-hidden bg-[#F5F5F5] border-2 border-white">
                    {option.avatars?.[1] ? (
                      <Image
                        src={option.avatars[1]}
                        alt={option.names?.[1] || ""}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-[#301B69]">
                        {option.names?.[1]?.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#F5F5F5] flex-shrink-0">
                  {option.avatar ? (
                    <Image
                      src={option.avatar}
                      alt={option.name || ""}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-[#301B69]">
                      {option.name?.charAt(0)}
                    </div>
                  )}
                </div>
              )}

              {/* Label */}
              <span className={`text-sm font-medium ${option.textColor} flex-1 text-left`}>
                {option.label}
              </span>
              
              <option.icon className="w-4 h-4 text-[#DF1C41]" />
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#DFE1E7] mx-3" />

        {/* Close Conversation */}
        <div className="p-3">
          <button
            onClick={onCloseConversation}
            disabled={isClosingConversation}
            className="w-full flex items-center justify-center gap-2 p-2.5 bg-[#FEE2E2] hover:bg-[#FECACA] rounded-xl transition-colors disabled:opacity-50"
          >
            {isClosingConversation ? (
              <Loader2 className="w-4 h-4 text-[#DF1C41] animate-spin" />
            ) : (
              <XCircle className="w-4 h-4 text-[#DF1C41]" />
            )}
            <span className="text-sm font-medium text-[#DF1C41]">
              {isClosingConversation ? "Closing..." : "Close Conversation"}
            </span>
          </button>
        </div>

        {/* Done Button */}
        <div className="px-3 pb-3">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#301B69] text-white rounded-xl text-sm font-medium hover:bg-[#301B69]/90 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </>
  )
}
