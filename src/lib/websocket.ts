
import io from 'socket.io-client';

const createSocket = () => {
  const socket = io(process.env.NEXT_PUBLIC_BACKEND|| 'http://localhost:8000');

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('message', (message) => {
    console.log(`Received Socket.io message`);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

export default createSocket;
