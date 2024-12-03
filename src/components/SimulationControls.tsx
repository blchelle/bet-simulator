import { Button, Group, NumberInput } from "@mantine/core";
import React from "react";

interface SimulationControlsProps {
  runs: number;
  setRuns: (runs: number) => void;
  bins: number;
  setBins: (bins: number) => void;
  handleRunSimulation: () => void;
  parsedFile: Bet[] | null;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  runs,
  setRuns,
  bins,
  setBins,
  handleRunSimulation,
  parsedFile,
}) => {
  return (
    <Group align="flex-end" grow>
      <NumberInput label="Simulation Runs" min={100} max={100_000} value={runs} onChange={(e) => setRuns(+e)} />
      <NumberInput label="Histogram Bins" min={10} max={100} value={bins} onChange={(e) => setBins(+e)} />
      <Button onClick={handleRunSimulation} disabled={!parsedFile}>
        Run Simulation
      </Button>
    </Group>
  );
};

export default SimulationControls;
