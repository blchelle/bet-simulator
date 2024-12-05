interface CsvBet {
  odds: string;
  clv: string;
  stake: string;
  status: string;
  event_start_date: string;
  bet_type: string;
  percentage: string;
}

interface Bet {
  odds: number;
  fair_odds: number;
  clv: number;
  stake: number;
  status: string;
  event_start_date: Date;
  bet_type: string;
  percentage: number;
}
