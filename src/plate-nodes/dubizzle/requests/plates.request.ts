import axios from 'axios';

import { createDubizzleConfig } from '../config.js';

export const getPlatesResponse = async (pageNumber: number) => {
  const config = createDubizzleConfig(pageNumber);
  return {
    platesResponse: await axios(config),
  };
};
