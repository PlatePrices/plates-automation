import mongoose, { Schema } from 'mongoose';

import { OperationPerformance } from '../../types/performance.js';

const operationPerformanceSchema: Schema<OperationPerformance> = new mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  totalDurationMs: { type: Number, required: true },
});

const OperationPerformance = mongoose.model<OperationPerformance>('OperationPerformance', operationPerformanceSchema);

export { OperationPerformance };
