import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import BackButton from "../components/BackButton";
import { useKitAccess } from "../hooks/useKitAccess";
import { getKitById, QUARTERS } from "../data/kit";
import { getFlashcardGuide } from "../data/flashcards";

function QuarterBadge({ quarter }) {
  const q = QUARTERS.find((x) => x.id === quarter);
  return (
    <span className="inline-block rounded-full bg-sand-deep px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-forest">
      Q{quarter}
      {q ? ` · ${q.focus}` : ""}
    </span>
  );
}

export default function FlashcardGuide() {
  const { kitId } = useParams();
  const navigate = useNavigate();
  const { hasAccess, loading: accessLoading } = useKitAccess();
  const [filter, setFilter] = useState(0);

  const kit = getKitById(kitId);
  const guide = getFlashcardGuide(kitId);

  useEffect(() => {
    if (!accessLoading && (!kit || !guide || !hasAccess(kitId))) {
      navigate(kit ? `/kit/${kitId}` : "/", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessLoading, kitId]);

  if (!kit || !guide || accessLoading) {
    return (
      <div>
        <TopBar />
        <main className="mx-auto max-w-[1080px] px-5 py-10 text-[13.5px] text-muted">Loading…</main>
      </div>
    );
  }

  const decks = filter ? guide.decks.filter((d) => d.quarter === filter) : guide.decks;

  return (
    <div>
      <TopBar pill={`${kit.ageGroup} · ${kit.name}`} />
      <main className="mx-auto max-w-[1080px] px-5 pb-20 pt-7">
        <BackButton label={kit.name} onClick={() => navigate(`/kit/${kit.id}`)} />

        <div className="mb-7 rounded-2xl bg-forest-deep p-6 text-white shadow-md">
          <div className="eyebrow text-sun">{kit.ageGroup} Kit</div>
          <h2 className="mt-1.5 text-[25px]">{guide.title}</h2>
          <p className="mt-2 max-w-[640px] text-[14px] leading-relaxed text-white/78">{guide.intro}</p>
        </div>

        <div className="eyebrow mb-3 block">Tips for every session</div>
        <ul className="mb-8 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5">
          {guide.tips.map((t) => (
            <li key={t} className="rounded-2xl border border-line bg-white p-4 text-[13.5px] leading-relaxed text-ink shadow-md">
              {t}
            </li>
          ))}
        </ul>

        <div className="eyebrow mb-3 block">How to play</div>
        <div className="mb-9 grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4">
          {guide.games.map((g) => (
            <section key={g.id} className="rounded-2xl border border-line bg-white p-5 shadow-md" aria-label={g.title}>
              <QuarterBadge quarter={g.quarter} />
              <h3 className="mt-2 text-[18px] font-semibold text-forest-deep">{g.title}</h3>
              <div className="mt-0.5 text-[12.5px] font-bold text-muted">{g.focus}</div>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[13.5px] leading-relaxed text-ink">
                {g.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        <div className="eyebrow mb-1.5 block">Your decks</div>
        <p className="mb-3 max-w-[560px] text-[13.5px] leading-relaxed text-muted">
          Each deck is shown with the quarter where it fits best. You can use any deck at any time.
        </p>
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter decks by quarter">
          {[{ id: 0, label: "All decks" }, ...QUARTERS.map((q) => ({ id: q.id, label: `Q${q.id}` }))].map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-[13px] font-extrabold ${
                filter === f.id ? "border-forest-deep bg-forest-deep text-white" : "border-line bg-white text-forest"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
          {decks.map((d) => (
            <article key={d.id} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-md">
              <img
                src={`/images/flashcards/flash-${d.id}.jpg`}
                alt={`${d.name} flashcards preview`}
                loading="lazy"
                className="h-[150px] w-full bg-sand-deep object-contain"
              />
              <div className="px-4 pb-4 pt-3">
                <QuarterBadge quarter={d.quarter} />
                <h3 className="mt-2 text-[17px] font-semibold text-forest-deep">{d.name}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{d.note}</p>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
