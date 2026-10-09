import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import BackButton from "../components/BackButton";
import EntityCard from "../components/EntityCard";
import QuarterCard from "../components/QuarterCard";
import ProgressBar from "../components/ProgressBar";
import { useKitAccess } from "../hooks/useKitAccess";
import { useKitProgress } from "../hooks/useKitProgress";
import { getKitById, QUARTERS } from "../data/kit";

function quarterCountsForKit(kit) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
  kit.booklets.forEach((b) => {
    if (!b.activities) return;
    b.activities.forEach((a) => {
      counts[a.quarter] = (counts[a.quarter] || 0) + 1;
    });
  });
  return counts;
}

export default function KitHome() {
  const { kitId } = useParams();
  const navigate = useNavigate();
  const { hasAccess, loading: accessLoading } = useKitAccess();

  const kit = getKitById(kitId);
  const bookletIds = (kit?.booklets ?? []).filter((b) => b.unlocked && b.activities).map((b) => b.id);
  const { isDone } = useKitProgress(kitId, bookletIds);

  useEffect(() => {
    if (!accessLoading && (!kit || !hasAccess(kitId))) {
      navigate("/", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessLoading, kitId]);

  if (!kit || accessLoading) {
    return (
      <div>
        <TopBar />
        <main className="mx-auto max-w-[1080px] px-5 py-10 text-[13.5px] text-muted">Loading…</main>
      </div>
    );
  }

  if (!kit.contentReady) {
    return (
      <div>
        <TopBar pill={kit.ageGroup} />
        <main className="mx-auto max-w-[1080px] px-5 pb-20 pt-7">
          <BackButton label="Kit Library" onClick={() => navigate("/")} />
          <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
            <h2 className="mb-2 text-[22px] text-forest-deep">{kit.name}</h2>
            <p className="mx-auto max-w-[420px] text-[14px] text-muted">
              This kit&apos;s activity sheets haven&apos;t been loaded into the app yet. Check back soon.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const counts = quarterCountsForKit(kit);
  const doneCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
  kit.booklets.forEach((b) => {
    b.activities?.forEach((a) => {
      if (isDone(b.id, a.id)) doneCounts[a.quarter] = (doneCounts[a.quarter] || 0) + 1;
    });
  });

  const totalActivities = Object.values(counts).reduce((n, c) => n + c, 0);
  const totalDone = Object.values(doneCounts).reduce((n, c) => n + c, 0);
  const bookletDone = (b) => (b.activities ?? []).filter((a) => isDone(b.id, a.id)).length;

  return (
    <div>
      <TopBar pill={`${kit.ageGroup} · ${kit.name}`} />
      <main className="mx-auto max-w-[1080px] px-5 pb-20 pt-7">
        <BackButton label="Kit Library" onClick={() => navigate("/")} />

        <div className="mb-7 flex flex-wrap items-center gap-6 rounded-2xl bg-forest-deep p-6 text-white shadow-md">
          <div className="min-w-[240px] flex-1">
            <div className="eyebrow text-sun">{kit.ageGroup} Kit</div>
            <h2 className="mt-1.5 text-[25px]">{kit.name}</h2>
            <p className="mt-2 max-w-[420px] text-[14px] leading-relaxed text-white/78">{kit.blurb}</p>
            <div className="mt-3.5 flex flex-wrap gap-2.5">
              {kit.stats?.map((s) => (
                <span key={s} className="rounded-full border border-white/16 bg-white/10 px-3.5 py-1.5 text-[12px] font-bold">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-5 max-w-[420px]">
              <div className="mb-1.5 text-[11.5px] font-extrabold uppercase tracking-wide text-white/70">Your progress</div>
              <ProgressBar done={totalDone} total={totalActivities} tone="dark" />
            </div>
          </div>
          {kit.introVideo && (
            <div className="w-[260px] shrink-0 max-[640px]:w-full">
              <div className="aspect-video overflow-hidden rounded-xl border-2 border-white/18 bg-black">
                <iframe
                  src={kit.introVideo}
                  title={`${kit.name} kit trailer`}
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>
              <div className="mt-2 text-center text-[11.5px] font-extrabold uppercase tracking-wide text-sun">
                Official kit trailer
              </div>
            </div>
          )}
        </div>

        <div className="eyebrow mb-1.5 block">This year, in 4 quarters</div>
        <p className="mb-4 max-w-[560px] text-[13.5px] leading-relaxed text-muted">
          Activities are sequenced by how much your child does independently — from sensory play to multi-step,
          imaginative work. Tap a quarter to jump straight in.
        </p>
        <div className="mb-7 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3.5">
          {QUARTERS.map((q) => (
            <QuarterCard
              key={q.id}
              quarter={q}
              count={counts[q.id] || 0}
              done={doneCounts[q.id] || 0}
              onClick={() => navigate(`/kit/${kit.id}/quarter/${q.id}`)}
            />
          ))}
        </div>

        <div className="eyebrow mb-3 block">Or browse by topic</div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
          {kit.booklets.map((b) =>
            b.unlocked ? (
              <EntityCard
                key={b.id}
                title={b.name}
                meta={`${b.activities.length} activities across 4 quarters`}
                progress={{ done: bookletDone(b), total: b.activities.length }}
                image={b.cover}
                openLabel="Open booklet"
                onOpen={() => navigate(`/kit/${kit.id}/booklet/${b.id}`)}
              />
            ) : (
              <EntityCard key={b.id} title={b.name} meta="Booklet" locked />
            )
          )}
        </div>
      </main>
    </div>
  );
}
