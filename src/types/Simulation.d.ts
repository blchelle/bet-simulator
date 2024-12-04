interface LineGraphData {
  date: string;
  "Best Case": number;
  Average: number;
  "Worst Case": number;
  Actual: number;
}

interface HistogramData {
  range: string;
  Percentage: number;
}

interface SimulationResult {
  actualProfit: number;
  breakEvenPercent: number;
  actualPercent: number;
  lineGraph: LineGraphData[];
  histogram: HistogramData[];
}
