import Papa from "papaparse";
import { americanToDecimal } from "./odds";

const requiredColumns = ["event_start_date", "odds", "clv", "stake", "percentage", "status", "bet_type"];

export const parseCsvFile = (file: File, onComplete: (bets: Bet[] | null, error: string | null) => void) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => {
      const data = result.data as CsvBet[];

      const missingColumns = requiredColumns.filter((column) => !result.meta.fields?.includes(column));
      if (missingColumns.length > 0) {
        onComplete(null, `Missing required columns: ${missingColumns.join(", ")}`);
        return;
      }

      const parsedBets = data
        .filter((row) => row.status !== "pending")
        .filter((row) => row.bet_type === "positive_ev")
        .filter((row) => row.odds && row.clv)
        .sort((a, b) => new Date(a.event_start_date).getTime() - new Date(b.event_start_date).getTime())
        .map((row) => ({
          ...row,
          event_start_date: new Date(row.event_start_date),
          odds: americanToDecimal(+row.odds),
          fair_odds: americanToDecimal(+row.odds) / (1 + +row.percentage / 100),
          clv: americanToDecimal(+row.clv),
          stake: +row.stake,
          percentage: +row.percentage,
        }));

      onComplete(parsedBets, null);
    },
  });
};
