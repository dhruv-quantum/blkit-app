import { LockIcon, PlayIcon } from "./Icons";

// A single card for something the person can open (a kit or a booklet), or a
// locked placeholder — either because the content isn't built yet
// (`lockReason="Coming soon"`) or because this parent hasn't been granted
// this kit (`lockReason="Not in your plan"`).
export default function EntityCard({ title, meta, image, locked, lockReason = "Coming soon", onOpen, openLabel }) {
  if (locked) {
    return (
      <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white opacity-60 shadow-md">
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-linear-to-br from-sand-deep to-line text-muted">
          <LockIcon width={22} height={22} />
        </div>
        <div className="px-4 pb-[18px] pt-3.5">
          <h3 className="text-[17px] font-semibold text-muted">{title}</h3>
          <div className="mt-1 text-[12.5px] font-bold text-muted">{meta}</div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] font-extrabold uppercase tracking-wide text-muted">
            <LockIcon /> {lockReason}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
      <button onClick={onOpen} className="block">
        {image ? (
          <img src={image} alt={title} className="aspect-[4/3] w-full bg-sand-deep object-cover" />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-linear-to-br from-sand-deep to-line text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-wide text-muted">Cover pending</span>
          </div>
        )}
      </button>
      <div className="px-4 pb-[18px] pt-3.5">
        <h3 className="text-[17px] font-semibold text-forest-deep">{title}</h3>
        <div className="mt-1 text-[12.5px] font-bold text-muted">{meta}</div>
        <button
          onClick={onOpen}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-4 py-2 text-[13px] font-extrabold text-white shadow-[0_3px_10px_rgba(232,101,74,0.28)] hover:brightness-105"
        >
          {openLabel} <PlayIcon />
        </button>
      </div>
    </div>
  );
}
