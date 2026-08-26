import { BackIcon } from "./Icons";

export default function BackButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="mb-[18px] inline-flex items-center gap-1.5 text-[13.5px] font-extrabold text-forest hover:text-coral-deep"
    >
      <BackIcon /> {label}
    </button>
  );
}
