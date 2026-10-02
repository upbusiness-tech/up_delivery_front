const COLORS = ["#e53935", "#fb8c00", "#43a047", "#1e88e5"];

const slicePath = (i: number, n: number, r: number) => {
  const a0 = (i / n) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
  return `M50 50 L${50 + r * Math.cos(a0)} ${50 + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${50 + r * Math.cos(a1)} ${50 + r * Math.sin(a1)} Z`;
};

export default function FlavorPizzaIcon({ count, size = 72 }: { count: number; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <circle cx="50" cy="50" r="47" fill="#f2c27a" stroke="#d99a3a" strokeWidth="2" />
      {count === 1
        ? <circle cx="50" cy="50" r="40" fill={COLORS[0]} fillOpacity="0.85" />
        : Array.from({ length: count }, (_, i) => <path key={i} d={slicePath(i, count, 40)} fill={COLORS[i % COLORS.length]} fillOpacity="0.85" stroke="#fff" strokeWidth="2" />)}
    </svg>
  );
}