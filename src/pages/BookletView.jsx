import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import BackButton from "../components/BackButton";
import ActivityCard from "../components/ActivityCard";
import SheetModal from "../components/SheetModal";
import VideoModal from "../components/VideoModal";
import { useProgress } from "../hooks/useProgress";
import { NURSERY_KIT, QUARTERS, getBookletById, activitiesForQuarter, quarterCounts } from "../data/kit";

export default function BookletView() {
  const { bookletId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const booklet = getBookletById(bookletId);
  const initialQuarter = parseInt(searchParams.get("q"), 10) || 1;
  const [activeQuarter, setActiveQuarter] = useState(initialQuarter);
  const [sheetActivity, setSheetActivity] = useState(null);
  const [videoActivity, setVideoActivity] = useState(null);

  const { done, toggle, reset } = useProgress(NURSERY_KIT.id, bookletId);

  const counts = useMemo(() => (booklet ? quarterCounts(booklet) : {}), [booklet]);
  const quarter = QUARTERS.find((q) => q.id === activeQuarter) || QUARTERS[0];
  const activities = booklet ? activitiesForQuarter(booklet, quarter.id) : [];

  if (!booklet) {
    return (
      <div>
        <TopBar />
        <main className="mx-auto max-w-[1080px] px-5 py-10">
          <p className="text-muted">That booklet isn&apos;t available yet.</p>
          <button className="mt-3 font-bold text-forest" onClick={() => navigate("/")}>
            Back to Library
          </button>
        </main>
      </div>
    );
  }

  const total = booklet.activities.length;
  const pct = total ? Math.round((done.length / total) * 100) : 0;

  function selectQuarter(id) {
    setActiveQuarter(id);
    setSearchParams(id === 1 ? {} : { q: id });
  }

  return (
    <div>
      <TopBar pill={`${NURSERY_KIT.name} · ${booklet.name}`} />
      <main className="mx-auto max-w-[1080px] px-5 pb-20 pt-7">
        <BackButton label={NURSERY_KIT.name} onClick={() => navigate(`/kit/${NURSERY_KIT.id}`)} />

        <div className="mb-6 flex gap-[22px] overflow-hidden rounded-2xl bg-forest-deep text-white shadow-md max-[640px]:flex-col">
          <img src={booklet.cover} alt={booklet.name} className="h-[150px] w-full object-cover sm:h-auto sm:w-[220px]" />
          <div className="py-[22px] pr-[22px] max-[640px]:p-4">
            <div className="eyebrow text-sun">{NURSERY_KIT.name} · Booklet</div>
            <h2 className="mt-1.5 text-[26px]">{booklet.name}</h2>
            <p className="mt-1.5 text-[14.5px] text-white/78">{booklet.tagline}</p>
            <div className="mt-4 max-w-[360px]">
              <div className="mb-1.5 text-[12.5px] font-bold text-sun">
                {done.length} of {total} activities complete
              </div>
              <div className="h-[9px] overflow-hidden rounded-full bg-white/16">
                <div className="h-full rounded-full bg-sun transition-[width]" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {QUARTERS.map((q) => {
            const active = q.id === activeQuarter;
            return (
              <button
                key={q.id}
                onClick={() => selectQuarter(q.id)}
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

        <div className="mb-[18px] rounded-xl border border-line bg-sand-deep px-4 py-3 text-[13px] leading-relaxed text-ink">
          <strong className="text-coral-deep">{quarter.months}.</strong> {quarter.blurb}
        </div>

        {activities.length ? (
          activities.map((a) => (
            <ActivityCard
              key={a.id}
              activity={a}
              isDone={done.includes(a.id)}
              onToggleDone={toggle}
              onViewSheet={setSheetActivity}
              onWatchVideo={setVideoActivity}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-line bg-white p-[26px] text-center text-[13.5px] text-muted">
            No activities from this booklet land in {quarter.name} yet.
          </div>
        )}

        <div className="mt-2 flex justify-end">
          <button
            onClick={() => {
              if (window.confirm("Clear all completed activities for this booklet?")) reset();
            }}
            className="text-[12.5px] font-bold text-muted underline hover:text-coral-deep"
          >
            Reset progress for this booklet
          </button>
        </div>
      </main>

      <SheetModal activity={sheetActivity} onClose={() => setSheetActivity(null)} />
      <VideoModal activity={videoActivity} onClose={() => setVideoActivity(null)} />
    </div>
  );
}
