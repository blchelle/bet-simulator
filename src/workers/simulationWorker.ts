import { runSimulation } from "../util/simulator";

self.onmessage = function (e) {
  const { bets, runs, bins } = e.data;
  const result = runSimulation(bets, runs, bins);
  self.postMessage(result);
};
