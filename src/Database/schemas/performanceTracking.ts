import mongoose, { Schema, Document } from "mongoose";
import { savingLogs } from "../../utils/saveLogs.js";
import { OperationPerformance } from "../../types/performance.js";

const operationPerformanceSchema: Schema<OperationPerformance> =
  new mongoose.Schema({
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalDurationMs: { type: Number, required: true },
    totalDurationSec: { type: Number, required: true },
  });

operationPerformanceSchema.pre<OperationPerformance>(
  "save",
  async function (next) {
    try {
      await savingLogs(this.startTime, this.totalDurationSec, "main");
      next();
    } catch (error) {
      next(error as Error);
    }
  }
);

const OperationPerformance = mongoose.model<OperationPerformance>(
  "OperationPerformance",
  operationPerformanceSchema
);

export { OperationPerformance };
