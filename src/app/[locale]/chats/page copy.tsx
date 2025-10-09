"use client";

import Image from "next/image";
import { Ellipsis, ArrowRight, Mic, Search, Check, Play, Send, CircleEllipsis, MessageSquareHeart } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Volume2, Trash2, Ban, Flag } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import api from "@/lib/axiosClient";

type Message = {
  id: number;
  text?: string;
  time: string;
  fromMe?: boolean;
  type?: "text" | "audio";
};

type ChatItem = {
  id: number;
  name: string;
  lastMsg: string;
  time: string;
  unread?: number;
  avatar: string;
  online?: boolean;
  userId: string; // Add userId for blocking
  isBlocked?: boolean; // Track block status
};

const messages: Message[] = [
  { id: 1, text: "Lorem ipsum dolor sit et, consectetur adipiscing.", time: "15:42 PM" },
  { id: 2, text: "Lorem ipsum dolor sit et", time: "15:42 PM", fromMe: true },
  { id: 3, text: "Lorem ipsum dolor sit et, consectetur adipiscing.", time: "15:42 PM" },
  { id: 3, text: "Lorem ipsum dolor sit et, consectetur adipiscing.", time: "15:42 PM" },
  { id: 2, text: "Lorem ipsum dolor sit et", time: "15:42 PM", fromMe: true },
  { id: 2, text: "Lorem ipsum dolor sit et", time: "15:42 PM", fromMe: true },
  { id: 3, text: "Lorem ipsum dolor sit et, consectetur adipiscing.", time: "15:42 PM" },
  { id: 4, type: "audio", time: "15:42 PM" },
];

const chats: ChatItem[] = new Array(8).fill(0).map((_, i) => ({
  id: i + 1,
  name: "ليلى الزهور",
  lastMsg: "أهلاً! كيف حالك اليوم؟ عندك أي خطط...",
  time: "صباحاً 10:20",
  unread: i < 4 ? i + 1 : 0,
  avatar: "/photos/male-icon.webp",
  online: true,
  userId: `615c8a9b4f7d4e3e4c8b456${i}`, // Mock user ID
  isBlocked: false,
}));

function ChatBubble({ m }: { m: Message }) {
  if (m.type === "audio") {
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

  const common =
    "max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm";
  return m.fromMe ? (
    <div className="flex items-end justify-end gap-2">
      <div className={`${common} bg-[#3B0C46] text-white rounded-bl-none`}>{m.text}</div>
      <Image src="/photos/male-icon.webp" alt="" width={36} height={36} className="rounded-full" />
    </div>
  ) : (
    <div className="flex items-end justify-start gap-2">
      <Image src="/photos/male-icon.webp" alt="" width={36} height={36} className="rounded-full" />
      <div className={`${common} bg-[#EDF3FF] text-[#2D1F55] rounded-br-none`}>{m.text}</div>
    </div>
  );
}

function ChatListItem({ c, onOpen }: { c: ChatItem; onOpen: (c: ChatItem) => void }) {
  return (
    <button
      onClick={() => onOpen(c)}
      className="w-full text-right px-3 py-3 rounded-xl hover:bg-white/60 transition flex items-center gap-3"
    >
      <div className="relative">
        <Image src={c.avatar} alt={c.name} width={40} height={40} className="rounded-full ring-2 ring-white" />
        {c.online && <span className="absolute -bottom-0.5 -left-0.5 size-2.5 rounded-full bg-[#28C76F] ring-2 ring-white" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#2D1F55]">{c.name}</span>
          <span className="text-xs text-[#8A97AB]">{c.time}</span>
        </div>
        <p className="text-xs text-[#8A97AB] line-clamp-1">{c.lastMsg}</p>
      </div>
      {c.unread ? (
        <span className="grid place-items-center min-w-6 h-6 rounded-full bg-[#3B0C46] text-white text-xs">{c.unread}</span>
      ) : (
        <Check size={16} className="text-[#B9C0CF]" />
      )}
    </button>
  );
}

// Helper: scrolls to latest message and lets user scroll up to see older ones
function MessagesList({
  messages,
  className,
  onReachTop,
}: {
  messages: Message[];
  className?: string;
  onReachTop?: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on mount
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  // If new message appended and user is near bottom, keep pinned to bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const handleScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget;
    if (el.scrollTop <= 40) {
      onReachTop?.(); // load older messages here
    }
  };

  return (
    <div ref={scrollRef} onScroll={handleScroll} className={className}>
      <div className="space-y-4">
        {messages.map((m, idx) => (
          <div key={`${m.id}-${idx}`} className="space-y-1">
            <ChatBubble m={m} />
            <div className={`text-[10px] text-[#8A97AB] ${m.fromMe ? "text-end me-11" : "text-start ms-11"}`}>
              {m.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const Chats = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<ChatItem | null>(null);
  const [messageText, setMessageText] = useState("");
  const [chatList, setChatList] = useState<ChatItem[]>(chats);
  const [loading, setLoading] = useState(false);

  // Extract current locale from pathname
  const locale = useLocale();

  const openChat = (c: ChatItem) => {
    setActiveChat(c);
    setIsOpen(true);
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      setMessageText("");
    }
  };

  const handleBlockUser = async (userId: string) => {
    if (!userId || loading) return;
    
    setLoading(true);
    try {
      await api.post(`/users/${userId}/block`, {
        reason: "Inappropriate behavior"
      });

      // Update chat list to mark user as blocked
      setChatList(prev => prev.map(chat => 
        chat.userId === userId ? { ...chat, isBlocked: true } : chat
      ));

      // Update active chat if it's the blocked user
      if (activeChat?.userId === userId) {
        setActiveChat(prev => prev ? { ...prev, isBlocked: true } : null);
      }

      alert("تم حظر المستخدم بنجاح");
    } catch (error: any) {
      console.error("Error blocking user:", error);
      alert(error?.response?.data?.message || "حدث خطأ أثناء حظر المستخدم");
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockUser = async (userId: string) => {
    if (!userId || loading) return;
    
    setLoading(true);
    try {
      await api.delete(`/users/${userId}/block`);

      // Update chat list to mark user as unblocked
      setChatList(prev => prev.map(chat => 
        chat.userId === userId ? { ...chat, isBlocked: false } : chat
      ));

      // Update active chat if it's the unblocked user
      if (activeChat?.userId === userId) {
        setActiveChat(prev => prev ? { ...prev, isBlocked: false } : null);
      }

      alert("تم إلغاء حظر المستخدم بنجاح");
    } catch (error: any) {
      console.error("Error unblocking user:", error);
      alert(error?.response?.data?.message || "حدث خطأ أثناء إلغاء حظر المستخدم");
    } finally {
      setLoading(false);
    }
  };

  const BlockMenuItem = ({ chat }: { chat: ChatItem | null }) => {
    if (!chat) return null;

    return (
      <DropdownMenuItem 
        className='text-[#301B69] font-medium text-lg'
        onClick={() => {
          if (chat.isBlocked) {
            handleUnblockUser(chat.userId);
          } else {
            handleBlockUser(chat.userId);
          }
        }}
        disabled={loading}
      >
        <div className='flex items-center gap-3 w-full'>
          <Ban size={22} color='#301B69' />
          {chat.isBlocked ? "إلغاء حظر المستخدم" : "حظر المستخدم"}
        </div>
      </DropdownMenuItem>
    );
  };

  return (
    <ProtectedRoute>
      <section className='relative pt-28 md:pt-40 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff]'>
        <Image src="/photos/terms-bg.webp" alt='Terms Background' width={100} height={100} className='absolute w-full inset-x-0 top-0 z-1' />
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
              {chatList.map((c) => (
                <ChatListItem key={c.id} c={c} onOpen={openChat} />
              ))}
            </div>
          </aside>

          {/* Left: Chat window (desktop only) */}
          <div className={`hidden lg:block lg:col-span-8 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E3EBFF] shadow-xl overflow-hidden`}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F2FA]">
              <div className="flex items-center gap-3">
                <ArrowRight className="text-[#2D1F55]" />
                <div className="relative">
                  <Image src="/photos/male-icon.webp" alt="" width={44} height={44} className="rounded-full ring-4 ring-white" />
                  <span className="absolute -bottom-0.5 -left-0.5 size-3 rounded-full bg-[#28C76F] ring-2 ring-white" />
                </div>
                <div>
                  <div className="font-semibold text-[#2D1F55]">{activeChat?.name || "ليلى الزهور"}</div>
                  <div className="text-xs text-[#8A97AB]">
                    {activeChat?.isBlocked ? "محظور" : "نشط الآن"}
                  </div>
                </div>
              </div>
              <DropdownMenu dir={locale === "ar" ? 'rtl' : 'ltr'}>
                <DropdownMenuTrigger disabled={loading}>
                  <CircleEllipsis className="text-[#2D1F55]" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side='bottom' className='transform rtl:translate-x-[5rem] ltr:-translate-x-[5rem] min-w-48'>
                  <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                    <div className='flex items-center gap-3 w-full'>
                      <MessageSquareHeart size={22} color='#301B69' />
                      اطلب خطوبة
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                    <div className='flex items-center gap-3 w-full'>
                      <Volume2 size={22} color='#301B69' />
                      كتم
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                    <div className='flex items-center gap-3 w-full'>
                      <Trash2 size={22} color='#301B69' />
                      مسح المحادثة
                    </div>
                  </DropdownMenuItem>
                  <BlockMenuItem chat={activeChat} />
                  <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                    <div className='flex items-center gap-3 w-full'>
                      <Flag size={22} color='#301B69' />
                      ابلغ
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Messages */}
            {activeChat?.isBlocked ? (
              <div className="flex items-center justify-center h-[60vh] text-center text-[#8A97AB]">
                <div>
                  <Ban size={48} className="mx-auto mb-4 text-[#FF6B6B]" />
                  <p className="text-lg font-semibold">تم حظر هذا المستخدم</p>
                  <p className="text-sm">لا يمكنك إرسال أو استقبال الرسائل</p>
                </div>
              </div>
            ) : (
              <MessagesList
                messages={messages}
                className="max-h-[60vh] overflow-y-auto p-3 md:p-6"
                onReachTop={() => {
                  // TODO: fetch older messages
                }}
              />
            )}

            {/* Input */}
            {!activeChat?.isBlocked && (
              <div className="p-4">
                <div className="flex items-center gap-2 rounded-4xl bg-[#F6F8FE] border border-[#E3E7EC] p-2">
                  <input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="رسالة"
                    className="flex-1 bg-transparent px-3 outline-none placeholder:text-[#8A97AB] text-[#2D1F55]"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="grid place-items-center size-10 rounded-full bg-[#3B0C46] text-white"
                  >
                    {messageText.trim() ? (
                      <Send size={18} />
                    ) : (
                      <Mic size={18} />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile slide-in chat window */}
          <div className="lg:hidden">
            {/* Overlay */}
            <div
              onClick={() => setIsOpen(false)}
              className={`fixed inset-0 z-[70] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            />
            {/* Panel */}
            <div
              className={`fixed inset-y-0 right-0 z-[70] p-4 pt-28 bg-gradient-to-b from-[#E0DAFF] to-[#fff] w-full transform transition-transform duration-300 ease-out
            ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
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
                      <div className="font-semibold text-[#2D1F55]">{activeChat?.name ?? "..."}</div>
                      <div className="text-xs text-[#8A97AB]">
                        {activeChat?.isBlocked ? "محظور" : "نشط الآن"}
                      </div>
                    </div>
                    <div className="relative">
                      <Image
                        src={activeChat?.avatar ?? "/photos/male-icon.webp"}
                        alt=""
                        width={44}
                        height={44}
                        className="rounded-full ring-4 ring-white"
                      />
                      {!activeChat?.isBlocked && (
                        <span className="absolute -bottom-0.5 -left-0.5 size-3 rounded-full bg-[#28C76F] ring-2 ring-white" />
                      )}
                    </div>
                  </div>
                  <DropdownMenu dir={locale === "ar" ? 'rtl' : 'ltr'}>
                    <DropdownMenuTrigger disabled={loading}>
                      <CircleEllipsis className="text-[#2D1F55]" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side='bottom' className='transform rtl:translate-x-[5rem] ltr:-translate-x-[5rem] min-w-48'>
                      <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                        <div className='flex items-center gap-3 w-full'>
                          <MessageSquareHeart size={22} color='#301B69' />
                          اطلب خطوبة
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                        <div className='flex items-center gap-3 w-full'>
                          <Volume2 size={22} color='#301B69' />
                          كتم
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                        <div className='flex items-center gap-3 w-full'>
                          <Trash2 size={22} color='#301B69' />
                          مسح المحادثة
                        </div>
                      </DropdownMenuItem>
                      <BlockMenuItem chat={activeChat} />
                      <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                        <div className='flex items-center gap-3 w-full'>
                          <Flag size={22} color='#301B69' />
                          ابلغ
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Messages (take available height and scroll) */}
                {activeChat?.isBlocked ? (
                  <div className="flex items-center justify-center flex-1 text-center text-[#8A97AB]">
                    <div>
                      <Ban size={48} className="mx-auto mb-4 text-[#FF6B6B]" />
                      <p className="text-lg font-semibold">تم حظر هذا المستخدم</p>
                      <p className="text-sm">لا يمكنك إرسال أو استقبال الرسائل</p>
                    </div>
                  </div>
                ) : (
                  <MessagesList
                    messages={messages}
                    className="flex-1 overflow-y-auto p-3 md:p-6 min-h-0"
                    onReachTop={() => {
                      // TODO: fetch older messages
                    }}
                  />
                )}

                {/* Input (sticks to bottom) */}
                {!activeChat?.isBlocked && (
                  <div className="p-4 border-t border-[#F0F2FA] shrink-0">
                    <div className="flex items-center gap-2 rounded-4xl bg-[#F6F8FE] border border-[#E3E7EC] p-2">
                      <input
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="رسالة"
                        className="flex-1 bg-transparent px-3 outline-none placeholder:text-[#8A97AB] text-[#2D1F55]"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="grid place-items-center size-10 rounded-full bg-[#3B0C46] text-white"
                      >
                        {messageText.trim() ? (
                          <Send size={18} />
                        ) : (
                          <Mic size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* End mobile panel */}
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default Chats;