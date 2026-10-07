/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { type RefObject, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { formatDuration, SHOWCASE_ROOT, type ShowcaseVideo } from "./videos";

const tileStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "0.85rem",
  textDecoration: "none",
  ":hover [data-tile-frame]": {
    borderColor: "rgb(70, 70, 80)",
  },
  ":hover [data-tile-title]": {
    color: "#ffffff",
  },
  ":focus-visible": {
    outline: "none",
  },
  ":focus-visible [data-tile-frame]": {
    outline: "2px solid #ffffff",
    outlineOffset: "4px",
  },
});

const frameStyle = css({
  position: "relative",
  overflow: "hidden",
  aspectRatio: "16 / 9",
  borderRadius: "12px",
  border: "1px solid rgb(36, 36, 43)",
  backgroundColor: "#000000",
  transition: "border-color 0.3s ease",
});

const videoStyle = css({
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const durationStyle = css({
  position: "absolute",
  right: "0.6rem",
  bottom: "0.6rem",
  padding: "0.15rem 0.45rem",
  borderRadius: "6px",
  backgroundColor: "rgba(13, 14, 15, 0.72)",
  fontSize: "0.75rem",
  fontVariantNumeric: "tabular-nums",
  color: "#e6e6eb",
});

const titleStyle = css({
  margin: 0,
  fontSize: "0.95rem",
  fontWeight: 500,
  letterSpacing: "-0.01em",
  color: "#e6e6eb",
  transition: "color 0.3s ease",
});

// Loops silently while at least half of it is on screen and pauses once it
// scrolls away. With preload="none" nothing downloads until the tile is first
// seen, and reduced motion keeps the poster.
function usePlayInView(ref: RefObject<HTMLVideoElement>) {
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [ref]);
}

// Opens the showcase page at this video, where it plays with sound.
export function ShowcaseTile({ video }: { video: ShowcaseVideo }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  usePlayInView(videoRef);

  return (
    <Link css={tileStyle} to={`${SHOWCASE_ROOT}#${video.id}`}>
      <div data-tile-frame css={frameStyle}>
        <video
          ref={videoRef}
          css={videoStyle}
          src={video.preview}
          poster={video.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
        <span css={durationStyle}>{formatDuration(video.seconds)}</span>
      </div>
      <h3 data-tile-title css={titleStyle}>
        {video.title}
      </h3>
    </Link>
  );
}
