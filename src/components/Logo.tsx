export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <svg viewBox="0 0 56 32" className="h-8 w-14" aria-hidden>
        {/* container-plate wordmark */}
        <rect x="0.5" y="0.5" width="55" height="31" fill="#ff5a1f" />
        <rect x="0.5" y="0.5" width="4" height="4" fill="#0a1a26" />
        <rect x="51.5" y="0.5" width="4" height="4" fill="#0a1a26" />
        <rect x="0.5" y="27.5" width="4" height="4" fill="#0a1a26" />
        <rect x="51.5" y="27.5" width="4" height="4" fill="#0a1a26" />
        <g fill="#0a1a26">
          <rect x="8" y="8" width="12" height="3.5" />
          <rect x="12.2" y="8" width="3.6" height="16" />
          <path d="M22.5 24l4.6-16h3.8l4.6 16h-3.8l-0.9-3.6h-3.6L26.3 24zM28 17h2.2l-1.1-4.6z" />
          <path d="M37 8h11v3.5h-7.3v2.6H48V24H37v-3.5h7.3v-2.9H37z" />
        </g>
      </svg>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[17px] font-extrabold uppercase tracking-[0.12em] text-hull">TAS Group</span>
          <span className="stencil mt-1 text-[10px] tracking-[0.2em] text-orange">Est. 1978</span>
        </span>
      )}
    </span>
  );
}
