import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/dates/styles.css";
import { Card, Group, Stack, Title, Text, ActionIcon, useMantineColorScheme, Button } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import React, { useEffect } from "react";
import { useCallback, useMemo, useState } from "react";
import { parseCsvFile } from "./util/parse";
import { IconBrandGithub, IconMoon, IconSun } from "@tabler/icons-react";
import FileUpload from "./components/FileUpload";
import Statistics from "./components/Statistics";
import SimulationResults from "./components/SimulationResults";
import { modals } from "@mantine/modals";
import InstructionsModal from "./components/InstructionsModal";
import Footer from "./components/Footer";
import SimulationWorker from "./workers/simulationWorker?worker";

const HISTOGRAM_BINS = 20;
const SIMULATION_RUNS = 1000;

const App: React.FC = () => {
  const [parsedFile, setParsedFile] = useState<Bet[] | null>(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const filteredBets = useMemo(() => {
    if (!parsedFile || !dateRange[0] || !dateRange[1]) return parsedFile;

    const rangeStart = new Date(dateRange[0]);
    const rangeEnd = new Date(dateRange[1]);
    rangeEnd.setHours(23, 59, 59, 999); // Sets to the end of the day

    return parsedFile.filter(
      (bet) => new Date(bet.event_start_date) >= rangeStart && new Date(bet.event_start_date) <= rangeEnd,
    );
  }, [parsedFile, dateRange]);

  const { percentageBeatingCLV, averageBeatingCLV } = useMemo(() => {
    if (!filteredBets) return { percentageBeatingCLV: null, averageBeatingCLV: null };

    const betsBeatingCLV = filteredBets.filter((bet) => bet.odds > bet.clv);
    const percentageBeatingCLV = (betsBeatingCLV.length / filteredBets.length) * 100;
    const averageBeatingCLV =
      filteredBets.reduce((acc, bet, i) => (acc * i + (bet.odds / bet.clv - 1)) / (i + 1), 0) * 100;

    return { percentageBeatingCLV, averageBeatingCLV };
  }, [filteredBets]);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setParsedFile(null);
      setErrorMessage(null);
      return;
    }

    parseCsvFile(file, (bets, error) => {
      if (error) {
        setErrorMessage(error);
        setParsedFile(null);
      } else {
        setParsedFile(bets);
        setErrorMessage(null);
      }
    });
  };

  const handleRunSimulation = useCallback(() => {
    if (!filteredBets) return;

    setSimulationResult(null);
    setSimulationRunning(true);

    const worker = new SimulationWorker();
    worker.postMessage({ bets: filteredBets, runs: SIMULATION_RUNS, bins: HISTOGRAM_BINS });
    console.log("firing worker");
    worker.onmessage = (e) => {
      setSimulationResult(e.data);
      setSimulationRunning(false);
      worker.terminate();
    };
  }, [filteredBets]);

  useEffect(() => {
    if (dateRange[0] && !dateRange[1]) return;

    handleRunSimulation();
  }, [dateRange, filteredBets]);

  const amountWagered = filteredBets?.reduce((acc, bet) => acc + bet.stake, 0) || 0;
  const profit =
    filteredBets?.reduce((acc, bet) => {
      if (bet.status === "won") {
        return acc + bet.stake * (bet.odds - 1);
      } else if (bet.status === "lost") {
        return acc - bet.stake;
      } else {
        return acc;
      }
    }, 0) || 0;

  return (
    <Stack mx={64} my={32}>
      <Group justify="space-between">
        <Title>OddsJam +EV Betting Simulator</Title>
        <Group>
          <DatePickerInput
            valueFormat="MMM DD YYYY"
            placeholder="Pick date range"
            type="range"
            value={dateRange}
            onChange={setDateRange}
            w={240}
            clearable
          />
          <ActionIcon
            component="a"
            variant="light"
            size="lg"
            color="gray"
            href="https://github.com/blchelle/bet-simulator"
            target="_blank"
          >
            <IconBrandGithub />
          </ActionIcon>
          <ActionIcon onClick={toggleColorScheme} size={"lg"} variant="light">
            {colorScheme === "dark" ? <IconSun /> : <IconMoon />}
          </ActionIcon>
        </Group>
      </Group>
      <Group grow align="stretch">
        <Card withBorder>
          <Stack>
            <Stack align="start" gap={0}>
              <Text>
                This website allows you to upload a CSV file of your betting history on OddsJam and then runs 1,000
                simulation to see a variety of possible outcomes. This simulation will expose the best case, worst case,
                and average scenarios so you can see if you have lucky or unlucky over the duration of your bets.
              </Text>
              <Button
                variant="transparent"
                px={0}
                onClick={() =>
                  modals.open({
                    title: "Instructions to Export CSV from OddsJam",
                    children: <InstructionsModal />,
                    size: "xl",
                  })
                }
              >
                Open Instructions
              </Button>
            </Stack>
            <Stack gap={0}>
              <Text fw={"bold"}>Disclaimer</Text>
              <Text size="sm">
                This simulator assumes that all of your bets are completely independent of each other. If you commonly
                bets on correlated outcomes, the results of this simulator may not be accurate. Only your +EV bets will
                be included in the simulation results.
              </Text>
            </Stack>
            <FileUpload parsedFile={parsedFile} handleFileChange={handleFileChange} errorMessage={errorMessage} />
            <Button onClick={handleRunSimulation} disabled={!filteredBets || simulationRunning}>
              Run Simulation
            </Button>
          </Stack>
        </Card>
        <Statistics
          parsedFile={filteredBets}
          amountWagered={amountWagered}
          profit={profit}
          percentageBeatingCLV={percentageBeatingCLV}
          averageBeatingCLV={averageBeatingCLV}
          simulationResult={simulationResult}
        />
      </Group>
      <Group grow>
        <SimulationResults
          parsedFile={filteredBets}
          simulationRunning={simulationRunning}
          simulationResult={simulationResult}
        />
      </Group>
      <Footer />
    </Stack>
  );
};

export default App;
