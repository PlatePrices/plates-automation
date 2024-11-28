import { io } from 'socket.io-client';

import { SOCKET_SERVER_URL } from './config.js';
import { runTask } from './main.js';
import logger from './plate-utils/logger/logger.js';
import { task } from './type.js';

const socket = io(SOCKET_SERVER_URL);

socket.on('connect', () => {
  logger.debub('Client connected to the server');
});

socket.on('some bullshit', async (task: task) => {
  await runTask(task.source, task.startPage, task.endPage);
});
