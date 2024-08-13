import mongoose from "mongoose";

const operationPerformanceSchema = new mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  totalDurationMs: { type: Number, required: true },
  totalDurationSec: { type: Number, required: true },
});

const OperationPerformance = mongoose.model(
  "OperationPerformance",
  operationPerformanceSchema
);

export { OperationPerformance };
