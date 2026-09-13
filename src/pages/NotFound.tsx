/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef } from "react";
import { css, keyframes } from "@emotion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";

// One grid cell equals one unit on the plotted plane.
const GRID_SIZE = 48;

const riseIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pageStyle = css({
  display: "flex",
  minHeight: "100%",
  width: "100%",
  flexDirection: "column",
  alignItems: "center",
});

const heroStyle = css({
  position: "relative",
  isolation: "isolate",
  width: "100%",
  minHeight: "100svh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  boxSizing: "border-box",
  padding: "7rem 2rem 5rem 2rem",
  "@media (max-width: 640px)": {
    padding: "6rem 1.5rem 4rem 1.5rem",
  },
});

// The extra half cell in background-position puts a grid line exactly on the
// origin, so the grid lines up with the axes at every viewport size.
const gridStyle = css({
  position: "absolute",
  inset: 0,
  zIndex: -1,
  pointerEvents: "none",
  backgroundImage:
    "linear-gradient(to right, rgba(255, 255, 255, 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.045) 1px, transparent 1px)",
  backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
  backgroundPosition: `calc(50% + ${GRID_SIZE / 2}px) calc(50% + ${
    GRID_SIZE / 2
  }px)`,
  WebkitMaskImage:
    "radial-gradient(ellipse at center, #000 15%, transparent 70%)",
  maskImage: "radial-gradient(ellipse at center, #000 15%, transparent 70%)",
});

const xAxisStyle = css({
  position: "absolute",
  left: 0,
  right: 0,
  top: "50%",
  height: "1px",
  zIndex: -1,
  pointerEvents: "none",
  background:
    "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.14), transparent)",
});

const yAxisStyle = css({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: "50%",
  width: "1px",
  zIndex: -1,
  pointerEvents: "none",
  background:
    "linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.14), transparent)",
});

// Positioned through CSS variables written from the pointer handler, so
// tracking the cursor never re-renders the page.
const crosshairStyle = css({
  position: "absolute",
  inset: 0,
  zIndex: -1,
  pointerEvents: "none",
  opacity: 0,
  transition: "opacity 0.3s ease",
  '&[data-active="true"]': {
    opacity: 1,
  },
  "@media (hover: none)": {
    display: "none",
  },
});

const crosshairVerticalStyle = css({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  width: "1px",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  transform: "translateX(var(--cursor-x))",
});

const crosshairHorizontalStyle = css({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  height: "1px",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  transform: "translateY(var(--cursor-y))",
});

const crosshairDotStyle = css({
  position: "absolute",
  top: 0,
  left: 0,
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  backgroundColor: "#ffffff",
  transform:
    "translate(calc(var(--cursor-x) - 3px), calc(var(--cursor-y) - 3px))",
});

const readoutStyle = css({
  position: "absolute",
  top: 0,
  left: 0,
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  fontSize: "0.75rem",
  color: "#8a8a8f",
  whiteSpace: "nowrap",
  transform:
    "translate(calc(var(--cursor-x) + 12px), calc(var(--cursor-y) + 10px))",
});

const contentStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: "560px",
  textAlign: "center",
  animation: `${riseIn} 0.8s cubic-bezier(0.22, 1, 0.36, 1) both`,
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
});

const codeStyle = css({
  margin: 0,
  fontSize: "clamp(6rem, 22vw, 11rem)",
  fontWeight: 600,
  lineHeight: 1,
  letterSpacing: "-0.06em",
  background: "linear-gradient(to bottom, #ffffff 30%, #5a5a63 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
});

const titleStyle = css({
  margin: "1.5rem 0 0 0",
  fontSize: "clamp(1.4rem, 3.5vw, 1.75rem)",
  fontWeight: 600,
  letterSpacing: "-0.03em",
  color: "#ffffff",
});

const introStyle = css({
  margin: "0.75rem 0 0 0",
  fontSize: "1rem",
  lineHeight: 1.7,
  color: "#8a8a8f",
  fontWeight: 200,
});

const pathStyle = css({
  marginTop: "1.25rem",
  maxWidth: "100%",
  boxSizing: "border-box",
  padding: "0.35rem 0.65rem",
  borderRadius: "6px",
  border: "1px solid rgb(36, 36, 43)",
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  fontSize: "0.85rem",
  color: "#bfbfc7",
  overflowWrap: "anywhere",
});

const actionsStyle = css({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "0.75rem",
  marginTop: "2.25rem",
});

const buttonBaseStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.55rem",
  padding: "0.7rem 1.2rem",
  borderRadius: "8px",
  fontFamily: "inherit",
  fontSize: "0.9rem",
  fontWeight: 500,
  lineHeight: 1.2,
  textDecoration: "none",
  cursor: "pointer",
  border: "1px solid transparent",
  transition:
    "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease",
  "& svg": {
    width: "16px",
    height: "16px",
  },
});

const primaryButtonStyle = css({
  backgroundColor: "#ffffff",
  color: "#0d0e0f",
  ":hover": {
    backgroundColor: "#d8d8e0",
  },
});

const secondaryButtonStyle = css({
  backgroundColor: "transparent",
  borderColor: "rgb(36, 36, 43)",
  color: "#e6e6eb",
  ":hover": {
    borderColor: "rgb(70, 70, 80)",
    color: "#ffffff",
  },
});

// Avoids printing "-0.0" when the cursor sits just left of or below an axis.
const formatUnit = (value: number) =>
  (Math.abs(value) < 0.05 ? 0 : value).toFixed(1);

export function NotFound() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const crosshairRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);

  // BrowserRouter keeps its own history index; 0 means the visitor landed
  // here directly, so there is no in-site page to go back to.
  const canGoBack = (window.history.state?.idx ?? 0) > 0;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Page not found | cartesiancs";

    // The SPA fallback answers unknown URLs with 200, so tell crawlers not to
    // index this soft 404.
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.appendChild(robots);

    return () => {
      document.title = previousTitle;
      robots.remove();
    };
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const crosshair = crosshairRef.current;
    if (!crosshair || event.pointerType === "touch") return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    crosshair.style.setProperty("--cursor-x", `${x}px`);
    crosshair.style.setProperty("--cursor-y", `${y}px`);
    crosshair.dataset.active = "true";

    if (readoutRef.current) {
      const unitX = (x - rect.width / 2) / GRID_SIZE;
      const unitY = (rect.height / 2 - y) / GRID_SIZE;
      readoutRef.current.textContent = `(${formatUnit(unitX)}, ${formatUnit(
        unitY
      )})`;
    }
  };

  const handlePointerLeave = () => {
    if (crosshairRef.current) crosshairRef.current.dataset.active = "false";
  };

  return (
    <div css={pageStyle}>
      <TopNavBar />

      <section
        css={heroStyle}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div css={gridStyle} aria-hidden="true" />
        <div css={xAxisStyle} aria-hidden="true" />
        <div css={yAxisStyle} aria-hidden="true" />

        <div ref={crosshairRef} css={crosshairStyle} aria-hidden="true">
          <div css={crosshairVerticalStyle} />
          <div css={crosshairHorizontalStyle} />
          <div css={crosshairDotStyle} />
          <span ref={readoutRef} css={readoutStyle} />
        </div>

        <div css={contentStyle}>
          <p css={codeStyle} aria-hidden="true">
            404
          </p>
          <h1 css={titleStyle}>This coordinate is uncharted.</h1>
          <p css={introStyle}>
            Nothing has been plotted at this address. The page may have moved,
            or it was never here to begin with.
          </p>
          <code css={pathStyle}>{pathname}</code>

          <div css={actionsStyle}>
            <Link css={[buttonBaseStyle, primaryButtonStyle]} to="/">
              Back to home
              <ArrowRight />
            </Link>
            {canGoBack && (
              <button
                type="button"
                css={[buttonBaseStyle, secondaryButtonStyle]}
                onClick={() => navigate(-1)}
              >
                <ArrowLeft />
                Go back
              </button>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
