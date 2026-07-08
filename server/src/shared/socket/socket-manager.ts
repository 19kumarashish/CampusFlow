import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

let io: Server;

// Socket event names
export const SocketEvents = {
  JOIN: "join",
  NOTIFICATION: "notification",
  NOTIFICATION_COUNT: "notification_count",
} as const;

// Initialize Socket.IO
export const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on(SocketEvents.JOIN, (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined room user:${userId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Get Socket.IO instance
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized.");
  }

  return io;
};

// Send notification
export const emitNotification = (
  userId: string,
  notification: unknown
) => {
  getIO()
    .to(`user:${userId}`)
    .emit(SocketEvents.NOTIFICATION, notification);
};

// Update unread notification count
export const emitUnreadCount = (
  userId: string,
  count: number
) => {
  getIO()
    .to(`user:${userId}`)
    .emit(SocketEvents.NOTIFICATION_COUNT, count);
};