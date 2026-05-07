export function toDisplayRand(rawPrice) {
  const value = Number(rawPrice || 0);
  // Backend stores cents; legacy mock data uses whole rand.
  if (value >= 10000) return value / 100;
  return value;
}

export function formatRand(rawPrice) {
  return `R${toDisplayRand(rawPrice).toFixed(2)}`;
}
