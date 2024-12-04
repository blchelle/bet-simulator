import { Group, Stack, Title, Card, Skeleton, Flex } from "@mantine/core";
import { AreaChart, BarChart } from "@mantine/charts";
import React from "react";

interface SimulationResultsProps {
  parsedFile: Bet[] | null;
  simulationRunning: boolean;
  simulationResult: SimulationResult | null;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ parsedFile, simulationRunning, simulationResult }) => {
  const breakEvenBinLabel = simulationResult?.histogram.find((bin) => {
    const [lower, upper] = bin.range.replace(/\$/g, "").split(" to ").map(Number);
    return lower <= 0 && upper >= 0;
  })?.range;

  const actualBinLabel = simulationResult?.histogram.find((bin) => {
    const [lower, upper] = bin.range.replace(/\$/g, "").split(" to ").map(Number);
    return lower <= simulationResult.actualProfit && upper >= simulationResult.actualProfit;
  })?.range;

  return (
    <Card withBorder>
      {(!parsedFile || (!simulationResult && !simulationRunning)) && (
        <Flex align={"center"} justify={"center"} h={400}>
          <Title order={4}>Upload your betting history to run a simulation</Title>
        </Flex>
      )}
      {parsedFile && simulationRunning && (
        <Group grow gap={16}>
          <Skeleton height={400} />
          <Skeleton height={400} />
        </Group>
      )}
      {parsedFile && simulationResult && (
        <Group grow gap={16}>
          <Stack>
            <Title order={4}>Best/Worst/Average Outcomes</Title>
            <Card withBorder>
              <AreaChart
                h={400}
                data={simulationResult.lineGraph}
                dataKey="date"
                curveType="natural"
                series={[
                  { name: "Actual", color: "yellow" },
                  { name: "Best Case", color: "green" },
                  { name: "Average", color: "blue" },
                  { name: "Worst Case", color: "red" },
                ]}
                withLegend
                legendProps={{ verticalAlign: "bottom" }}
                xAxisProps={{ angle: -20 }}
                withDots={false}
                valueFormatter={(value) => `$${new Intl.NumberFormat("en-US").format(value)}`}
              />
            </Card>
          </Stack>
          <Stack>
            <Title order={4}>Distribution of Outcomes</Title>
            <Card withBorder>
              <BarChart
                h={400}
                data={simulationResult.histogram}
                dataKey="range"
                series={[{ name: "Percentage", color: "blue" }]}
                withXAxis={false}
                valueFormatter={(value) => `${value.toFixed(2)}%`}
                referenceLines={[
                  {
                    x: breakEvenBinLabel,
                    color: "green",
                    label: "Break Even",
                    labelPosition: "insideTopRight",
                  },
                  {
                    x: actualBinLabel,
                    color: "yellow",
                    label: "Actual",
                    labelPosition: actualBinLabel === breakEvenBinLabel ? "insideTopLeft" : "insideTopRight",
                  },
                ]}
              />
            </Card>
          </Stack>
        </Group>
      )}
    </Card>
  );
};

export default SimulationResults;
