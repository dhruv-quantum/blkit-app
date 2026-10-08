import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import BackButton from "../components/BackButton";
import ActivityCard from "../components/ActivityCard";
import SheetModal from "../components/SheetModal";
import VideoModal from "../components/VideoModal";
import { useKitProgress } from "../hooks/useKitProgress";
import { useKitAccess } from "../hooks/useKitAccess";
import { getKitById, QUARTERS, activitiesForQuarter } from "../data/kit";

// One quarter of the kit year: every activity for that quarter, across all of
// the kit's booklets, grouped by booklet. This is the main way through a kit —
// the booklet pages are the "browse by topic" alternative.
export default function QuarterView() {
  const { kitId, quarterId } = useParams();
  const navigate = useNavigate();
  const { hasAccess, loading: accessLoading } = useKitAccess();

  const kit = getKitById(kitId);
  const quarter = QUARTERS.find((q) => String(q.id) === quarterId);

  const booklets = useMemo(() => (kit ? kit.booklets.filter((b) => b.unlocked && b.activities) : []), [kit]);
  const bookletIds = useMemo(() => booklets.map((b) => b.id), [booklets]);
  const { isDone, toggle, clearMany } = useKitProgress(kitId, bookletIds);

  const [sheetActivity, setSheetActivity] = useState(null);
  const [videoActivity, setVideoActivity] = useState(null);

  useEffect(() => {
    if (!accessLoading && (!kit || !hasAccess(kitId))) {
      navigate("/", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessLoading, kitId]);

  const counts = useMemo(() => {
    const c = { 1: 0, 2: 0, 3: 0, 4: 0 };
    booklets.forEach((b) => b.activities.forEach((a) => (c[a.quarter] = (c[a.quarter] || 0) + 1)));
    return c;
  }, [booklets]);

  if (accessLoading || !kit) {
    return (
      <div>
        <TopBar />
        <main className="mx-auto max-w-[1080px] px-5 py-10 text-[13.5px] text-muted">Loading…</main>
      </div>
    );
  }

  if (!quarter) {
    return (
      <div>
        <TopBar />
        <main className="mx-auto max-w-[1080px] px-5 py-10">
          <p className="text-muted">That quarter doesn&apos;t exist.</p>
          <button className="mt-3 font-bold text-forest" onClick={() => navigate(`/kit/${kitId}`)}>
            Back to {kit.name}
          </button>
        </main>
      </div>
    );
  }

  const groups = booklets
    .map((b) => ({ booklet: b, activities: activitiesForQuarter(b, quarter.id) }))
    .filter((g) => g.activities.length);

  const total = counts[quarter.id] || 0;
  const done = groups.reduce(
    (sum, g) => sum + g.activities.filter((a) => isDone(g.booklet.id, a.id)).length,
    0
  );
  const pct = total ? Math.round((done / total) * 100) : 0;

  function resetQuarter() {
    clearMany(groups.flatMap((g) => g.activities.map((a) => ({ bookletId: g.booklet.id, activityId: a.id }))));
  }

  return (
    <div>
      <TopBar pill={`${kit.name} · Quarter ${quarter.id}`} />
      <main className="mx-auto max-w-[1080px] px-5 pb-20 pt-7">
        <BackButton label={kit.name} onClick={() => navigate(`/kit/${kit.id}`)} />

        <div className="mb-6 flex gap-[22px] overflow-hidden rounded-2xl bg-forest-deep text-white shadow-md max-[640px]:flex-col">
          <div className="flex h-[150px] w-full flex-col items-center justify-center bg-brand-gradient sm:h-auto sm:w-[220px]">
            <span className="font-display text-[56px] font-semibold leading-none">Q{quarter.id}</span>
            <span className="mt-1.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-white/90">
              {quarter.months}
            </span>
          </div>
          <div className="py-[22px] pr-[22px] max-[640px]:p-4">
            <div className="eyebrow text-sun">{kit.name} · Quarter {quarter.id}</div>
            <h2 className="mt-1.5 text-[26px]">{quarter.focus}</h2>
            <p className="mt-1.5 text-[14.5px] text-white/78">
              {total} activities across {groups.length} {groups.length === 1 ? "topic" : "topics"}
            </p>
            <div className="mt-4 max-w-[360px]">
              <div className="mb-1.5 text-[12.5px] font-bold text-sun">
                {done} of {total} activities complete
              </div>
              <div className="h-[9px] overflow-hidden rounded-full bg-white/16">
                <div className="h-full rounded-full bg-sun transition-[width]" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {QUARTERS.map((q) => {
            const active = q.id === quarter.id;
            return (
              <button
                key={q.id}
                onClick={() => navigate(`/kit/${kit.id}/quarter/${q.id}`, { replace: true })}
                className={`rounded-full border px-[18px] py-2 text-[13.5px] font-extrabold ${
                  active
                    ? "border-forest-deep bg-forest-deep text-white"
                    : "border-line bg-white text-forest-deep"
                }`}
              >
                Q{q.id} · {q.focus}{" "}
                <span
                  className={`ml-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10.5px] ${
                    active ? "bg-white/22" : "bg-black/8"
                  }`}
                >
                  {counts[q.id] || 0}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mb-2 rounded-xl border border-line bg-sand-deep px-4 py-3 text-[13px] leading-relaxed text-ink">
          <strong className="text-coral-deep">{quarter.months}.</strong> {quarter.blurb}
        </div>

        {groups.length ? (
          groups.map(({ booklet, activities }) => (
            <section key={booklet.id}>
              <div className="mb-3 mt-7 flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-[18px] text-forest-deep">
                  {booklet.name}
                  <span className="inline-flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-black/8 px-1.5 text-[11px] font-extrabold">
                    {activities.length}
                  </span>
                </h3>
                <button
                  onClick={() => navigate(`/kit/${kit.id}/booklet/${booklet.id}?q=${quarter.id}`)}
                  className="text-[12.5px] font-extrabold text-forest hover:text-coral-deep"
                >
                  See whole booklet →
                </button>
              </div>
              {activities.map((a) => (
                <ActivityCard
                  key={a.id}
                  activity={a}
                  isDone={isDone(booklet.id, a.id)}
                  onToggleDone={() => toggle(booklet.id, a.id)}
                  onViewSheet={setSheetActivity}
                  onWatchVideo={setVideoActivity}
                />
              ))}
            </section>
          ))
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-line bg-white p-[26px] text-center text-[13.5px] text-muted">
            No activities land in {quarter.name} yet.
          </div>
        )}

        <div className="mt-2 flex justify-end">
          <button
            onClick={() => {
              if (window.confirm(`Clear all completed activities for ${quarter.name}?`)) resetQuarter();
            }}
            className="text-[12.5px] font-bold text-muted underline hover:text-coral-deep"
          >
            Reset progress for this quarter
          </button>
        </div>
      </main>

      <SheetModal activity={sheetActivity} onClose={() => setSheetActivity(null)} />
      <VideoModal activity={videoActivity} onClose={() => setVideoActivity(null)} />
    </div>
  );
}
