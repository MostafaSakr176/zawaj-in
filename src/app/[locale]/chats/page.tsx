"use client";

import Image from "next/image";
import { Ellipsis, ArrowRight, Mic, Search, Check, Play, Send, CheckCheck, CircleEllipsis, MessageSquareHeart, ArrowLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Volume2, Trash2, Ban, Flag } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from 'next/navigation';
import { useLocale } from "next-intl";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { useConversations, useChat } from "@/hooks/useChat";
import { useAuth } from "@/context/AuthContext";
import { Conversation, Message } from "@/services/chatService";
import api from "@/lib/axiosClient";
import { useTranslations } from "next-intl";
import { chatService } from "@/services/chatService";
import { useSocket } from "@/context/SocketContext";

function AudioPlayer({ audioUrl, duration, fromMe }: { audioUrl: string; duration?: number; fromMe: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration || 0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { profile } = useAuth();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setAudioDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);
  // test github actions
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  return (
    <div className={`rounded-full ${fromMe ? 'rounded-bl-none bg-[#3B0C46]' : 'rounded-br-none bg-white border border-[#0000001A]'} px-3 py-2 flex items-center gap-3`}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <button
        onClick={togglePlay}
        className={`grid place-items-center size-7 rounded-full ${fromMe ? 'bg-white text-[#3B0C46]' : 'bg-[#F5E6FF] text-[#301B69]'}`}
      >
        {isPlaying ? (
          <div className="w-2 h-2.5 flex gap-0.5">
            <div className="w-0.5 h-full bg-current" />
            <div className="w-0.5 h-full bg-current" />
          </div>
        ) : (
          <Play size={12} fill="currentColor" />
        )}
      </button>
      <div className="w-40 h-1.5 rounded bg-[#E9ECF6] overflow-hidden">
        <div className="h-full bg-[#B9C0CF] transition-all" style={{ width: `${progress}%` }} />
      </div>
      <span className={`text-xs ${fromMe ? 'text-white/70' : 'text-[#8A97AB]'}`}>
        {formatTime(isPlaying ? currentTime : audioDuration)}
      </span>
    </div>
  );
}

function ChatBubble({ m, currentUserId }: { m: Message; currentUserId: string }) {
  const fromMe = m.senderId === currentUserId;
  const { profile } = useAuth();


  if (m.messageType === "audio" && m.fileUrl) {
    return (
      <div className={`flex items-end gap-3 ${fromMe ? 'justify-end' : 'justify-start'}`}>
        {!fromMe && <Image src={profile?.gender === "male" ? "/icons/female-img.webp" : "/photos/male-icon.png"} alt="" width={36} height={36} className="rounded-full" />}
        <AudioPlayer audioUrl={m.fileUrl} duration={m.audioDuration || undefined} fromMe={fromMe} />
        {fromMe && <Image src={profile?.gender === "female" ? "/icons/female-img.webp" : "/photos/male-icon.png"} alt="" width={36} height={36} className="rounded-full" />}
      </div>
    );
  }

  const common = "max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm";

  return fromMe ? (
    <div className="flex items-end justify-end gap-2">
      <div className={`${common} bg-[#3B0C46] text-white rounded-bl-none`}>
        {m.content}
        {m.status === "sent" ? (<Check color="#8A97AB" size={16} />) : m.status === "delivered" ? (<CheckCheck color="#8A97AB" size={16} />) : m.status === "read" ? (<CheckCheck color="#3B0C46" size={16} />) : null}
      </div>
      <Image src={profile?.gender === "female" ? "/icons/female-img.webp" : "/photos/male-icon.png"} alt="" width={36} height={36} className="rounded-full" />
    </div>
  ) : (
    <div className="flex items-end justify-start gap-2">
      <Image src={profile?.gender === "male" ? "/icons/female-img.webp" : "/photos/male-icon.png"} alt="" width={36} height={36} className="rounded-full" />
      <div className={`${common} bg-[#EDF3FF] text-[#2D1F55] rounded-br-none`}>
        {m.content}
      </div>
    </div>
  );
}

// src/app/[locale]/chats/page.tsx - Update the ChatListItem component
function ChatListItem({
  c,
  onOpen,
  currentUserId,
  isActive = false
}: {
  c: Conversation;
  onOpen: (c: Conversation) => void;
  currentUserId: string;
  isActive?: boolean;
}) {
  const { profile } = useAuth();
  const { isUserOnline } = useSocket(); // Add this hook

  // Determine the other participant
  const otherParticipant = c.participant1Id === currentUserId ? c.participant2 : c.participant1;

  // Check if the other participant is online in real-time
  const isOnline = isUserOnline(otherParticipant?.id || '');

  const formatTime = (date: Date | null | string) => {
    if (!date) return "";
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
      className={`w-full text-right px-3 py-3 transition flex items-center gap-3 ${isActive
        ? 'bg-[#4B164C]/5'
        : 'hover:bg-white/60'
        }`}
    >
      <div className="relative">
        <Image
          src={profile?.gender === "male" ? "/icons/female-img.webp" : "/photos/male-icon.png"}
          alt={otherParticipant?.fullName || "User"}
          width={40}
          height={40}
          className="rounded-full ring-2 ring-white"
        />
        {/* Real-time online indicator */}
        {isOnline && (
          <span className="absolute -bottom-0.5 -left-0.5 size-2.5 rounded-full bg-[#28C76F] ring-2 ring-white animate-pulse" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className={`font-semibold ${isActive ? 'text-[#3B0C46]' : 'text-[#2D1F55]'}`}>
            {otherParticipant?.fullName || "مستخدم"}
          </span>
          <span className="text-xs text-[#8A97AB]">{formatTime(c.lastMessageAt)}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#8A97AB] line-clamp-1">
            {c.lastMessagePreview || "ابدأ المحادثة"}
          </p>
          {/* Online status text */}
          {isOnline && (
            <span className="text-xs text-[#28C76F] font-medium">
              Online
            </span>
          )}
        </div>
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
  const [blockLoading, setBlockLoading] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<Set<string>>(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { profile } = useAuth();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('conversation');
  const locale = useLocale();
  const t = useTranslations("chats");


  // Load conversations list
  const { conversations, loading: conversationsLoading, refreshConversations } = useConversations();

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

  // Handle conversation ID from URL parameter or set first chat as default
  useEffect(() => {
    if (conversationsLoading || conversations.length === 0) return;

    if (conversationId) {
      // If there's a specific conversation ID in URL, open that one
      const targetConversation = conversations.find(c => c.id === conversationId);
      if (targetConversation) {
        setActiveConversation(targetConversation);
        setIsOpen(true); // Open on mobile
        // Mark messages as read
        setTimeout(() => {
          markAsRead();
        }, 500);
      }
    } else if (!activeConversation) {
      // If no specific conversation and no active conversation, open the first one
      const firstConversation = conversations[0];
      if (firstConversation) {
        setActiveConversation(firstConversation);
        // Don't auto-open on mobile unless there's a URL parameter
        // setIsOpen(false); 
        // Mark messages as read
        setTimeout(() => {
          markAsRead();
        }, 500);
      }
    }
  }, [conversationId, conversations, conversationsLoading, markAsRead, activeConversation]);

  // Refresh conversations when component mounts to get any new conversations
  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      // Update duration every second
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = async () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder || mediaRecorder.state === "inactive") return;

    return new Promise<void>((resolve) => {
      mediaRecorder.onstop = async () => {
        // Stop all tracks
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());

        // Clear interval
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
          recordingIntervalRef.current = null;
        }

        // Create audio blob
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const duration = recordingDuration;

        setIsRecording(false);
        setRecordingDuration(0);

        // Upload and send
        await uploadAndSendAudio(audioBlob, duration);
        resolve();
      };

      mediaRecorder.stop();
    });
  };

  const cancelRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;

    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach((track) => track.stop());

    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    setIsRecording(false);
    setRecordingDuration(0);
    audioChunksRef.current = [];
  };

  const uploadAndSendAudio = async (audioBlob: Blob, duration: number) => {
    if (!activeConversation) return;

    setIsUploadingAudio(true);
    try {
      const { chatService } = await import("@/services/chatService");
      const { fileUrl } = await chatService.uploadAudio(audioBlob);

      // Send audio message
      sendMessage("Audio message", "audio", fileUrl, duration);
    } catch (error) {
      console.error("Error uploading audio:", error);
      alert("Failed to upload audio message");
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getOtherParticipant = (conv: Conversation | null) => {
    if (!conv || !profile) return null;
    return conv.participant1Id === profile.id ? conv.participant2 : conv.participant1;
  };

  const otherParticipant = getOtherParticipant(activeConversation);

  const handleBlockUser = async (userId: string) => {
    if (!userId || blockLoading) return;

    setBlockLoading(true);
    try {
      await api.post(`/users/${userId}/block`, {
        reason: "Inappropriate behavior"
      });

      // Add user to blocked set
      setBlockedUsers(prev => new Set([...prev, userId]));

      alert(t("blockSuccess"));
    } catch (error: any) {
      console.error("Error blocking user:", error);
      alert(error?.response?.data?.message || t("blockError"));
    } finally {
      setBlockLoading(false);
    }
  };

  const handleUnblockUser = async (userId: string) => {
    if (!userId || blockLoading) return;

    setBlockLoading(true);
    try {
      await api.delete(`/users/${userId}/block`);

      // Remove user from blocked set
      setBlockedUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });

      alert(t("unblockSuccess"));
    } catch (error: any) {
      console.error("Error unblocking user:", error);
      alert(error?.response?.data?.message || t("unblockError"));
    } finally {
      setBlockLoading(false);
    }
  };

  const handleDeleteConversation = async () => {
    if (!activeConversation) return;

    const confirmDelete = confirm(t("deleteConversationConfirm") || "Are you sure you want to delete all messages in this conversation? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      const { chatService } = await import("@/services/chatService");
      await chatService.deleteConversation(activeConversation.id);

      // Refresh the conversation list (conversation stays but messages are cleared)
      await refreshConversations();

      alert(t("deleteConversationSuccess") || "All messages deleted successfully");

      // Optionally reload messages to show empty state
      window.location.reload();
    } catch (error: any) {
      console.error("Error deleting messages:", error);
      alert(error?.response?.data?.message || t("deleteConversationError") || "Failed to delete messages");
    }
  };

  const BlockMenuItem = ({ userId }: { userId: string | null }) => {
    if (!userId) return null;

    const isBlocked = blockedUsers.has(userId);

    return (
      <DropdownMenuItem
        className='text-[#301B69] font-medium text-lg'
        onClick={() => {
          if (isBlocked) {
            handleUnblockUser(userId);
          } else {
            handleBlockUser(userId);
          }
        }}
        disabled={blockLoading}
      >
        <div className='flex items-center gap-3 w-full'>
          <Ban size={22} color='#301B69' />
          {blockLoading ? t("blockLoading") : isBlocked ? t("unblockUser") : t("blockUser")}
        </div>
      </DropdownMenuItem>
    );
  };

  // Check if current conversation is with a blocked user
  const isCurrentUserBlocked = otherParticipant ? blockedUsers.has(otherParticipant.id) : false;

  // Engagement request handler
  const handleSendEngagementRequest = async () => {
    if (!activeConversation || !otherParticipant) return;
    try {
      await chatService.sendEngagementRequest(
        otherParticipant.id,
        activeConversation.id,
        t("engagementRequestMessage") // You can add this to your translations
      );
      alert(t("engagementRequestSent")); // Add this to your translations
    } catch (error: any) {
      alert(error?.response?.data?.message || t("engagementRequestError")); // Add this to your translations
    }
  };

  return (
    <ProtectedRoute>
      <section className="relative pt-26 md:pt-36 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff]">
        <Image src="/photos/terms-bg.webp" alt="Terms Background" width={100} height={100} className="absolute w-full inset-x-0 top-0 z-1" />
        <div className="max-w-7xl mx-auto px-4 md:px-0 relative z-2">

          {conversationsLoading ?
            <div className='w-[full] h-[75vh] flex items-center justify-center overflow-hidden'>
              <div className="w-0 h-[15rem] flex items-center justify-center transform rotate-30 overflow-hidden animate-[expand_2s_ease-out_forwards]">
                <div className="text-6xl font-bold transform -rotate-30 text-nowrap">
                  <span className="text-[#301B69]">زواج</span>{" "}
                  <span className="text-[#E30BCD]">إن</span>
                </div>
              </div>
            </div>
            : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full">
                <svg width="207" height="207" viewBox="0 0 207 207" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M82.5194 45.0781C80.1938 45.0834 77.9221 45.7787 75.9921 47.0762C74.062 48.3736 72.5605 50.2147 71.6778 52.3662C70.7929 50.2127 69.2885 48.3703 67.3553 47.0728C65.4221 45.7753 63.1471 45.0811 60.8189 45.0781C57.5912 45.3545 54.5877 46.8421 52.4118 49.2421C50.2359 51.642 49.0487 54.7764 49.0889 58.0156C49.0889 72.1951 68.6676 83.7354 71.6778 83.7354C74.6879 83.7354 94.2666 72.1951 94.2666 58.0156C94.3064 54.7737 93.1169 51.6369 90.9374 49.2366C88.7579 46.8362 85.7501 45.3504 82.5194 45.0781Z" stroke="url(#paint0_linear_9524_17660)" strokeWidth="8.625" strokeLinecap="round" stroke-linejoin="round" />
                  <path d="M139.646 103.5L121.576 126.089H148.685L130.615 148.678" stroke="url(#paint1_linear_9524_17660)" strokeWidth="8.625" strokeLinecap="round" stroke-linejoin="round" />
                  <path d="M134.722 61.7284C131.16 36.9315 104.363 17.6719 71.8721 17.6719C36.9409 17.6719 8.625 39.9157 8.625 67.3691C8.8307 74.3672 10.6625 81.2213 13.9754 87.3889C17.2882 93.5566 21.9912 98.8685 27.7121 102.904L29.2474 130.401L53.2594 114.876C54.9154 115.272 56.5915 115.62 58.2877 115.919" stroke="url(#paint2_linear_9524_17660)" strokeWidth="8.625" strokeLinecap="round" stroke-linejoin="round" />
                  <path d="M135.119 76.6133C170.05 76.6133 198.366 98.8572 198.366 126.311C198.16 133.309 196.329 140.163 193.016 146.33C189.703 152.498 185 157.81 179.279 161.846L177.744 189.342L153.732 173.817C147.636 175.284 141.388 176.022 135.119 176.016C100.188 176.016 71.8633 153.764 71.8633 126.319C71.8633 98.8744 100.188 76.6133 135.119 76.6133Z" stroke="url(#paint3_linear_9524_17660)" strokeWidth="8.625" strokeLinecap="round" stroke-linejoin="round" />
                  <defs>
                    <linearGradient id="paint0_linear_9524_17660" x1="68.0122" y1="58.8416" x2="67.1745" y2="83.4792" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#301B69" />
                      <stop offset="1" stopColor="#B07CD1" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_9524_17660" x1="132.931" y1="119.585" x2="131.03" y2="148.286" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#301B69" />
                      <stop offset="1" stopColor="#B07CD1" />
                    </linearGradient>
                    <linearGradient id="paint2_linear_9524_17660" x1="61.4431" y1="57.8078" x2="58.8911" y2="129.646" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#301B69" />
                      <stop offset="1" stopColor="#B07CD1" />
                    </linearGradient>
                    <linearGradient id="paint3_linear_9524_17660" x1="124.851" y1="116.749" x2="122.307" y2="188.588" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#301B69" />
                      <stop offset="1" stopColor="#B07CD1" />
                    </linearGradient>
                  </defs>
                </svg>
                <h6 className="text-[#301B69] text-4xl font-bold mb-3 mt-6">
                  {t("noConversations")}
                </h6>
                <p className="text-[#301B69C2] text-lg font-normal max-w-lg">{t("noConversationsMessage")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Right: Conversations list */}
                <aside className="h-[75vh] md:h-auto lg:col-span-4 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E3EBFF] shadow-xl p-3">
                  {/* Search */}
                  <div className="relative mb-3">
                    <input
                      className="w-full ps-10 pe-3 py-2 rounded-xl border border-[#E3EBFF] bg-white/70 outline-none placeholder:text-[#8A97AB] text-sm"
                      placeholder={t("searchPlaceholder")}
                    />
                    <Search size={16} className="absolute top-1/2 -translate-y-1/2 rtl:left-3 ltr:right-3 text-[#8A97AB]" />
                  </div>

                  <div className="space-y-1 max-h-[70vh] overflow-auto pr-1">
                    {conversationsLoading ? (
                      <div className="text-center py-8 text-[#8A97AB]">{t("loading")}</div>
                    ) : conversations.length === 0 ? (
                      <div className="text-center py-8 text-[#8A97AB]">{t("noConversations")}</div>
                    ) : (
                      conversations.map((c) => (
                        <ChatListItem
                          key={c.id}
                          c={c}
                          onOpen={openChat}
                          currentUserId={profile?.id || ""}
                          isActive={activeConversation?.id === c.id}
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
                          <div className="relative">
                            <Image src={profile?.gender === "male" ? "/icons/female-img.webp" : "/photos/male-icon.png"} alt="" width={44} height={44} className="rounded-full ring-4 ring-white" />
                            {isOtherUserOnline && !isCurrentUserBlocked && (
                              <span className="absolute -bottom-0.5 -left-0.5 size-3 rounded-full bg-[#28C76F] ring-2 ring-white" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-[#2D1F55]">{otherParticipant.fullName}</div>
                            <div className="text-xs text-[#8A97AB]">
                              {isCurrentUserBlocked ? t("statusBlocked") : isTyping ? t("statusTyping") : isOtherUserOnline ? t("statusOnline") : t("statusOffline")}
                            </div>
                          </div>
                        </div>
                        <DropdownMenu dir={locale === "ar" ? 'rtl' : 'ltr'}>
                          <DropdownMenuTrigger disabled={blockLoading}>
                            <CircleEllipsis className="text-[#2D1F55]" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side='bottom' className='transform rtl:translate-x-[5rem] ltr:-translate-x-[5rem] min-w-48'>
                            <DropdownMenuItem className='text-[#301B69] font-medium text-lg' onClick={handleSendEngagementRequest}>
                              <div className='flex items-center gap-3 w-full'>
                                <MessageSquareHeart size={22} color='#301B69' />
                                {t("engagementRequest")}
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                              <div className='flex items-center gap-3 w-full'>
                                <Volume2 size={22} color='#301B69' />
                                {t("mute")}
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className='text-[#301B69] font-medium text-lg' onClick={handleDeleteConversation}>
                              <div className='flex items-center gap-3 w-full'>
                                <Trash2 size={22} color='#301B69' />
                                {t("deleteConversation")}
                              </div>
                            </DropdownMenuItem>
                            <BlockMenuItem userId={otherParticipant.id} />
                            <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                              <div className='flex items-center gap-3 w-full'>
                                <Flag size={22} color='#301B69' />
                                {t("report")}
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Messages */}
                      {isCurrentUserBlocked ? (
                        <div className="flex items-center justify-center h-[50vh] text-center text-[#8A97AB]">
                          <div>
                            <Ban size={48} className="mx-auto mb-4 text-[#FF6B6B]" />
                            <p className="text-lg font-semibold">{t("blockedTitle")}</p>
                            <p className="text-sm">{t("blockedDesc")}</p>
                          </div>
                        </div>
                      ) : messagesLoading ? (
                        <div className="flex items-center justify-center h-[50vh]">
                          <div className="text-[#8A97AB]">{t("messagesLoading")}</div>
                        </div>
                      ) : (
                        <MessagesList
                          messages={messages}
                          className="h-[50vh] overflow-y-auto p-3 md:p-6"
                          onReachTop={loadMoreMessages}
                          currentUserId={profile?.id || ""}
                        />
                      )}

                      {/* Input */}
                      {!isCurrentUserBlocked && (
                        <div className="p-4">
                          {isRecording ? (
                            <div className="flex items-center gap-2 rounded-4xl bg-[#FFE5E5] border border-[#FF6B6B] p-2">
                              <div className="flex-1 flex items-center gap-3 px-3">
                                <div className="size-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-sm font-medium text-[#2D1F55]">
                                  {t("recording")} {formatRecordingTime(recordingDuration)}
                                </span>
                              </div>
                              <button
                                onClick={cancelRecording}
                                className="grid place-items-center size-10 rounded-full bg-gray-400 text-white"
                                title={t("cancel")}
                              >
                                <Trash2 size={18} />
                              </button>
                              <button
                                onClick={stopRecording}
                                disabled={isUploadingAudio}
                                className="grid place-items-center size-10 rounded-full bg-[#3B0C46] text-white disabled:opacity-50"
                                title={t("send")}
                              >
                                {isUploadingAudio ? <CircleEllipsis size={18} className="animate-spin" /> : <Send size={18} />}
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 rounded-4xl bg-[#F6F8FE] border border-[#E3E7EC] p-2">
                              <input
                                value={messageText}
                                onChange={handleTyping}
                                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                onBlur={stopTyping}
                                placeholder={t("messagePlaceholder")}
                                className="flex-1 bg-transparent px-3 outline-none placeholder:text-[#8A97AB] text-[#2D1F55]"
                              />
                              <button
                                onClick={messageText.trim() ? handleSendMessage : startRecording}
                                className="grid place-items-center size-10 rounded-full bg-[#3B0C46] text-white"
                              >
                                {messageText.trim() ? <Send size={18} /> : <Mic size={18} />}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-[#8A97AB]">
                        {conversationsLoading ? (
                          <p className="text-lg">{t("loading")}</p>
                        ) : (
                          <p className="text-lg">{t("startChat")}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile slide-in chat window */}
                <div className="lg:hidden">
                  {/* Overlay */}
                  <div
                    onClick={() => setIsOpen(false)}
                    className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                      }`}
                  />
                  {/* Panel */}
                  <div
                    className={`fixed inset-y-0 right-0 z-50 p-4 pt-24 bg-gradient-to-b from-[#E0DAFF] to-[#fff] w-full transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
                      }`}
                  >
                    {activeConversation && otherParticipant && (
                      <div className="h-[75vh] rounded-2xl bg-white/80 backdrop-blur-md border-l border-[#E3EBFF] shadow-xl overflow-hidden flex flex-col min-h-0">
                        {/* Header (fixed height) */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F2FA] shrink-0">
                          <div className="flex items-center gap-3">
                            <button onClick={() => { setIsOpen(false); }}>
                              <ArrowRight className="text-[#2D1F55] ltr:hidden" />
                              <ArrowLeft className="text-[#2D1F55] rtl:hidden" />
                            </button>
                            <div className="relative">
                              <Image src={profile?.gender === "male" ? "/icons/female-img.webp" : "/photos/male-icon.png"} alt="" width={44} height={44} className="rounded-full ring-4 ring-white" />
                              {isOtherUserOnline && !isCurrentUserBlocked && (
                                <span className="absolute -bottom-0.5 -left-0.5 size-3 rounded-full bg-[#28C76F] ring-2 ring-white" />
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-[#2D1F55]">{otherParticipant.fullName}</div>
                              <div className="text-xs text-[#8A97AB]">
                                {isCurrentUserBlocked ? t("statusBlocked") : isTyping ? t("statusTyping") : isOtherUserOnline ? t("statusOnline") : t("statusOffline")}
                              </div>
                            </div>
                          </div>
                          <DropdownMenu dir={locale === "ar" ? 'rtl' : 'ltr'}>
                            <DropdownMenuTrigger disabled={blockLoading}>
                              <CircleEllipsis className="text-[#2D1F55]" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side='bottom' className='transform rtl:translate-x-[5rem] ltr:-translate-x-[5rem] min-w-48'>
                              <DropdownMenuItem className='text-[#301B69] font-medium text-lg' onClick={handleSendEngagementRequest}>
                                <div className='flex items-center gap-3 w-full'>
                                  <MessageSquareHeart size={22} color='#301B69' />
                                  {t("engagementRequest")}
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                                <div className='flex items-center gap-3 w-full'>
                                  <Volume2 size={22} color='#301B69' />
                                  {t("mute")}
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem className='text-[#301B69] font-medium text-lg' onClick={handleDeleteConversation}>
                                <div className='flex items-center gap-3 w-full'>
                                  <Trash2 size={22} color='#301B69' />
                                  {t("deleteConversation")}
                                </div>
                              </DropdownMenuItem>
                              <BlockMenuItem userId={otherParticipant.id} />
                              <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                                <div className='flex items-center gap-3 w-full'>
                                  <Flag size={22} color='#301B69' />
                                  {t("report")}
                                </div>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Messages (take available height and scroll) */}
                        {isCurrentUserBlocked ? (
                          <div className="flex-1 flex items-center justify-center text-center text-[#8A97AB]">
                            <div>
                              <Ban size={48} className="mx-auto mb-4 text-[#FF6B6B]" />
                              <p className="text-lg font-semibold">{t("blockedTitle")}</p>
                              <p className="text-sm">{t("blockedDesc")}</p>
                            </div>
                          </div>
                        ) : messagesLoading ? (
                          <div className="flex-1 flex items-center justify-center">
                            <div className="text-[#8A97AB]">{t("messagesLoading")}</div>
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
                        {!isCurrentUserBlocked && (
                          <div className="p-4 border-t border-[#F0F2FA] shrink-0">
                            {isRecording ? (
                              <div className="flex items-center gap-2 rounded-4xl bg-[#FFE5E5] border border-[#FF6B6B] p-2">
                                <div className="flex-1 flex items-center gap-3 px-3">
                                  <div className="size-2 rounded-full bg-red-500 animate-pulse" />
                                  <span className="text-sm font-medium text-[#2D1F55]">
                                    {t("recording")} {formatRecordingTime(recordingDuration)}
                                  </span>
                                </div>
                                <button
                                  onClick={cancelRecording}
                                  className="grid place-items-center size-10 rounded-full bg-gray-400 text-white"
                                  title={t("cancel")}
                                >
                                  <Trash2 size={18} />
                                </button>
                                <button
                                  onClick={stopRecording}
                                  disabled={isUploadingAudio}
                                  className="grid place-items-center size-10 rounded-full bg-[#3B0C46] text-white disabled:opacity-50"
                                  title={t("send")}
                                >
                                  {isUploadingAudio ? <CircleEllipsis size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 rounded-4xl bg-[#F6F8FE] border border-[#E3E7EC] p-2">
                                <input
                                  value={messageText}
                                  onChange={handleTyping}
                                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                  onBlur={stopTyping}
                                  placeholder={t("messagePlaceholder")}
                                  className="flex-1 bg-transparent px-3 outline-none placeholder:text-[#8A97AB] text-[#2D1F55]"
                                />
                                <button
                                  onClick={messageText.trim() ? handleSendMessage : startRecording}
                                  className="grid place-items-center size-10 rounded-full bg-[#3B0C46] text-white"
                                >
                                  {messageText.trim() ? <Send size={18} /> : <Mic size={18} />}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          {/* End mobile panel */}
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default Chats;