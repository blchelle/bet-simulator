export const runSimulation = (bets: Bet[] | null, runs: number, bins: number): SimulationResult => {
  if (!bets)
    return {
      actualProfit: 0,
      breakEvenPercent: 0,
      actualPercent: 0,
      lineGraph: [],
      histogram: [],
    };

  const dayBeforeStart = new Date(bets[0].event_start_date);
  dayBeforeStart.setDate(dayBeforeStart.getDate() - 1);

  const results = Array.from({ length: runs }, () => {
    const dailyProfits: { [date: string]: number } = {
      [dayBeforeStart.toISOString().split("T")[0]]: 0,
    };

    bets.forEach((bet) => {
      const date = bet.event_start_date.toISOString().split("T")[0];
      const winProbability = 1 / bet.clv;
      const profit = Math.random() < winProbability ? bet.stake * (bet.odds - 1) : -bet.stake;

      if (!dailyProfits[date]) {
        const size = Object.keys(dailyProfits).length;
        dailyProfits[date] = size > 0 ? Object.values(dailyProfits)[size - 1] : 0;
      }
      dailyProfits[date] += profit;
    });

    return dailyProfits;
  }).sort((a, b) => {
    const aValues = Object.values(a);
    const bValues = Object.values(b);
    return aValues[aValues.length - 1] - bValues[bValues.length - 1];
  });

  const actualResults: { [date: string]: number } = {
    [dayBeforeStart.toISOString().split("T")[0]]: 0,
  };
  bets.forEach((bet) => {
    const date = bet.event_start_date.toISOString().split("T")[0];

    let profit = 0;
    if (bet.status == "won") {
      profit = bet.stake * (bet.odds - 1);
    } else if (bet.status == "lost") {
      profit = -bet.stake;
    }

    if (!actualResults[date]) {
      const size = Object.keys(actualResults).length;
      actualResults[date] = size > 0 ? Object.values(actualResults)[size - 1] : 0;
    }
    actualResults[date] += profit;
  });

  const uniqueDates = Array.from(new Set(bets.map((bet) => bet.event_start_date.toISOString().split("T")[0]))).sort();
  uniqueDates.unshift(dayBeforeStart.toISOString().split("T")[0]);

  const aggregatedResults = uniqueDates.map((date) => {
    const dailyProfits = results.map((result) => result[date] || 0);
    const bestCase = Math.max(...dailyProfits);
    const worstCase = Math.min(...dailyProfits);
    const averageCase = dailyProfits.reduce((acc, val) => acc + val, 0) / dailyProfits.length;
    const actualCase = actualResults[date];

    return {
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "2-digit",
      }),
      "Best Case": +bestCase.toFixed(0),
      Average: +averageCase.toFixed(0),
      "Worst Case": +worstCase.toFixed(0),
      Actual: +actualCase.toFixed(0),
    };
  });

  const breakEvenCase = results.findIndex((result) => {
    const values = Object.values(result);
    return values[values.length - 1] >= 0;
  });

  const actualPercent = results.findIndex((results) => {
    const values = Object.values(results);
    return values[values.length - 1] >= actualResults[uniqueDates[uniqueDates.length - 1]];
  });

  return {
    actualProfit: actualResults[uniqueDates[uniqueDates.length - 1]],
    breakEvenPercent: 100 - (breakEvenCase / runs) * 100,
    actualPercent: (actualPercent / runs) * 100,
    lineGraph: aggregatedResults,
    histogram: generateHistogram(
      results.map((result) => result[uniqueDates[uniqueDates.length - 1]]),
      bins,
    ),
  };
};

const generateHistogram = (results: number[], bins: number): HistogramData[] => {
  const min = Math.min(...results);
  const max = Math.max(...results);

  const binSize = (max - min) / bins;
  const histogram: HistogramData[] = [];

  for (let i = 0; i < bins; i++) {
    const range = `$${(min + i * binSize).toFixed(0)} to $${(min + (i + 1) * binSize).toFixed(0)}`;
    const count = results.filter((result) => result >= min + i * binSize && result < min + (i + 1) * binSize).length;
    histogram.push({ range, Percentage: (count / results.length) * 100 });
  }

  return histogram;
};
