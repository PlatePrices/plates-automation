import mongoose, { Schema, Document } from "mongoose";
import { savingLogs } from "../../utils/saveLogs.js";
import { ScraperPerformance as ScraperPerformanceType } from "../../types/performance.js";

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

scraperPerformanceSchema.pre<ScraperPerformanceType>(
  "save",
  async function (next) {
    try {
      await savingLogs(this.startTime, this.totalDurationSec, this.scraperName);
      next();
    } catch (error) {
      next(error as Error);
    }
  }
);

export const ScraperPerformance = mongoose.model<ScraperPerformanceType>(
  "ScraperPerformance",
  scraperPerformanceSchema
);
