import { useState, useEffect, useCallback, useRef } from "react";
import { useSocket } from "@/context/SocketContext";
import { chatService, Message, Conversation } from "@/services/chatService";
import { useAuth } from "@/context/AuthContext";



export function useConversations() {
  const { socket } = useSocket();
  const { profile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await chatService.getConversations(1, 50);
        setConversations(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  // Listen for new messages to update conversation list
  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (data: { message: Message; conversationId: string }) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === data.conversationId
            ? {
                ...conv,
                lastMessage: data.message.content,
                lastMessageAt: data.message.createdAt,
              }
            : conv
        )
      );
    };

    socket.on("message_received", handleMessageReceived);

    return () => {
      socket.off("message_received", handleMessageReceived);
    };
  }, [socket]);

  const refreshConversations = useCallback(async () => {
    try {
      const response = await chatService.getConversations(1, 50);
      setConversations(response.data);
    } catch (err: any) {
    }
  }, []);

  return {
    conversations,
    loading,
    error,
    refreshConversations,
  };
}


export function useChat(conversationId: string | null) {
  const { socket, isConnected } = useSocket();
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { refreshConversations } = useConversations();
  // Load initial messages and conversation details
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      setIsOtherUserOnline(false);
      return;
    }

    const loadMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await chatService.getConversationMessages(conversationId, 1, 50);
        setMessages(response.data);
        setHasMoreMessages(response.page < response.totalPages);
        setCurrentPage(1);

        // Get conversation details to determine other participant
        const conversation = await chatService.getConversationById(conversationId);
        const otherUserId = conversation.participant1Id === profile?.id
          ? conversation.participant2Id
          : conversation.participant1Id;

        // Get initial presence status of the other user
        try {
          const presence = await chatService.getUserPresence(otherUserId);
          setIsOtherUserOnline(presence.isOnline);
        } catch (err) {
          setIsOtherUserOnline(false);
        }

      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [conversationId, profile?.id]);

  // Join conversation room when conversationId changes
  useEffect(() => {
    if (!socket || !conversationId || !isConnected) return;

    socket.emit("join_conversation", { conversationId }, (response: any) => {
      if (response?.success) {
      } else {
      }
    });

    // Cleanup when leaving conversation or unmounting
    return () => {
      if (socket && conversationId) {
        socket.emit("leave_conversation", { conversationId });
      }
    };
  }, [socket, conversationId, isConnected]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleMessageReceived = (data: { message: Message; conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) => {
          // Check if this message already exists (avoid duplicates)
          const exists = prev.some((msg) => msg.id === data.message.id);
          if (exists) {
            return prev;
          }

          // Check if this is our own message (we already have the optimistic version)
          if (data.message.senderId === profile?.id) {
            // Replace the optimistic message with the real one
            const hasOptimistic = prev.some((msg) => msg.id.toString().startsWith('temp-'));
            if (hasOptimistic) {
              // Replace the last optimistic message with this real message
              const newMessages = [...prev];
              const lastOptimisticIndex = newMessages.findLastIndex((msg) =>
                msg.id.toString().startsWith('temp-') &&
                msg.content === data.message.content
              );
              if (lastOptimisticIndex !== -1) {
                newMessages[lastOptimisticIndex] = data.message;
                return newMessages;
              }
            }
          }

          // Add new message from other user
          return [...prev, data.message];
        });
      }
    };

    const handleMessageDelivered = (data: { messageId: string; conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === data.messageId ? { ...msg, status: "delivered" as const } : msg
          )
        );
      }
    };

    const handleMessageRead = (data: { conversationId: string; readBy: string }) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === profile?.id && msg.senderId !== data.readBy
              ? { ...msg, status: "read" as const }
              : msg
          )
        );
      }
    };

    const handleUserTyping = (data: { userId: string; conversationId: string; isTyping: boolean }) => {
      if (data.conversationId === conversationId && data.userId !== profile?.id) {
        setIsTyping(data.isTyping);
      }
    };

    const handleUserOnline = (data: { userId: string }) => {
      // Check if this user is in the current conversation
      if (data.userId !== profile?.id) {
        setIsOtherUserOnline(true);
      }
    };

    const handleUserOffline = (data: { userId: string }) => {
      // Check if this user is in the current conversation
      if (data.userId !== profile?.id) {
        setIsOtherUserOnline(false);
      }
    };

    const handleNewMessage = (message: Message) => {      
      setMessages(prev => [...prev, message]);
      
      // Update last message in conversations list
      if (refreshConversations) {
        refreshConversations();
      }
    };

    socket.on("message_received", handleMessageReceived);
    socket.on("message_delivered", handleMessageDelivered);
    socket.on("message_read", handleMessageRead);
    socket.on("user_typing", handleUserTyping);
    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOffline);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("message_received", handleMessageReceived);
      socket.off("message_delivered", handleMessageDelivered);
      socket.off("message_read", handleMessageRead);
      socket.off("user_typing", handleUserTyping);
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, conversationId, profile?.id, refreshConversations]);

  // Send message via socket
  const sendMessage = useCallback(
    async (content: string, messageType: "text" | "audio" = "text", fileUrl?: string, audioDuration?: number) => {
      if (!socket || !conversationId || !content.trim() || !profile) {
        return;
      }

      // Create optimistic message (show immediately)
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`, // Temporary ID
        conversationId,
        senderId: profile.id,
        content: content.trim(),
        messageType,
        status: "sent",
        isDeleted: false,
        deletedAt: null,
        readAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        fileUrl: fileUrl || null,
        audioDuration: audioDuration || null,
        sender: {
          id: profile.id,
          fullName: profile.fullName,
          chartNumber: profile.chartNumber,
        },
      };

      // Add optimistic message to UI immediately
      setMessages((prev) => [...prev, optimisticMessage]);

      try {
        socket.emit(
          "send_message",
          {
            conversationId,
            message: {
              content: content.trim(),
              messageType,
              fileUrl,
              audioDuration,
            },
          },
          (response: any) => {
            if (response?.success) {
              // Replace optimistic message with real message from server
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === optimisticMessage.id ? response.message : msg
                )
              );
            } else {
              // Remove optimistic message on error
              setError(response?.error || "Failed to send message");
              setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id));
            }
          }
        );
      } catch (err: any) {
        setError(err.message || "Failed to send message");
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id));
      }
    },
    [socket, conversationId, profile]
  );

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (!socket || !conversationId) return;

    socket.emit("message_read", { conversationId }, (response: any) => {
      if (!response?.success) {
      }
    });
  }, [socket, conversationId]);

  // Typing indicators
  const startTyping = useCallback(() => {
    if (!socket || !conversationId) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socket.emit("typing_start", { conversationId });

    // Auto-stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing_stop", { conversationId });
    }, 3000);
  }, [socket, conversationId]);

  const stopTyping = useCallback(() => {
    if (!socket || !conversationId) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    socket.emit("typing_stop", { conversationId });
  }, [socket, conversationId]);

  // Load more messages (pagination)
  const loadMoreMessages = useCallback(async () => {
    if (!conversationId || !hasMoreMessages || loading) return;

    try {
      const nextPage = currentPage + 1;
      const response = await chatService.getConversationMessages(conversationId, nextPage, 50);
      setMessages((prev) => [...response.data, ...prev]);
      setHasMoreMessages(response.page < response.totalPages);
      setCurrentPage(nextPage);
    } catch (err: any) {
    }
  }, [conversationId, hasMoreMessages, loading, currentPage]);

  return {
    messages,
    loading,
    error,
    isTyping,
    isOtherUserOnline,
    hasMoreMessages,
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping,
    loadMoreMessages,
  };
}

