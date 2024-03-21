import { io, Socket } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL: string = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';

export const socket: Socket = io(URL);
