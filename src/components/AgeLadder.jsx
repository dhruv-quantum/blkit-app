export default function AgeLadder({ groups, activeId, onSelect }) {
  return (
    <div className="relative mb-8 flex overflow-hidden rounded-2xl bg-forest px-[22px] pt-[22px] shadow-lg">
      <div
        className="pointer-events-none absolute bottom-[38px] left-[22px] right-[22px] h-1.5 rounded"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(242,169,59,0.35) 0 18px, transparent 18px 30px)",
        }}
      />
      {groups.map((g, i) => {
        const active = g.id === activeId;
        return (
          <button
            key={g.id}
            disabled={!g.unlocked}
            onClick={() => g.unlocked && onSelect(g.id)}
            className={`relative z-10 flex-1 pb-5 text-center ${
              g.unlocked ? "cursor-pointer" : "cursor-default"
            }`}
          >
            <span
              className={`mx-auto mb-2.5 flex h-[34px] w-[34px] items-center justify-center rounded-full border-2 font-display text-sm font-semibold ${
                active
                  ? "border-transparent bg-brand-gradient text-white"
                  : "border-white/18 bg-white/10 text-white/60"
              }`}
            >
              {i + 1}
            </span>
            <span className={`block font-display text-[15px] font-semibold ${active ? "text-white" : "text-white/55"}`}>
              {g.name}
            </span>
            <span
              className={`mt-0.5 block text-[11.5px] font-bold ${
                g.unlocked ? "text-sun" : "text-white/45"
              }`}
            >
              {g.unlocked ? (active ? "Viewing" : "View kit") : "Climbing up soon"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
