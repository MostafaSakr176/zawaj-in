// src/hooks/useRealTimeStatus.ts
import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '@/context/SocketContext';

export interface RealTimeStats {
  onlineUsersCount: number;
  notificationsCount: number;
  eventsCount: number;
}

export function useRealTimeStatus() {
  const { socket, isConnected, onlineUsers, notifications } = useSocket();
  const [stats, setStats] = useState<RealTimeStats>({
    onlineUsersCount: 0,
    notificationsCount: 0,
    eventsCount: 0,
  });
  const [events, setEvents] = useState<Array<{
    timestamp: Date;
    event: string;
    data: any;
  }>>([]);

  const logEvent = useCallback((event: string, data: any) => {
    const newEvent = {
      timestamp: new Date(),
      event,
      data,
    };
    
    setEvents(prev => [newEvent, ...prev].slice(0, 50)); // Keep only last 50 events
    setStats(prev => ({
      ...prev,
      eventsCount: prev.eventsCount + 1,
    }));
  }, []);

  // Update stats when data changes
  useEffect(() => {
    const onlineCount = Array.from(onlineUsers.values()).filter(u => u.isOnline).length;
    setStats(prev => ({
      ...prev,
      onlineUsersCount: onlineCount,
      notificationsCount: notifications.length,
    }));
  }, [onlineUsers, notifications]);

  // Listen for socket events
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      logEvent('CONNECTED', { socketId: socket.id });
    };

    const handleDisconnect = (reason: string) => {
      logEvent('DISCONNECTED', { reason });
    };

    const handleUserStatusChanged = (data: any) => {
      logEvent('user_status_changed', data);
    };

    const handleNotificationReceived = (data: any) => {
      logEvent('notification_received', data);
    };

    const handleMessageReceived = (data: any) => {
      logEvent('message_received', data);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('user_status_changed', handleUserStatusChanged);
    socket.on('notification_received', handleNotificationReceived);
    socket.on('message_received', handleMessageReceived);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('user_status_changed', handleUserStatusChanged);
      socket.off('notification_received', handleNotificationReceived);
      socket.off('message_received', handleMessageReceived);
    };
  }, [socket, logEvent]);

  const clearEvents = useCallback(() => {
    setEvents([]);
    setStats(prev => ({ ...prev, eventsCount: 0 }));
  }, []);

  return {
    stats,
    events,
    isConnected,
    clearEvents,
    logEvent,
  };
}