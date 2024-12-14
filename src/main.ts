import { io } from 'socket.io-client';

import { SOCKET_SERVER_URL } from './config.js';
import dubaiXplate from './plate-nodes/dubaixplates/scripts/plates.js';
import dubizzle from './plate-nodes/dubizzle/scripts/plates.js';
import numberae from './plate-nodes/numberae/scripts/plates.js';
import platesAe from './plate-nodes/numberae/scripts/plates.js';
import plates2020 from './plate-nodes/plates_2020/scripts/plates.js';
import xplate from './plate-nodes/xplate/scripts/plates.js';
import logger from './plate-utils/logger/logger.js';
import plateNode from './plate-utils/plate-node/plate-node.js';

const SOURCES_MAP = new Map<string, plateNode>([
  ['XPLATE', xplate],
  ['2020', plates2020],
  ['PLATES_AE', platesAe],
  ['NUMBER_AE', numberae],
  ['DUBIZZLE', dubizzle],
  ['DUBAI-XPLATE', dubaiXplate],
]);

const socket = io(SOCKET_SERVER_URL);

socket.on('connect', () => {
  logger.info('Client connected');
});

socket.on(
  'get-plates',
  async (task: { source: string; startPage: number; endPage: number }) => {
    const all = await SOURCES_MAP.get(task.source)?.extractPlates(
      task.startPage,
      task.endPage,
    );

    socket.emit('task-completed', {
      source: task.source,
      startPage: task.startPage,
      endPage: task.endPage,
      plates: all?.validPlates,
    });
  },
);
