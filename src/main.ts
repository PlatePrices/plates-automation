import { SOURCES_MAP } from './config';

export const runTask = async (
  source: string,
  startPage: number,
  endPage: number,
) => {
  if (!SOURCES_MAP.has(source)) return Promise.resolve();

  const taskFunction = SOURCES_MAP.get(source);

  if (!taskFunction) return Promise.resolve();

  // should be recieving plates
  // await taskFunction(startPage, endPage);
};
