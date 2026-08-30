import { IMAGE_MANIFEST } from "@/data/images";
import ImagePlaceholder from "@/components/ImagePlaceholder";

const GALLERY_SLOT_IDS = ["event-gallery-1", "event-gallery-2", "event-gallery-3", "event-gallery-4"];

export default function PhotoGallery() {
  const slots = IMAGE_MANIFEST.filter((s) => GALLERY_SLOT_IDS.includes(s.id));

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {slots.map((s) => (
        <ImagePlaceholder
          key={s.id}
          slotId={s.id}
          label="Community Photo"
          className="aspect-square w-full rounded-xl shadow-card"
        />
      ))}
    </div>
  );
}
