import { CloseIcon } from "./Icons";
import { describeSheet } from "../utils/sheetLabel";

export default function SheetModal({ activity, onClose }) {
  if (!activity) return null;
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-forest-deep/72 p-4 sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[88vh] w-full max-w-[720px] overflow-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-sand-deep bg-white px-5 py-4">
          <h3 className="text-[16px] font-semibold text-forest-deep">{activity.title}</h3>
          <button
            onClick={onClose}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-sand text-forest-deep hover:bg-sand-deep"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="px-5 pb-[22px] pt-[18px]">
          <img src={activity.sheetImage} alt={`Worksheet for ${activity.title}`} className="rounded-[10px] border border-line" />
          <div className="mt-2.5 text-center text-[12.5px] text-muted">
            {describeSheet(activity.sheetLabel) ?? "This is the printed sheet included in your kit box."}
            {describeSheet(activity.sheetLabel) && <><br />It is the same sheet that comes in your kit box.</>}
          </div>
        </div>
      </div>
    </div>
  );
}
