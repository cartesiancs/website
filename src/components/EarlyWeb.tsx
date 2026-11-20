/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { FRAME_WIDTH } from "./FrameLines";
import { usePageTransition } from "./PageTransition";

// Shared pieces for the pages dressed as an early web directory listing
// (Product, Career): Times headings, monospace data, underlined blue links,
// sunken <hr>s and an Apache-style server signature.

export const SERIF = '"Times New Roman", Times, serif';
export const MONO =
  'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';

export const LINE = "rgba(255, 255, 255, 0.1)";
export const MUTED = "#8a8a8f";
export const DATA = "#c4c4cc";
// The browser-default link blue and visited purple, lifted to read on the
// dark page.
const LINK = "#7aa7ff";
const LINK_HOVER = "#a9c6ff";
const VISITED = "#b39dff";

export const TITLE_CHAR_MS = 40;
// Time between one typed line starting and the next.
export const LINE_STEP_MS = 90;

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------------------------------------------------------------------------
// Page frame

export const pageStyle = css({
  width: "100%",
  minHeight: "100%",
  display: "flex",
  flexDirection: "column",
});

// Fills the space above the footer so the frame lines reach it.
export const mainStyle = css({
  position: "relative",
  isolation: "isolate",
  flex: 1,
  width: "100%",
  // Clips the full-width dividers without making a scroll box.
  overflowX: "clip",
});

export const frameColumnStyle = css({
  width: "100%",
  maxWidth: FRAME_WIDTH,
  margin: "0 auto",
  boxSizing: "border-box",
});

export const headerStyle = css({
  padding: "8rem 1.5rem 2.5rem",
  "@media (max-width: 640px)": {
    padding: "6.5rem 1rem 2rem",
  },
});

// A 1px line that runs to both screen edges.
export const dividerStyle = css({
  position: "relative",
  height: "1px",
  "::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "50%",
    width: "100vw",
    height: "1px",
    transform: "translateX(-50%)",
    backgroundColor: LINE,
  },
});

// The browser-default <hr>: a sunken groove.
export const hrStyle = css({
  height: 0,
  margin: "0.45rem 0",
  border: "none",
  borderTop: "1px solid #3a3a42",
  borderBottom: "1px solid #1c1c21",
});

export const linkStyle = css({
  color: LINK,
  textDecoration: "underline",
  textUnderlineOffset: "0.14em",
  textDecorationThickness: "1px",
  transition: "color 0.2s ease",
  ":visited": {
    color: VISITED,
  },
  ":hover": {
    color: LINK_HOVER,
  },
  ":focus-visible": {
    outline: `1px dotted ${LINK}`,
    outlineOffset: "2px",
  },
});

// The page body below a header that runs straight into the signature, with
// no bottom padding of its own.
export const articleStyle = css({
  paddingBottom: 0,
  "@media (max-width: 640px)": {
    paddingBottom: 0,
  },
});

// Plain document text, as a browser set it before stylesheets.
export const proseStyle = css({
  maxWidth: "40rem",
  fontFamily: SERIF,
  fontSize: "1.125rem",
  lineHeight: 1.55,
  color: "#d4d4dc",
  p: {
    margin: "0 0 1rem",
    fontWeight: 400,
    lineHeight: 1.55,
    color: "inherit",
  },
  strong: {
    fontWeight: 700,
    color: "#ffffff",
  },
  ul: {
    margin: 0,
    paddingLeft: "1.25rem",
  },
  li: {
    marginBottom: "0.25rem",
  },
  "li::marker": {
    color: MUTED,
  },
});

// A section heading in the default bold Times.
export const headingStyle = css({
  margin: "2rem 0 0.5rem",
  fontFamily: SERIF,
  fontSize: "1.375rem",
  fontWeight: 700,
  lineHeight: 1.2,
  color: "#ffffff",
});

// A raised grey form button with bevelled edges; pressed, the bevel flips.
export const buttonStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.45rem 1rem 0.5rem",
  fontFamily: 'Tahoma, Verdana, "Segoe UI", sans-serif',
  fontSize: "0.8125rem",
  lineHeight: 1.2,
  color: "#0d0e0f",
  backgroundColor: "#c6c6cc",
  textDecoration: "none",
  boxShadow:
    "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #7b7b82, inset 2px 2px #e4e4e8",
  svg: {
    width: "14px",
    height: "14px",
  },
  ":hover": {
    backgroundColor: "#d2d2d7",
  },
  ":active": {
    boxShadow:
      "inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #e4e4e8, inset 2px 2px #7b7b82",
    paddingTop: "0.5rem",
    paddingBottom: "0.45rem",
  },
  ":focus-visible": {
    outline: "1px dotted #0d0e0f",
    outlineOffset: "-5px",
  },
});

// ---------------------------------------------------------------------------
// Typing

// Each line is uncovered left to right in steps, like text being typed.
const typeIn = keyframes`
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
`;

const lineHiddenStyle = css({
  clipPath: "inset(0 100% 0 0)",
  "@media (prefers-reduced-motion: reduce)": {
    clipPath: "none",
  },
});

const lineTypedStyle = css({
  clipPath: "none",
  animation: `${typeIn} 0.5s steps(22, end) backwards`,
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
});

// Spread onto a line's css/style: hidden until `shown`, then typed in after
// the lines before it.
export function typed(shown: boolean, index: number, baseMs = 0) {
  return {
    css: shown ? lineTypedStyle : lineHiddenStyle,
    style: { animationDelay: `${baseMs + index * LINE_STEP_MS}ms` },
  };
}

// How many characters of `text` are typed so far.
export function useTyping(text: string) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (reducedMotion()) {
      setCount(text.length);
      return;
    }
    setCount(0);
    const id = window.setInterval(() => {
      setCount((n) => {
        if (n >= text.length) window.clearInterval(id);
        return Math.min(text.length, n + 1);
      });
    }, TITLE_CHAR_MS);
    return () => window.clearInterval(id);
  }, [text]);
  return count;
}

const titleStyle = css({
  margin: "0 0 1.75rem",
  fontFamily: SERIF,
  fontSize: "clamp(2rem, 6vw, 2.75rem)",
  fontWeight: 700,
  lineHeight: 1.1,
  color: "#ffffff",
});

const blink = keyframes`
  50% {
    opacity: 0;
  }
`;

const cursorStyle = css({
  display: "inline-block",
  width: "0.42em",
  height: "0.82em",
  marginLeft: "0.1em",
  verticalAlign: "-0.06em",
  backgroundColor: "#e6e6eb",
  animation: `${blink} 1.06s steps(1, end) infinite`,
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
});

// The page's <h1>, typed out a character at a time with a block cursor.
export function TypedTitle({
  text,
  count,
  className,
}: {
  text: string;
  count: number;
  className?: string;
}) {
  return (
    <h1 css={titleStyle} className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      <span css={cursorStyle} aria-hidden="true" />
    </h1>
  );
}

// ---------------------------------------------------------------------------
// Listing

// Set like Apache's autoindex page. Rows are grids with columns sized in ch,
// so the monospace text lines up the way the original <pre> did. Each page
// adds its own gridTemplateColumns.
export const listingStyle = css({
  fontFamily: MONO,
  fontSize: "0.8125rem",
  lineHeight: 1.7,
  color: DATA,
  "@media (max-width: 640px)": {
    fontSize: "0.75rem",
  },
});

export const listingRowStyle = css({
  display: "grid",
  columnGap: "2rem",
  "> span": {
    whiteSpace: "nowrap",
  },
  "> span:last-child": {
    whiteSpace: "normal",
  },
  // Cells marked "wide" drop out on narrow screens.
  "@media (max-width: 640px)": {
    columnGap: "1rem",
    ".wide": {
      display: "none",
    },
  },
});

export const listingHeadStyle = css({
  color: MUTED,
});

export const iconCellStyle = css({
  color: "#5c5c66",
});

// ---------------------------------------------------------------------------
// Links and signature

// Internal routes start with "/" and go through the same fade as the nav
// bar's links; anything else opens in a new tab.
export function SiteLink({
  href,
  children,
  tabIndex,
  ariaHidden,
  className,
}: {
  href: string;
  children: ReactNode;
  tabIndex?: number;
  ariaHidden?: boolean;
  className?: string;
}) {
  const transitionTo = usePageTransition();

  if (href.startsWith("/")) {
    const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
      const modified =
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
      if (modified) return;
      event.preventDefault();
      transitionTo(href);
    };
    return (
      <a
        className={className}
        href={href}
        onClick={onClick}
        tabIndex={tabIndex}
        aria-hidden={ariaHidden}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noreferrer"
      tabIndex={tabIndex}
      aria-hidden={ariaHidden}
    >
      {children}
    </a>
  );
}

const addressStyle = css({
  padding: "1.25rem 1.5rem 5rem",
  fontFamily: SERIF,
  fontSize: "0.95rem",
  fontStyle: "italic",
  color: MUTED,
  "@media (max-width: 640px)": {
    padding: "1.25rem 1rem 4rem",
  },
});

// The server signature Apache prints under a listing.
export function ServerSignature({ className }: { className?: string }) {
  return (
    <address css={[frameColumnStyle, addressStyle]} className={className}>
      cartesiancs/1.0 Server at cartesiancs.com Port 443
    </address>
  );
}
