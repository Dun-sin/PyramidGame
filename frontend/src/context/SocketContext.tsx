import { createContext } from 'react';
import { io } from 'socket.io-client';

export const socket = io(process.env.EXPO_PUBLIC_URL ?? '', {
	autoConnect: false,
});

export const SocketContext = createContext(socket);
