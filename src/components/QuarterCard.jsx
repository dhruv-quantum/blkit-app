export default function QuarterCard({ quarter, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border border-line bg-white p-4 text-left shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="mb-2.5 flex items-center justify-between">
        <span className="rounded-full bg-brand-gradient px-2.5 py-0.5 font-display text-[13px] font-semibold text-white">
          Q{quarter.id}
        </span>
        <span className="text-[11.5px] font-extrabold uppercase tracking-wide text-muted">
          {quarter.months}
        </span>
      </div>
      <h4 className="mb-1.5 text-[16px] font-semibold text-forest-deep">{quarter.focus}</h4>
      <p className="mb-2.5 text-[12.5px] leading-relaxed text-muted">{quarter.blurb}</p>
      <div className="text-[12px] font-extrabold text-coral-deep">
        {count ? `${count} activities ready` : "Landing soon"}
      </div>
    </button>
  );
}
