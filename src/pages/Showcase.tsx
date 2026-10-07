/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { type SyntheticEvent, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";
import { SHOWCASE_VIDEOS } from "../features/showcase/videos";

const pageStyle = css({
  display: "flex",
  minHeight: "100%",
  width: "100%",
  flexDirection: "column",
  alignItems: "center",
});

// Wider than the CartCut page so the videos play at a watchable size.
const contentStyle = css({
  width: "100%",
  maxWidth: "960px",
  padding: "6rem 2rem 8rem 2rem",
  boxSizing: "border-box",
  "@media (max-width: 640px)": {
    padding: "7rem 1.5rem 6rem 1.5rem",
  },
});

const backStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  fontSize: "0.85rem",
  color: "#8a8a8f",
  textDecoration: "none",
  transition: "color 0.3s ease",
  ":hover": {
    color: "#ffffff",
  },
  ":hover svg": {
    transform: "translateX(-4px)",
  },
});

const backIconStyle = css({
  width: "16px",
  height: "16px",
  transition: "transform 0.3s ease",
});

const titleStyle = css({
  margin: "1.5rem 0 0 0",
  fontSize: "clamp(2rem, 5vw, 2.75rem)",
  fontWeight: 600,
  letterSpacing: "-0.03em",
  color: "#ffffff",
});

const introStyle = css({
  marginTop: "1rem",
  marginBottom: 0,
  fontSize: "1rem",
  lineHeight: 1.7,
  color: "#8a8a8f",
  fontWeight: 200,
});

const listStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "5rem",
  marginTop: "4rem",
  "@media (max-width: 640px)": {
    gap: "3.5rem",
    marginTop: "3rem",
  },
});

// Clears the fixed navbar when a tile on the CartCut page links straight here.
const itemStyle = css({
  scrollMarginTop: "6rem",
});

const playerStyle = css({
  display: "block",
  width: "100%",
  aspectRatio: "16 / 9",
  borderRadius: "12px",
  border: "1px solid rgb(36, 36, 43)",
  backgroundColor: "#000000",
  boxSizing: "border-box",
});

const itemTitleStyle = css({
  margin: "1.25rem 0 0 0",
  fontSize: "1.15rem",
  fontWeight: 500,
  letterSpacing: "-0.01em",
  color: "#ffffff",
});

const itemTextStyle = css({
  margin: "0.5rem 0 0 0",
  fontSize: "0.95rem",
  lineHeight: 1.7,
  color: "#bfbfc7",
  fontWeight: 200,
});

export function Showcase() {
  const { hash } = useLocation();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Showcase | CartCut";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  // ScrollToTop resets every navigation to the top, so the video a tile
  // pointed at is brought back into view afterwards.
  useEffect(() => {
    if (!hash) return;
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [hash]);

  // These play with sound, so starting one stops whichever was playing.
  const pauseOthers = (event: SyntheticEvent<HTMLVideoElement>) => {
    listRef.current?.querySelectorAll("video").forEach((video) => {
      if (video !== event.currentTarget) video.pause();
    });
  };

  return (
    <div css={pageStyle}>
      <TopNavBar />

      <div css={contentStyle}>
        <Link css={backStyle} to="/cartcut">
          <ArrowLeft css={backIconStyle} />
          CartCut
        </Link>

        <h1 css={titleStyle}>Showcase</h1>
        <p css={introStyle}>Videos edited with CartCut.</p>

        <div ref={listRef} css={listStyle}>
          {SHOWCASE_VIDEOS.map((video) => (
            <article key={video.id} id={video.id} css={itemStyle}>
              <video
                css={playerStyle}
                src={video.src}
                poster={video.poster}
                controls
                playsInline
                preload="metadata"
                onPlay={pauseOthers}
              />
              <h2 css={itemTitleStyle}>{video.title}</h2>
              <p css={itemTextStyle}>{video.description}</p>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
