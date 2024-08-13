import mongoose, { Schema } from "mongoose";

const scraperPerformanceSchema: Schema = new Schema({
  scraperName: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  totalDurationMs: {
    type: Number,
    required: true,
  },
  totalDurationSec: {
    type: Number,
    required: true,
  },
  pagePerformances: [
    {
      pageNumber: {
        type: Number,
        required: true,
      },
      durationMs: {
        type: Number,
        required: true,
      },
      durationSec: {
        type: Number,
        required: true,
      },
    },
  ],
});

export const ScraperPerformance = mongoose.model("ScraperPerformance", scraperPerformanceSchema);
