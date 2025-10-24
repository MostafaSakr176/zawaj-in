// src/components/realtime/NotificationsWidget.tsx
"use client";
import React from 'react';
import { useSocket } from '@/context/SocketContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, X } from 'lucide-react';

export const NotificationsWidget: React.FC = () => {
  const { notifications, clearNotifications } = useSocket();

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'new_message': return 'border-l-blue-500';
      case 'new_match': return 'border-l-pink-500';
      case 'new_like': return 'border-l-red-500';
      case 'system': return 'border-l-purple-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bell size={16} />
          Notifications
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearNotifications}
          className="h-8 w-8 p-0"
        >
          <X size={14} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No notifications yet
            </div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-3 rounded-lg bg-muted/50 border-l-4 ${getNotificationColor(notification.type)} animate-in slide-in-from-left duration-300`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium uppercase px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {notification.type.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-sm font-medium mb-1">
                  {notification.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  {notification.body}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};