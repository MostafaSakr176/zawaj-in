// This file contains TypeScript types for the chat system
// Note: These types are also defined in services/chatService.ts
// This file serves as a central reference

export type MessageType = "text" | "image" | "audio" | "system";
export type MessageStatus = "sent" | "delivered" | "read";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: MessageType;
  status: MessageStatus;
  isDeleted: boolean;
  deletedAt: Date | null;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  fileUrl?: string | null;
  audioDuration?: number | null;
  sender?: {
    id: string;
    fullName: string;
    chartNumber: string;
  };
}

export interface Conversation {
  id: string;
  participant1Id: string;
  participant2Id: string;
  matchId: string;
  lastMessage: string | null;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  participant1?: {
    id: string;
    fullName: string;
    chartNumber: string;
  };
  participant2?: {
    id: string;
    fullName: string;
    chartNumber: string;
  };
  unreadCount?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

// Socket event payloads
export interface SocketEventPayloads {
  // Client → Server
  join_conversation: { conversationId: string };
  leave_conversation: { conversationId: string };
  send_message: {
    conversationId: string;
    message: {
      content: string;
      messageType?: MessageType;
    };
  };
  typing_start: { conversationId: string };
  typing_stop: { conversationId: string };
  message_read: { conversationId: string };

  // Server → Client
  user_online: { userId: string };
  user_offline: { userId: string };
  message_received: {
    message: Message;
    conversationId: string;
  };
  message_delivered: {
    messageId: string;
    conversationId: string;
  };
  message_read_update: {
    conversationId: string;
    readBy: string;
  };
  user_typing: {
    userId: string;
    conversationId: string;
    isTyping: boolean;
  };
}

// Socket response types
export interface SocketResponse {
  success: boolean;
  error?: string;
  data?: any;
}

// Chat hook return types
export interface UseChatReturn {
  messages: Message[];
  loading: boolean;
  error: string | null;
  isTyping: boolean;
  hasMoreMessages: boolean;
  sendMessage: (content: string) => Promise<void>;
  markAsRead: () => Promise<void>;
  startTyping: () => void;
  stopTyping: () => void;
  loadMoreMessages: () => Promise<void>;
}

export interface UseConversationsReturn {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  refreshConversations: () => Promise<void>;
}
