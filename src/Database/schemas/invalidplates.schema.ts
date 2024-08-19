import mongoose, { Schema } from 'mongoose';

import { Plate } from '../../types/plates.js';

// it is basically the same structure as validPlates but only for invalid plates
const invalidPlateSchema: Schema<Plate> = new Schema({
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
    required: true,
  },
});

export const invalidPlates = mongoose.model<Plate>('invalid_plates', invalidPlateSchema);
