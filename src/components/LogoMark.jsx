import logoMark from "../assets/logo-mark.png";

// The real Brainy Ladder mark — a film-strip/ladder rail merging into a
// gradient "B", supplied directly by the brand (src/assets/logo-mark.png).
export default function LogoMark({ size = 38, className = "" }) {
  return (
    <img
      src={logoMark}
      alt="Brainy Ladder"
      className={className}
      style={{ height: size, width: "auto", display: "block" }}
    />
  );
}
