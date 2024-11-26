import axios from 'axios';

import { getRequestconfig } from '../config.js';

export const getPlatesResponse = async (pageNumber: number) => {
  return {
    platesResponse: await axios.request(getRequestconfig(pageNumber)),
  };
};
