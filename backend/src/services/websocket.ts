import { Server } from 'socket.io';

export function initializeWebSocket(io: Server) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
} 