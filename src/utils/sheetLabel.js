// The data stores the sheet reference the way it is printed in the booklet,
// e.g. "Sheet 2 · Activities 3–4". On its own that reads like jargon, so this
// turns it into a plain sentence for parents.
export function describeSheet(label) {
  const m = /^Sheet\s+(\d+)\s*[··]\s*Activit(?:y|ies)\s+(.+)$/i.exec(label || "");
  if (!m) return null;
  const many = /[-–,&]/.test(m[2]);
  return `Printed sheet ${m[1]} in your booklet (${many ? "activities" : "activity"} ${m[2].replace("-", "–")})`;
}
