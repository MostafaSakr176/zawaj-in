"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import Cookies from "js-cookie";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated, profile } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Only connect if user is authenticated
    if (!isAuthenticated || !profile) {
      // Disconnect if previously connected
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Get token from cookies
    const token = Cookies.get("access_token");
    if (!token) {
      console.warn("No access token found for socket connection");
      return;
    }

    console.log("Initializing socket connection with token:", token.substring(0, 20) + "...");

    // Create socket connection
    const newSocket = io("http://localhost:3001", {
      auth: {
        token,
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'],
    });

    // Connection event handlers
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      setIsConnected(false);
    });

    // Listen to online/offline events
    newSocket.on("user_online", (data: { userId: string }) => {
      console.log("User came online:", data.userId);
    });

    newSocket.on("user_offline", (data: { userId: string }) => {
      console.log("User went offline:", data.userId);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [isAuthenticated, profile]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
