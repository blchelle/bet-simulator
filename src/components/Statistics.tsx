import { SimpleGrid } from "@mantine/core";
import React from "react";
import StatCard from "./StatCard";
import { displayNumber } from "../util/numbers";

interface StatisticsProps {
  parsedFile: Bet[] | null;
  amountWagered: number;
  profit: number;
  percentageBeatingCLV: number | null;
  averageBeatingCLV: number | null;
  simulationResult: SimulationResult | null;
}

const Statistics: React.FC<StatisticsProps> = ({
  parsedFile,
  amountWagered,
  profit,
  percentageBeatingCLV,
  averageBeatingCLV,
  simulationResult,
}) => {
  return (
    <SimpleGrid cols={3}>
      <StatCard label="Total Bets" value={`${parsedFile?.length}`} />
      <StatCard label="Amount Wagered" value={`$${displayNumber(amountWagered)}`} />
      <StatCard label="Profit / Loss" value={`$${displayNumber(profit)}`} />
      <StatCard
        label="Beating CLV"
        value={`${percentageBeatingCLV?.toFixed(1)}%`}
        tooltip="The percent of your wagers where your odds beat CLV."
      />
      <StatCard
        label="Average CLV"
        value={`${averageBeatingCLV?.toFixed(1)}%`}
        tooltip="The average percent that you beat CLV by."
      />
      <StatCard
        label="Break Even Percent"
        value={simulationResult ? `${simulationResult.breakEvenPercent.toFixed(1)}%` : "-"}
        tooltip="The percent of simulations where you broke even or made a profit."
      />
      <StatCard
        label="Simulations Beaten"
        value={simulationResult ? `${simulationResult.actualPercent.toFixed(1)}%` : "-"}
        tooltip="The percent of simulations your actual results performed better than."
      />
    </SimpleGrid>
  );
};

export default Statistics;
