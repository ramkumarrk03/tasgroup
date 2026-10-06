// International Code of Signals letter flags, drawn on a 30×20 grid.
const B = "#1d4f9c"; // flag blue
const R = "#d7312a"; // flag red
const Y = "#f2c230";
const W = "#eef1f0";
const K = "#0a1a26";

const FLAGS: Record<string, React.ReactNode> = {
  A: (
    <>
      <rect width="15" height="20" fill={W} />
      <path d="M15 0h15l-6 10 6 10H15z" fill={B} />
    </>
  ),
  C: (
    <>
      {[B, W, R, W, B].map((c, i) => (
        <rect key={i} y={i * 4} width="30" height="4" fill={c} />
      ))}
    </>
  ),
  E: (
    <>
      <rect width="30" height="10" fill={B} />
      <rect y="10" width="30" height="10" fill={R} />
    </>
  ),
  G: (
    <>
      {[Y, B, Y, B, Y, B].map((c, i) => (
        <rect key={i} x={i * 5} width="5" height="20" fill={c} />
      ))}
    </>
  ),
  H: (
    <>
      <rect width="15" height="20" fill={W} />
      <rect x="15" width="15" height="20" fill={R} />
    </>
  ),
  N: (
    <>
      <rect width="30" height="20" fill={W} />
      {Array.from({ length: 16 }).map((_, i) => {
        const x = i % 4;
        const y = Math.floor(i / 4);
        return (x + y) % 2 === 0 ? <rect key={i} x={x * 7.5} y={y * 5} width="7.5" height="5" fill={B} /> : null;
      })}
    </>
  ),
  P: (
    <>
      <rect width="30" height="20" fill={B} />
      <rect x="10" y="6.5" width="10" height="7" fill={W} />
    </>
  ),
  Q: <rect width="30" height="20" fill={Y} />,
  S: (
    <>
      <rect width="30" height="20" fill={W} />
      <rect x="10" y="6.5" width="10" height="7" fill={B} />
    </>
  ),
  T: (
    <>
      <rect width="10" height="20" fill={R} />
      <rect x="10" width="10" height="20" fill={W} />
      <rect x="20" width="10" height="20" fill={B} />
    </>
  ),
  L: (
    <>
      <rect width="30" height="20" fill={Y} />
      <rect x="15" width="15" height="10" fill={K} />
      <rect y="10" width="15" height="10" fill={K} />
    </>
  ),
};

export default function SignalFlag({ letter, className = "h-5 w-[30px]" }: { letter: keyof typeof FLAGS | string; className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={className} role="img" aria-label={`Signal flag ${letter}`}>
      {FLAGS[letter] ?? FLAGS.Q}
      <rect x="0.25" y="0.25" width="29.5" height="19.5" fill="none" stroke="rgba(10,26,38,.35)" strokeWidth=".5" />
    </svg>
  );
}
