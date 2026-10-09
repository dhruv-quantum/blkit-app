import { useState } from "react";
import { CheckIcon, PlayIcon } from "./Icons";
import { describeSheet } from "../utils/sheetLabel";

export default function ActivityCard({ activity, isDone, onToggleDone, onViewSheet, onWatchVideo }) {
  const [open, setOpen] = useState(false);
  // Printed worksheet pages are portrait; the explainer sheets are landscape.
  // A portrait page shown whole (object-contain) beats a cropped top strip.
  const [portrait, setPortrait] = useState(false);

  const sheetNote = describeSheet(activity.sheetLabel);

  return (
    <div className="mb-4 flex overflow-hidden rounded-2xl border border-line bg-white shadow-md max-[640px]:flex-col">
      <button
        onClick={() => activity.sheetImage && onViewSheet(activity)}
        disabled={!activity.sheetImage}
        aria-label={activity.sheetImage ? `View worksheet: ${activity.title}` : undefined}
        className="relative w-[200px] shrink-0 self-stretch bg-sand-deep max-[640px]:h-[120px] max-[640px]:w-full min-[641px]:min-h-[150px]"
      >
        {activity.sheetImage ? (
          <>
            <img
              src={activity.sheetImage}
              alt=""
              loading="lazy"
              onLoad={(e) => setPortrait(e.currentTarget.naturalHeight > e.currentTarget.naturalWidth * 1.1)}
              className={`absolute inset-0 h-full w-full ${portrait ? "object-contain p-2 pb-10" : "object-cover object-top"}`}
            />
            <span className="absolute bottom-2 left-2 right-2 rounded-lg bg-forest-deep/85 px-1 py-1.5 text-center text-[11.5px] font-extrabold tracking-wide text-white">
              <span className="sm:hidden">View sheet</span>
              <span className="hidden sm:inline">View worksheet</span>
            </span>
          </>
        ) : (
          <span className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-sand-deep to-line px-3 text-center text-[11px] font-extrabold uppercase tracking-wide text-muted">
            Sheet pending
          </span>
        )}
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-3 p-[18px] max-[640px]:flex-col max-[640px]:items-stretch">
        <div className="min-w-0 flex-1">
          <span className="inline-block rounded-full border border-line bg-sand px-2.5 py-0.5 text-[11px] font-extrabold text-forest-deep">
            {activity.theme}
          </span>
          <h4 className="mt-1.5 text-[15.5px] font-semibold leading-snug text-ink">{activity.title}</h4>
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
              {sheetNote && <p className="mt-3 text-[12px] text-muted">{sheetNote}.</p>}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 self-center max-[640px]:w-full max-[640px]:flex-row-reverse max-[640px]:justify-between">
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
  );
}
