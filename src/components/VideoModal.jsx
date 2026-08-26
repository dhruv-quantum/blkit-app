import { CloseIcon, VideoIcon } from "./Icons";

export default function VideoModal({ activity, onClose }) {
  if (!activity) return null;
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-forest-deep/72 p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[460px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-sand-deep px-5 py-4">
          <h3 className="text-[16px] font-semibold text-forest-deep">{activity.title} — video</h3>
          <button
            onClick={onClose}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-sand text-forest-deep hover:bg-sand-deep"
          >
            <CloseIcon />
          </button>
        </div>

        {activity.videoUrl ? (
          <div className="aspect-video w-full bg-black">
            <iframe
              src={activity.videoUrl}
              title={`${activity.title} video`}
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
        ) : (
          <div className="px-5 pb-9 pt-[34px] text-center">
            <div className="mx-auto mb-3.5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-sand text-sun-deep">
              <VideoIcon />
            </div>
            <h4 className="mb-1.5 text-[16px] font-semibold text-forest-deep">Video on its way</h4>
            <p className="mx-auto max-w-[320px] text-[13.5px] leading-relaxed text-muted">
              A walkthrough video for this activity hasn&apos;t been added yet. Check back soon, or follow the
              printed steps for now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
