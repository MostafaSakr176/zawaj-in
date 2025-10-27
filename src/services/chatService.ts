import api from "@/lib/axiosClient";

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
  lastMessagePreview: string | null;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  participant1?: {
    id: string;
    fullName: string;
    chartNumber: string;
    isOnline: boolean;
  };
  participant2?: {
    id: string;
    fullName: string;
    chartNumber: string;
    isOnline: boolean;
  };
  unreadCount?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export const chatService = {
  // Get all conversations for the current user
  async getConversations(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Conversation>> {
    const response = await api.get("/chat/conversations", {
      params: { page, limit },
    });
    return {
      data: response.data.conversations,
      total: response.data.total,
      page: response.data.page,
      totalPages: response.data.totalPages,
    };
  },

  // Get a specific conversation by ID
  async getConversationById(conversationId: string): Promise<Conversation> {
    const response = await api.get(`/chat/conversations/${conversationId}`);
    return response.data;
  },

  // Get messages for a conversation
  async getConversationMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<PaginatedResponse<Message>> {
    const response = await api.get(`/chat/conversations/${conversationId}/messages`, {
      params: { page, limit },
    });
    return {
      data: response.data.messages,
      total: response.data.total,
      page: response.data.page,
      totalPages: response.data.totalPages,
    };
  },

  // Send a message via HTTP (as a fallback, typically we'll use socket)
  async sendMessage(
    conversationId: string,
    content: string,
    messageType: MessageType = "text"
  ): Promise<Message> {
    const response = await api.post(`/chat/conversations/${conversationId}/messages`, {
      content,
      messageType,
    });
    return response.data;
  },

  // Create a new conversation with a user
  async createConversation(recipientId: string): Promise<Conversation> {
    const response = await api.post("/chat/conversations", {
      recipientId,
    });
    return response.data;
  },

  // Mark messages as read
  async markMessagesAsRead(conversationId: string): Promise<void> {
    await api.put(`/chat/conversations/${conversationId}/read`);
  },

  // Delete a message
  async deleteMessage(messageId: string): Promise<void> {
    await api.delete(`/chat/messages/${messageId}`);
  },

  // Get unread count for a conversation
  async getUnreadCount(conversationId: string): Promise<number> {
    const response = await api.get(`/chat/conversations/${conversationId}/unread-count`);
    return response.data.count;
  },

  // Get user presence (online/offline status)
  async getUserPresence(userId: string): Promise<{ userId: string; isOnline: boolean; lastSeenAt: Date | null }> {
    const response = await api.get(`/chat/users/${userId}/presence`);
    return response.data;
  },

  // Upload audio file
  async uploadAudio(audioBlob: Blob): Promise<{ fileUrl: string; fileName: string }> {
    const formData = new FormData();
    
    // Determine file extension based on blob type
    let fileName = "audio.wav";
    if (audioBlob.type.includes("mp4")) {
      fileName = "audio.mp4";
    } else if (audioBlob.type.includes("aac")) {
      fileName = "audio.aac";
    } else if (audioBlob.type.includes("mpeg")) {
      fileName = "audio.wav";
    } else if (audioBlob.type.includes("wav")) {
      fileName = "audio.wav";
    }
    
    formData.append("file", audioBlob, fileName);

    const response = await api.post("/chat/upload/audio", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000, // Increase timeout for mobile uploads
    });
    return response.data;
  },

  // Upload image file
  async uploadImage(imageFile: File): Promise<{ fileUrl: string; fileName: string }> {
    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await api.post("/chat/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete a conversation
  async deleteConversation(conversationId: string): Promise<void> {
    await api.delete(`/chat/conversations/${conversationId}`);
  },

  // Send engagement request
  async sendEngagementRequest(
    recipientId: string,
    conversationId: string,
    message: string = "Will you be engaged with me?"
  ): Promise<{ success: boolean; requestId: string }> {
    const response = await api.post("/chat/engagement-requests", {
      recipientId,
      conversationId,
      message,
    });
    return response.data;
  },
};
