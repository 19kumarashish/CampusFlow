"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

import { RootState } from "@/store";
import { env } from "@/config/env";

interface SocketContextProps {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextProps>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?._id) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Resolve socket server URL from env.API_URL
    const baseUrl = env.API_URL.replace("/api/v1", "").replace("/v1", "");
    const socketInstance = io(baseUrl, {
      withCredentials: true,
      autoConnect: false,
    });

    socketInstance.connect();

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("Socket.IO client connected:", socketInstance.id);
      socketInstance.emit("join", user._id);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket.IO client disconnected");
    });

    // Real-time Notification listener
    socketInstance.on("notification", (data: any) => {
      toast.info(data.title || "Notification Received", {
        description: data.message || "",
        action: {
          label: "View",
          onClick: () => {
            // Force refetch of notification list
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
          },
        },
      });
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    // Real-time Notification count listener
    socketInstance.on("notification_count", (data: any) => {
      const count = typeof data === "object" ? data.count : data;
      queryClient.setQueryData(["notifications", "unread-count"], { count });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.off("notification");
      socketInstance.off("notification_count");
      socketInstance.disconnect();
    };
  }, [user?._id, queryClient]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
