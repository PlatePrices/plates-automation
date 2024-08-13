import mongoose, { Schema } from "mongoose";
import { Plate } from "../../types/plates.js";

const plateSchema: Schema<Plate> = new Schema({
  link: {
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
  img: {
    type: String,
    required: false,
  },
  character: {
    type: String,
    required: false,
  },
  source: {
    type: String,
    required: true
  }
});

export const plate = mongoose.model<Plate>("plate", plateSchema);
