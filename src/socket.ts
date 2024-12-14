import { io } from 'socket.io-client';

import { SOCKET_SERVER_URL } from './config.js';

const socket = io(SOCKET_SERVER_URL);

export default socket;
