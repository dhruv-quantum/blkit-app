// A small "X of Y done" bar. `tone="dark"` is for use on the dark hero panel.
export default function ProgressBar({ done, total, tone = "light", className = "" }) {
  const pct = total ? Math.min(100, Math.round((done / total) * 100)) : 0;
  const dark = tone === "dark";
  return (
    <div className={className}>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-label="Activities completed"
        className={`h-[7px] overflow-hidden rounded-full ${dark ? "bg-white/16" : "bg-sand-deep"}`}
      >
        <div
          className={`h-full rounded-full transition-[width] ${dark ? "bg-sun" : "bg-coral"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className={`mt-1.5 text-[12px] font-extrabold ${dark ? "text-sun" : done ? "text-forest" : "text-muted"}`}>
        {done} of {total} done
      </div>
    </div>
  );
}
