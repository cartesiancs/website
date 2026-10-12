/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { type RefObject, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { formatDuration, SHOWCASE_ROOT, type ShowcaseVideo } from "./videos";

const tileStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  textDecoration: "none",
  ":hover [data-tile-video]": {
    transform: "scale(1.02)",
  },
  ":focus-visible": {
    outline: "none",
  },
  ":focus-visible [data-tile-frame]": {
    outline: "2px solid #93b2f0",
    outlineOffset: "4px",
  },
});

const frameStyle = css({
  position: "relative",
  overflow: "hidden",
  aspectRatio: "16 / 9",
  borderRadius: "clamp(18px, 2.2vw, 28px)",
  backgroundColor: "#1c1c1f",
  // Keeps the rounded corners clipping the video while it scales on hover.
  isolation: "isolate",
});

const videoStyle = css({
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
});

const captionStyle = css({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: "1rem",
  padding: "0 0.25rem",
});

const titleStyle = css({
  margin: 0,
  fontSize: "1.0625rem",
  fontWeight: 600,
  letterSpacing: "-0.01em",
  color: "#f5f5f7",
});

const durationStyle = css({
  flexShrink: 0,
  fontSize: "0.9375rem",
  fontVariantNumeric: "tabular-nums",
  color: "#86868b",
});

// Loops silently while at least half of it is on screen and pauses once it
// scrolls away. With preload="none" nothing downloads until the video is first
// seen, and reduced motion keeps the poster.
export function usePlayInView(ref: RefObject<HTMLVideoElement>) {
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
          data-tile-video
          css={videoStyle}
          src={video.preview}
          poster={video.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
      </div>
      <div css={captionStyle}>
        <h3 css={titleStyle}>{video.title}</h3>
        <span css={durationStyle}>{formatDuration(video.seconds)}</span>
      </div>
    </Link>
  );
}
