import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import AgeLadder from "../components/AgeLadder";
import EntityCard from "../components/EntityCard";
import { LockIcon } from "../components/Icons";
import { useAuth } from "../contexts/AuthContext";
import { useKitAccess } from "../hooks/useKitAccess";
import { KITS, ADDONS, getKitById } from "../data/kit";

// The 4 age-tied kits shown as ladder rungs. Phonics (all-ages) and the
// Flashcards add-on are shown separately below, since they don't fit an
// age progression.
const AGE_KIT_IDS = ["playgroup", "nursery", "kg1", "kg2"];

export default function Library() {
  const { role } = useAuth();
  const { hasAccess, loading } = useKitAccess();
  const [ageGroup, setAgeGroup] = useState("nursery");
  const navigate = useNavigate();

  const rungs = AGE_KIT_IDS.map((id) => {
    const kit = getKitById(id);
    return { id, name: kit.ageGroup, unlocked: true };
  });

  const activeKit = getKitById(ageGroup);
  const otherKits = [getKitById("phonics")];

  function renderKitCard(kit) {
    const granted = hasAccess(kit.id);
    if (granted && kit.contentReady) {
      return (
        <EntityCard
          key={kit.id}
          title={kit.name}
          meta={`${kit.ageGroup}${kit.price ? " · " + kit.price : ""}`}
          image={kit.image ?? kit.booklets[0]?.cover}
          openLabel="Open kit"
          onOpen={() => navigate(`/kit/${kit.id}`)}
        />
      );
    }
    return (
      <EntityCard
        key={kit.id}
        title={kit.name}
        meta={kit.ageGroup}
        locked
        lockReason={granted ? "Coming soon" : "Not in your plan"}
      />
    );
  }

  return (
    <div>
      <TopBar />
      <main className="mx-auto max-w-[1080px] px-5 pb-20 pt-7">
        <div className="mb-8">
          <div className="eyebrow">Kit Library</div>
          <h1 className="mt-1.5 text-[30px] text-forest-deep">Pick up where your kit left off</h1>
          <p className="mt-2 max-w-[520px] text-[15.5px] leading-relaxed text-muted">
            Instruction sheets and activity videos for every Brainy Ladder box — a screen-free learning journey,
            organized by age group.
          </p>
        </div>

        <AgeLadder groups={rungs} activeId={ageGroup} onSelect={setAgeGroup} />

        {loading ? (
          <div className="text-[13.5px] text-muted">Loading your kits…</div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-[18px]">
            {renderKitCard(activeKit)}
          </div>
        )}

        <div className="mt-7">
          <span className="eyebrow mb-2.5 block">Other kits</span>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-[18px]">
            {otherKits.map((kit) => renderKitCard(kit))}
          </div>
        </div>

        <div className="mt-7">
          <span className="eyebrow mb-2.5 block">Add-ons</span>
          <div className="flex flex-wrap gap-3">
            {ADDONS.map((addon) => {
              const granted = hasAccess(addon.id);
              return (
                <div
                  key={addon.id}
                  className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[13px] font-bold ${
                    granted
                      ? "border-forest bg-forest/5 text-forest-deep"
                      : "border-line bg-white text-muted opacity-75"
                  }`}
                >
                  {!granted && <LockIcon />} {addon.name}
                  {granted && <span className="text-[11px] uppercase text-forest">Included</span>}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
