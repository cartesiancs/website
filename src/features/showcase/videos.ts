export const SHOWCASE_ROOT = "/cartcut/showcase";

export type ShowcaseVideo = {
  id: string;
  title: string;
  description: string;
  // Full-quality cut with sound, played on the showcase page.
  src: string;
  // Silent, smaller loop of the same cut for the autoplaying tiles, so the
  // CartCut page does not stream the full file just to show motion.
  preview: string;
  poster: string;
  seconds: number;
};

// Newest first; the CartCut page shows the first few and links here for the
// rest.
export const SHOWCASE_VIDEOS: ShowcaseVideo[] = [
  {
    id: "finding-things-out",
    title: "The pleasure of finding things out",
    description:
      "Kinetic type over archive photos and footage of Richard Feynman, cut to the rhythm of the words.",
    src: "/videos/r1.mp4",
    preview: "/videos/r1-preview.mp4",
    poster: "/videos/r1.jpg",
    seconds: 35,
  },
  {
    id: "video-editing-rebuilt",
    title: "Video editing, rebuilt",
    description:
      "A product teaser built from animated type and interface mockups, from the first line to the logo.",
    src: "/videos/r2.mp4",
    preview: "/videos/r2-preview.mp4",
    poster: "/videos/r2.jpg",
    seconds: 30,
  },
];

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}
