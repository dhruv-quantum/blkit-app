import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import BackButton from "../components/BackButton";
import EntityCard from "../components/EntityCard";
import QuarterCard from "../components/QuarterCard";
import { NURSERY_KIT, ANIMALS_BOOKLET, QUARTERS, quarterCounts } from "../data/kit";

export default function KitHome() {
  const navigate = useNavigate();
  const counts = quarterCounts(ANIMALS_BOOKLET);

  return (
    <div>
      <TopBar pill={`${NURSERY_KIT.ageGroup} · ${NURSERY_KIT.name}`} />
      <main className="mx-auto max-w-[1080px] px-5 pb-20 pt-7">
        <BackButton label="Kit Library" onClick={() => navigate("/")} />

        <div className="mb-7 flex flex-wrap items-center gap-6 rounded-2xl bg-forest-deep p-6 text-white shadow-md">
          <div className="min-w-[240px] flex-1">
            <div className="eyebrow text-sun">{NURSERY_KIT.ageGroup} Kit</div>
            <h2 className="mt-1.5 text-[25px]">{NURSERY_KIT.name}</h2>
            <p className="mt-2 max-w-[420px] text-[14px] leading-relaxed text-white/78">{NURSERY_KIT.blurb}</p>
            <div className="mt-3.5 flex flex-wrap gap-2.5">
              {NURSERY_KIT.stats.map((s) => (
                <span key={s} className="rounded-full border border-white/16 bg-white/10 px-3.5 py-1.5 text-[12px] font-bold">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="w-[260px] shrink-0 max-[640px]:w-full">
            <div className="aspect-video overflow-hidden rounded-xl border-2 border-white/18 bg-black">
              <iframe
                src={NURSERY_KIT.introVideo}
                title={`${NURSERY_KIT.name} kit trailer`}
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
            <div className="mt-2 text-center text-[11.5px] font-extrabold uppercase tracking-wide text-sun">
              Official kit trailer
            </div>
          </div>
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
              onClick={() => navigate(`/kit/${NURSERY_KIT.id}/booklet/${ANIMALS_BOOKLET.id}?q=${q.id}`)}
            />
          ))}
        </div>

        <div className="eyebrow mb-3 block">Booklets in this box</div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
          {NURSERY_KIT.booklets.map((b) =>
            b.unlocked ? (
              <EntityCard
                key={b.id}
                title={b.name}
                meta={`${b.activities.length} activities across 4 quarters`}
                image={b.cover}
                openLabel="Open booklet"
                onOpen={() => navigate(`/kit/${NURSERY_KIT.id}/booklet/${b.id}`)}
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
