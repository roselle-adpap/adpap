# ADPAP Image Folders

Drop real, approved, consented photography into these folders using the
exact filenames listed in `src/data/images.ts`. The site automatically picks
up any file placed here — no code changes required.

- `/hero/` — homepage hero composition (DPO, compliance, HR, IT, executive)
- `/community/` — forum, workshop, networking, and community photos
- `/about/` — GlobalKnowledge PH heritage / training history photos
- `/membership/` — supporting shots for the Digital Membership ID showcase
- `/events/` — photo gallery for "Our Privacy Community"

Until real files are added, the site shows a tasteful on-brand placeholder
instead of a broken image or a fabricated photo — see
`src/components/ImagePlaceholder.tsx`.

Recommended formats: WebP or AVIF, reasonably compressed. See
`src/data/images.ts` for the recommended dimensions per slot.
