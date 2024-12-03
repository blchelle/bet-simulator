export const displayNumber = (num: number): string => {
  if (Math.abs(num) < 1000) {
    return num.toFixed(0);
  } else if (Math.abs(num) < 1_000_000) {
    return `${(num / 1000).toFixed(1)}k`;
  } else {
    return `${(num / 1_000_000).toFixed(1)}m`;
  }
};
