import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import AgeLadder from "../components/AgeLadder";
import EntityCard from "../components/EntityCard";
import { LockIcon } from "../components/Icons";
import { AGE_GROUPS, ADDON_KITS, ANIMALS_BOOKLET, NURSERY_KIT } from "../data/kit";

export default function Library() {
  const [ageGroup, setAgeGroup] = useState("nursery");
  const navigate = useNavigate();
  const group = AGE_GROUPS.find((g) => g.id === ageGroup);

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

        <AgeLadder groups={AGE_GROUPS} activeId={ageGroup} onSelect={setAgeGroup} />

        <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-[18px]">
          {group.unlocked ? (
            <EntityCard
              title={NURSERY_KIT.name}
              meta={`${NURSERY_KIT.ageGroup} · ${NURSERY_KIT.price}`}
              image={ANIMALS_BOOKLET.cover}
              openLabel="Open kit"
              onOpen={() => navigate(`/kit/${NURSERY_KIT.id}`)}
            />
          ) : (
            <EntityCard title={group.kitName} meta={group.name} locked />
          )}
        </div>

        <div className="mt-7">
          <span className="eyebrow mb-2.5 block">Add-on kits</span>
          <div className="flex flex-wrap gap-3">
            {ADDON_KITS.map((name) => (
              <div
                key={name}
                className="flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13px] font-bold text-muted opacity-75"
              >
                <LockIcon /> {name}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
