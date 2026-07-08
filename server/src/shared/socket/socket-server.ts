import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

let io: Server;

export const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join user-specific room
    socket.on("join", (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined room user:${userId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized.");
  }

  return io;
};