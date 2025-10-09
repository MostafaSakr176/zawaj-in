"use client";

import Image from "next/image";
import { Ellipsis, ArrowRight, Mic, Search, Check, Send } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { useConversations, useChat } from "@/hooks/useChat";
import { useAuth } from "@/context/AuthContext";
import { Conversation, Message } from "@/services/chatService";

function ChatBubble({ m, currentUserId }: { m: Message; currentUserId: string }) {
  const fromMe = m.senderId === currentUserId;

  if (m.messageType === "audio" || m.messageType === "image") {
    return (
      <div className="flex items-end gap-3">
        <Image src="/photos/male-icon.webp" alt="" width={36} height={36} className="rounded-full" />
        <div className="rounded-full rounded-br-none border border-[#0000001A] bg-white px-3 py-2 flex items-center gap-3">
          <button className="grid place-items-center size-7 rounded-full bg-[#F5E6FF] text-[#301B69]">
            <Image src="/icons/play.webp" alt="" width={7} height={10} className="w-2" />
          </button>
          <div className="w-40 h-1.5 rounded bg-[#E9ECF6] overflow-hidden">
            <div className="h-full w-1/2 bg-[#B9C0CF]" />
          </div>
          <span className="text-xs text-[#8A97AB]">1:04:16</span>
        </div>
      </div>
    );
  }

  const common = "max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm";

  return fromMe ? (
    <div className="flex items-end justify-end gap-2">
      <div className={`${common} bg-[#3B0C46] text-white rounded-bl-none`}>
        {m.content}
      </div>
      <Image src="/photos/male-icon.webp" alt="" width={36} height={36} className="rounded-full" />
    </div>
  ) : (
    <div className="flex items-end justify-start gap-2">
      <Image src="/photos/male-icon.webp" alt="" width={36} height={36} className="rounded-full" />
      <div className={`${common} bg-[#EDF3FF] text-[#2D1F55] rounded-br-none`}>
        {m.content}
      </div>
    </div>
  );
}

function ChatListItem({
  c,
  onOpen,
  currentUserId
}: {
  c: Conversation;
  onOpen: (c: Conversation) => void;
  currentUserId: string;
}) {
  // Determine the other participant
  const otherParticipant = c.participant1Id === currentUserId ? c.participant2 : c.participant1;

  const formatTime = (date: Date | null | string) => {
    if (!date) return "";
    // Ensure we create a proper Date object from the server timestamp
    const d = typeof date === 'string' ? new Date(date) : new Date(date);
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <button
      onClick={() => onOpen(c)}
      className="w-full text-right px-3 py-3 rounded-xl hover:bg-white/60 transition flex items-center gap-3"
    >
      <div className="relative">
        <Image
          src="/photos/male-icon.webp"
          alt={otherParticipant?.fullName || "User"}
          width={40}
          height={40}
          className="rounded-full ring-2 ring-white"
        />
        <span className="absolute -bottom-0.5 -left-0.5 size-2.5 rounded-full bg-[#28C76F] ring-2 ring-white" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#2D1F55]">
            {otherParticipant?.fullName || "مستخدم"}
          </span>
          <span className="text-xs text-[#8A97AB]">{formatTime(c.lastMessageAt)}</span>
        </div>
        <p className="text-xs text-[#8A97AB] line-clamp-1">
          {c.lastMessage || "ابدأ المحادثة"}
        </p>
      </div>
      {c.unreadCount && c.unreadCount > 0 ? (
        <span className="grid place-items-center min-w-6 h-6 rounded-full bg-[#3B0C46] text-white text-xs">
          {c.unreadCount}
        </span>
      ) : (
        <Check size={16} className="text-[#B9C0CF]" />
      )}
    </button>
  );
}

function MessagesList({
  messages,
  className,
  onReachTop,
  currentUserId,
}: {
  messages: Message[];
  className?: string;
  onReachTop?: () => void;
  currentUserId: string;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const prevScrollHeightRef = useRef<number>(0);

  // Scroll to bottom on mount and when new messages arrive
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // If this is initial load or user is near bottom, scroll to bottom
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (messages.length === 0 || isNearBottom || prevScrollHeightRef.current === 0) {
      el.scrollTop = el.scrollHeight;
      prevScrollHeightRef.current = el.scrollHeight;
    }
  }, [messages.length]);

  const handleScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget;
    if (el.scrollTop <= 40) {
      onReachTop?.();
    }
  };

  const formatTime = (date: Date | string) => {
    // Ensure we create a proper Date object from the server timestamp
    const d = typeof date === 'string' ? new Date(date) : new Date(date);
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <div ref={scrollRef} onScroll={handleScroll} className={className}>
      <div className="space-y-4">
        {messages.map((m) => {
          const fromMe = m.senderId === currentUserId;
          return (
            <div key={m.id} className="space-y-1">
              <ChatBubble m={m} currentUserId={currentUserId} />
              <div className={`text-[10px] text-[#8A97AB] ${fromMe ? "text-end me-11" : "text-start ms-11"}`}>
                {formatTime(m.createdAt)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const Chats = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState("");
  const { profile } = useAuth();

  // Load conversations list
  const { conversations, loading: conversationsLoading } = useConversations();

  // Load messages for active conversation
  const {
    messages,
    loading: messagesLoading,
    isTyping,
    isOtherUserOnline,
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping,
    loadMoreMessages,
  } = useChat(activeConversation?.id || null);

  const openChat = (c: Conversation) => {
    setActiveConversation(c);
    setIsOpen(true);
    // Mark messages as read when opening conversation
    setTimeout(() => {
      markAsRead();
    }, 500);
  };

  const handleSendMessage = () => {
    if (messageText.trim() && activeConversation) {
      sendMessage(messageText);
      setMessageText("");
      stopTyping();
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    if (e.target.value.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  const getOtherParticipant = (conv: Conversation | null) => {
    if (!conv || !profile) return null;
    return conv.participant1Id === profile.id ? conv.participant2 : conv.participant1;
  };

  const otherParticipant = getOtherParticipant(activeConversation);

  return (
    <ProtectedRoute>
      <section className="relative pt-28 md:pt-40 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff]">
        <Image src="/photos/terms-bg.webp" alt="Terms Background" width={100} height={100} className="absolute w-full inset-x-0 top-0 z-1" />
        <div className="max-w-7xl mx-auto px-4 md:px-0 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-2">
          {/* Right: Conversations list */}
          <aside className="lg:col-span-4 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E3EBFF] shadow-xl p-3">
            {/* Search */}
            <div className="relative mb-3">
              <input
                className="w-full ps-10 pe-3 py-2 rounded-xl border border-[#E3EBFF] bg-white/70 outline-none placeholder:text-[#8A97AB] text-sm"
                placeholder="ابحث عن رسالة..."
              />
              <Search size={16} className="absolute top-1/2 -translate-y-1/2 rtl:left-3 ltr:right-3 text-[#8A97AB]" />
            </div>

            <div className="space-y-1 max-h-[70vh] overflow-auto pr-1">
              {conversationsLoading ? (
                <div className="text-center py-8 text-[#8A97AB]">جاري التحميل...</div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8 text-[#8A97AB]">لا توجد محادثات</div>
              ) : (
                conversations.map((c) => (
                  <ChatListItem
                    key={c.id}
                    c={c}
                    onOpen={openChat}
                    currentUserId={profile?.id || ""}
                  />
                ))
              )}
            </div>
          </aside>

          {/* Left: Chat window (desktop only) */}
          <div className={`hidden lg:block lg:col-span-8 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E3EBFF] shadow-xl overflow-hidden`}>
            {activeConversation && otherParticipant ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F2FA]">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setActiveConversation(null)}>
                      <ArrowRight className="text-[#2D1F55]" />
                    </button>
                    <div className="relative">
                      <Image src="/photos/male-icon.webp" alt="" width={44} height={44} className="rounded-full ring-4 ring-white" />
                      {isOtherUserOnline && (
                        <span className="absolute -bottom-0.5 -left-0.5 size-3 rounded-full bg-[#28C76F] ring-2 ring-white" />
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-[#2D1F55]">{otherParticipant.fullName}</div>
                      <div className="text-xs text-[#8A97AB]">
                        {isTyping ? "يكتب..." : isOtherUserOnline ? "نشط الآن" : "غير متصل"}
                      </div>
                    </div>
                  </div>
                  <button className="p-2 rounded-full hover:bg-white/70">
                    <Ellipsis className="text-[#2D1F55]" />
                  </button>
                </div>

                {/* Messages */}
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-[60vh]">
                    <div className="text-[#8A97AB]">جاري تحميل الرسائل...</div>
                  </div>
                ) : (
                  <MessagesList
                    messages={messages}
                    className="max-h-[60vh] overflow-y-auto p-3 md:p-6"
                    onReachTop={loadMoreMessages}
                    currentUserId={profile?.id || ""}
                  />
                )}

                {/* Input */}
                <div className="p-4">
                  <div className="flex items-center gap-2 rounded-4xl bg-[#F6F8FE] border border-[#E3E7EC] p-2">
                    <input
                      value={messageText}
                      onChange={handleTyping}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      onBlur={stopTyping}
                      placeholder="رسالة"
                      className="flex-1 bg-transparent px-3 outline-none placeholder:text-[#8A97AB] text-[#2D1F55]"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="grid place-items-center size-10 rounded-full bg-[#3B0C46] text-white"
                    >
                      {messageText.trim() ? <Send size={18} /> : <Mic size={18} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-[#8A97AB]">
                  <p className="text-lg">اختر محادثة لبدء الدردشة</p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile slide-in chat window */}
          <div className="lg:hidden">
            {/* Overlay */}
            <div
              onClick={() => setIsOpen(false)}
              className={`fixed inset-0 z-40 transition-opacity duration-300 ${
                isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            />
            {/* Panel */}
            <div
              className={`fixed inset-y-0 right-0 z-50 p-4 pt-28 bg-gradient-to-b from-[#E0DAFF] to-[#fff] w-full transform transition-transform duration-300 ease-out ${
                isOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {activeConversation && otherParticipant && (
                <div className="h-full rounded-2xl bg-white/80 backdrop-blur-md border-l border-[#E3EBFF] shadow-xl overflow-hidden flex flex-col min-h-0">
                  {/* Header (fixed height) */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F2FA] shrink-0">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-full hover:bg-white/70"
                      aria-label="back"
                    >
                      <ArrowRight className="text-[#2D1F55]" />
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-semibold text-[#2D1F55]">{otherParticipant.fullName}</div>
                        <div className="text-xs text-[#8A97AB]">
                          {isTyping ? "يكتب..." : isOtherUserOnline ? "نشط الآن" : "غير متصل"}
                        </div>
                      </div>
                      <div className="relative">
                        <Image
                          src="/photos/male-icon.webp"
                          alt=""
                          width={44}
                          height={44}
                          className="rounded-full ring-4 ring-white"
                        />
                        {isOtherUserOnline && (
                          <span className="absolute -bottom-0.5 -left-0.5 size-3 rounded-full bg-[#28C76F] ring-2 ring-white" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Messages (take available height and scroll) */}
                  {messagesLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-[#8A97AB]">جاري تحميل الرسائل...</div>
                    </div>
                  ) : (
                    <MessagesList
                      messages={messages}
                      className="flex-1 overflow-y-auto p-3 md:p-6 min-h-0"
                      onReachTop={loadMoreMessages}
                      currentUserId={profile?.id || ""}
                    />
                  )}

                  {/* Input (sticks to bottom) */}
                  <div className="p-4 border-t border-[#F0F2FA] shrink-0">
                    <div className="flex items-center gap-2 rounded-4xl bg-[#F6F8FE] border border-[#E3E7EC] p-2">
                      <input
                        value={messageText}
                        onChange={handleTyping}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        onBlur={stopTyping}
                        placeholder="رسالة"
                        className="flex-1 bg-transparent px-3 outline-none placeholder:text-[#8A97AB] text-[#2D1F55]"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="grid place-items-center size-10 rounded-full bg-[#3B0C46] text-white"
                      >
                        {messageText.trim() ? <Send size={18} /> : <Mic size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* End mobile panel */}
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default Chats;
