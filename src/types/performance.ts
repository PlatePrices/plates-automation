type performanceType = {
  pageNumber: number;
  durationMs: number;
};

type OperationPerformance = {
  startTime: Date;
  endTime: Date;
  totalDurationMs: number;
};

type PagePerformance = {
  pageNumber: number;
  durationMs: number;
  durationSec: number;
};

type ScraperPerformance = {
  scraperName: string;
  startTime: Date;
  endTime: Date;
  totalDurationMs: number;
  pagePerformance: PagePerformance[];
};

export { ScraperPerformance, OperationPerformance, performanceType };
