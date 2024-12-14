import axios from 'axios';

import { createNumbersAeConfig } from '../config.js';

export const getPlatesResponse = async (pageNumber: number) => {
  const config = createNumbersAeConfig(pageNumber);

  return {
    platesResponse: await axios(config),
  };
};
