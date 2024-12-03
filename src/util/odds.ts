export const americanToDecimal = (american: number) => {
  if (american < 0) {
    return 1 - 100 / american;
  }
  return 1 + american / 100;
};
