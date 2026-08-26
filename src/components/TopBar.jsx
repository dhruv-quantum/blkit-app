import LogoMark from "./LogoMark";

export default function TopBar({ pill }) {
  return (
    <div className="sticky top-0 z-40 flex items-center gap-3.5 bg-forest-deep px-6 py-4 text-white shadow-md">
      <LogoMark size={38} />
      <div className="font-display font-semibold text-[19px] leading-tight">
        Brainy Ladder
        <span className="mt-0.5 block font-body font-semibold text-[11px] tracking-[0.08em] uppercase text-sun">
          Kit Companion
        </span>
      </div>
      <div className="ml-auto flex items-center gap-2.5">
        {pill && (
          <div className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[13px] font-bold">
            {pill}
          </div>
        )}
      </div>
    </div>
  );
}
