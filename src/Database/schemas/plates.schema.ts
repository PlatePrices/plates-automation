import mongoose, { Schema } from 'mongoose';

import { Plate } from '../../types/plates.js';

const plateSchema: Schema<Plate> = new Schema({
  url: {
    type: String,
    required: false,
  },
  price: {
    type: String,
    required: false,
  },
  emirate: {
    type: String,
    required: false,
  },
  number: {
    type: String,
    required: false,
  },
  contact: {
    type: String,
    required: false,
  },
  duration: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  character: {
    type: String,
    required: false,
  },
  source: {
    type: String,
    required: false,
  },
});

export const plateCollection = mongoose.model<Plate>('plate', plateSchema);
