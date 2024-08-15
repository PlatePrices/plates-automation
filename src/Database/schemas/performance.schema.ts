import mongoose, { Schema, Document } from 'mongoose';
import { ScraperPerformance as ScraperPerformanceType } from '../../types/performance.js';

const scraperPerformanceSchema: Schema<ScraperPerformanceType> = new Schema({
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
  pagePerformance: [
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

export const ScraperPerformance = mongoose.model<ScraperPerformanceType>(
  'ScraperPerformance',
  scraperPerformanceSchema
);
