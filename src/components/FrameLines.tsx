/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

// Same 1024px frame as the footer, so their side lines meet.
export const FRAME_WIDTH = "1024px";

// The frame's side lines. They fade in at the top and run down into the
// footer's side borders. Place inside a position: relative container that
// runs down to the footer.
const frameLinesStyle = css({
  display: "none",
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  maxWidth: FRAME_WIDTH,
  margin: "0 auto",
  boxSizing: "border-box",
  borderLeft: "1px solid rgba(255, 255, 255, 0.15)",
  borderRight: "1px solid rgba(255, 255, 255, 0.15)",
  pointerEvents: "none",
  WebkitMaskImage: "linear-gradient(to bottom, transparent, black 14rem)",
  maskImage: "linear-gradient(to bottom, transparent, black 14rem)",
  "@media (min-width: 1024px)": {
    display: "block",
  },
});

export function FrameLines() {
  return <div css={frameLinesStyle} aria-hidden="true" />;
}
