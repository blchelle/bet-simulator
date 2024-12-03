interface LineGraphData {
  date: string;
  "Best Case": number;
  Average: number;
  "Worst Case": number;
  Actual: number;
}

interface HistogramData {
  range: string;
  Count: number;
}

interface SimulationResult {
  breakEvenPercent: number;
  actualPercent: number;
  lineGraph: LineGraphData[];
  histogram: HistogramData[];
}
