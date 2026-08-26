import { useState } from "react";
import { CheckIcon, PlayIcon } from "./Icons";

export default function ActivityCard({ activity, isDone, onToggleDone, onViewSheet, onWatchVideo }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-[18px] flex overflow-hidden rounded-2xl border border-line bg-white shadow-md max-[640px]:flex-col">
      <button
        onClick={() => onViewSheet(activity)}
        className="relative w-[190px] shrink-0 bg-sand-deep max-[640px]:h-[150px] max-[640px]:w-full"
      >
        <img src={activity.sheetImage} alt={activity.sheetLabel} className="h-full w-full object-cover" />
        <div className="absolute bottom-2 left-2 right-2 rounded-lg bg-forest-deep/85 px-1 py-1.5 text-center text-[11px] font-extrabold tracking-wide text-white">
          {activity.sheetLabel}
        </div>
      </button>

      <div className="flex-1 py-1.5">
        <div className="flex items-start gap-3 p-[18px] max-[640px]:flex-col">
          <span className="mt-0.5 shrink-0 self-start rounded-full border border-line bg-sand px-2.5 py-1 text-[11px] font-extrabold text-forest-deep">
            {activity.theme}
          </span>

          <div className="min-w-0 flex-1">
            <h4 className="text-[15.5px] font-semibold text-ink">{activity.title}</h4>
            <div className="mt-0.5 text-[12.5px] text-muted">Focus: {activity.focus}</div>
            <button
              onClick={() => setOpen((o) => !o)}
              className="mt-2 text-[12.5px] font-extrabold text-forest hover:text-coral-deep"
            >
              {open ? "Hide steps & materials ▴" : "Show steps & materials ▾"}
            </button>

            {open && (
              <div className="mt-3 border-t border-dashed border-line pt-3">
                <div className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wide text-sun-deep">
                  Materials needed
                </div>
                <div className="mb-3.5 flex flex-wrap gap-1.5">
                  {activity.materials.map((m) => (
                    <span key={m} className="rounded-full border border-line bg-sand px-2.5 py-1 text-[12px] font-bold text-forest-deep">
                      {m}
                    </span>
                  ))}
                </div>
                <div className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wide text-sun-deep">Steps</div>
                <ul className="list-disc space-y-1.5 pl-[18px] text-[14px] leading-relaxed text-ink">
                  {activity.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2 max-[640px]:w-full max-[640px]:flex-row-reverse max-[640px]:justify-between">
            <button
              onClick={() => onWatchVideo(activity)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-extrabold ${
                activity.videoUrl
                  ? "border-coral bg-coral text-white hover:bg-coral-deep"
                  : "border-line bg-sand text-forest-deep hover:bg-sand-deep"
              }`}
            >
              <PlayIcon /> Video
            </button>
            <button
              onClick={() => onToggleDone(activity.id)}
              title="Mark complete"
              className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                isDone ? "border-transparent bg-forest-light" : "border-line bg-white"
              }`}
            >
              {isDone && <CheckIcon width={14} height={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
