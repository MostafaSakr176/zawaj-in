"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';


interface OnlineUser {
  userId: string;
  isOnline: boolean;
  lastUpdate: Date;
}

interface Notification {
  id: string;
  type: 'new_message' | 'new_match' | 'new_like' | 'system';
  title: string;
  body: string;
  data?: any;
  timestamp: string;
}

// src/context/SocketContext.tsx - Update the interface
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Map<string, OnlineUser>;
  onlineUserIds: Set<string>; // Add this
  isUserOnline: (userId: string) => boolean; // Add this
  notifications: Notification[];
  connect: () => void;
  disconnect: () => void;
  setUserStatus: (isOnline: boolean) => Promise<void>;
  clearNotifications: () => void;
  addNotification: (notification: Notification) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { profile, accessToken } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Map<string, OnlineUser>>(new Map());
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());

  const addOrUpdateUser = useCallback((userId: string, isOnline: boolean) => {
    setOnlineUsers(prev => {
      const newMap = new Map(prev);
      newMap.set(userId, { userId, isOnline, lastUpdate: new Date() });
      return newMap;
    });

    // Also maintain a Set of online user IDs for quick lookup
    setOnlineUserIds(prev => {
      const newSet = new Set(prev);
      if (isOnline) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  }, []);

  // Add method to check if user is online
  const isUserOnline = useCallback((userId: string) => {
    return onlineUserIds.has(userId);
  }, [onlineUserIds]);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep only last 50
  }, []);

  const connect = useCallback(() => {
    if (!accessToken || !profile || socket?.connected) return;

    const apiUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8081';

    const newSocket = io(apiUrl, {
      path: '/socket.io',
      auth: {
        token: accessToken
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Connection Events
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false);
      console.log('Socket disconnected:', reason);
    });

    newSocket.on('connect_error', (error) => {
      setIsConnected(false);
      console.error('Socket connection error:', error);
    });

    // User Status Events
    newSocket.on('user_status_changed', (data: { userId: string; isOnline: boolean }) => {
      addOrUpdateUser(data.userId, data.isOnline);
    });

    newSocket.on('user_online', (data: { userId: string }) => {
      addOrUpdateUser(data.userId, true);
    });

    newSocket.on('user_offline', (data: { userId: string }) => {
      addOrUpdateUser(data.userId, false);
    });

    // Handle initial online users list (if server sends it)
    newSocket.on('online_users_list', (data: { users: Array<{ userId: string; isOnline: boolean }> }) => {
      if (Array.isArray(data.users)) {
        data.users.forEach((user) => {
          addOrUpdateUser(user.userId, user.isOnline);
        });
      }
    });

    // Notification Events
    newSocket.on('notification_received', (notification: Notification) => {
      addNotification(notification);
    });

    // Chat Events
    newSocket.on('message_received', (data: any) => {
      // Handle in chat component
    });

    newSocket.on('user_typing', (data: any) => {
      // Handle in chat component
    });

    setSocket(newSocket);
  }, [accessToken, profile, socket?.connected, addOrUpdateUser, addNotification]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setOnlineUsers(new Map());
    }
  }, [socket]);

  const setUserStatus = useCallback(async (isOnline: boolean) => {
    if (!accessToken) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
      const response = await fetch(`${apiUrl}/users/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ isOnline })
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }, [accessToken]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Auto-connect when user is authenticated
  useEffect(() => {
    if (profile && accessToken && !socket?.connected) {
      connect();
    }

    return () => {
      if (socket?.connected) {
        disconnect();
      }
    };
  }, [profile, accessToken]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const value: SocketContextType = {
    socket,
    isConnected,
    onlineUsers,
    onlineUserIds, // Add this
    isUserOnline,  // Add this
    notifications,
    connect,
    disconnect,
    setUserStatus,
    clearNotifications,
    addNotification,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};