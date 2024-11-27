import { io } from 'socket.io-client';
import logger from './plate-utils/logger/logger.js';
import { SOCKET_SERVER_URL } from './config.js';
import { task } from './type.js';
import { runTask } from './main.js';
const socket = io(SOCKET_SERVER_URL);

socket.on('connect', () => {
  logger.debub('Client connected to the server');
});

socket.on('some bullshit', (task: task) => {
  runTask(task.source, task.startPage, task.endPage);
});
