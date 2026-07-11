// Simple color palette cycled by movie id so each poster looks different.
const COLORS = [
  ['#4f46e5', '#0ea5e9'],
  ['#dc2626', '#f97316'],
  ['#059669', '#84cc16'],
  ['#7c3aed', '#db2777'],
  ['#0891b2', '#22c55e'],
  ['#b45309', '#eab308'],
];

export function getPosterGradient(movie) {
  const [start, end] = COLORS[movie.id % COLORS.length];
  return `linear-gradient(135deg, ${start}, ${end})`;
}
