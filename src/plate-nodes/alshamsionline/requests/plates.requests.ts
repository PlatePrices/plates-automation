import axios from 'axios';
import { getRequestConfig } from '../config';

export const getPlatesResponse = async (pageNumber: number) => {
  return {
    platesResponse: await axios.request(getRequestConfig(pageNumber)),
  };
};
