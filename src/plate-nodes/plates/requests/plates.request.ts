import axios from 'axios';

import { createPlatesAeConfig } from '../config.js';

export const getPlatesResponse = async (pageNumber: number) => {
  const config = createPlatesAeConfig(pageNumber);

  return {
    platesResponse: await axios(config),
  };
};
