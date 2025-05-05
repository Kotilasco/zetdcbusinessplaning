export function compactFormat(value: number) {
  if (value === null || value === undefined) return '0';
  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
  });
  return formatter.format(value);
}

export function standardFormat(value: number) {
  if (value === null || value === undefined) return '0.00';
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
