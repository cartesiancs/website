/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import {
  type CSSProperties,
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowUp,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";
import { ShowcaseTile, usePlayInView } from "../features/showcase/ShowcaseTile";
import { SHOWCASE_VIDEOS } from "../features/showcase/videos";
import { docPath, DOCS_ROOT } from "../features/tutorial/manifest";

const DOWNLOAD_URL = "https://github.com/cartesiancs/cartcut/releases";
const REPO_URL = "https://github.com/cartesiancs/cartcut";
const DEMO_URL = "https://cartcut.cartesiancs.com/";
// Rewritten by the cartcut repo's mirror-r2 workflow on every release.
const LATEST_URL = "https://download.cartesiancs.com/cartcut/latest.json";
// Two by two; the rest of the showcase is on its own page.
const SHOWCASE_TILE_COUNT = 4;
// A stand-in until the agent editing demo is recorded.
const AGENT_VIDEO = {
  src: "/videos/r2-preview.mp4",
  poster: "/videos/r2.jpg",
};

type Download = { url: string; size: number };
type LatestRelease = {
  version: string;
  notesUrl: string;
  mac: { arm64?: Download; x64?: Download };
};

// Until the manifest answers, or if it never does, the buttons keep pointing at
// the GitHub releases page, so the download link always goes somewhere.
function useLatestRelease(): LatestRelease | null {
  const [latest, setLatest] = useState<LatestRelease | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch(LATEST_URL, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.version && data?.mac) setLatest(data);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return latest;
}

function formatSize(bytes: number) {
  return `${(bytes / 1e9).toFixed(1)} GB`;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// The body background set in App.css.
const PAGE_BG = "#0d0e0f";
const TEXT = "#f5f5f7";
const MUTED = "#86868b";
const SURFACE = "#1c1c1f";
const RAISED = "#27292c";
const HAIRLINE = "rgba(255, 255, 255, 0.1)";
// The blue of the wordmark's "cut", reused for links and focus rings.
const ACCENT = "#93b2f0";
const SCRIPT_FONT = '"Playball", "Snell Roundhand", cursive';

const CONTENT_WIDTH = 1160;
const GUTTER = "clamp(1.25rem, 5vw, 2.5rem)";
const SECTION_GAP = "clamp(7rem, 15vw, 14rem)";
// Where the content column starts, for rows that bleed past it to the right.
const COLUMN_EDGE = `max(${GUTTER}, calc((100% - ${CONTENT_WIDTH}px) / 2))`;
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

// Fires once, by default when the element's top clears the bottom eighth of
// the screen.
function useInView<T extends Element>(rootMargin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);
  return [ref, inView] as const;
}

const revealStyle = css({
  opacity: 0,
  transform: "translateY(2.5rem)",
  transition: `opacity 1s ${EASE_OUT}, transform 1.2s ${EASE_OUT}`,
  "&[data-shown='true']": {
    opacity: 1,
    transform: "none",
  },
  "@media (prefers-reduced-motion: reduce)": {
    opacity: 1,
    transform: "none",
    transition: "none",
  },
});

// Fades its children up the first time they scroll into view. Descendants can
// key their own entrance off it with a "[data-shown='true'] &" selector.
// With early, it starts the moment its top edge comes on screen.
function Reveal({
  children,
  className,
  delay = 0,
  early = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  early?: boolean;
}) {
  const [ref, shown] = useInView<HTMLDivElement>(early ? "0px" : undefined);
  return (
    <div
      ref={ref}
      css={revealStyle}
      className={className}
      data-shown={shown}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

const pageStyle = css({
  display: "flex",
  minHeight: "100%",
  width: "100%",
  flexDirection: "column",
  alignItems: "center",
});

const mainStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  paddingBottom: SECTION_GAP,
});

const sectionStyle = css({
  width: "100%",
  maxWidth: `calc(${CONTENT_WIDTH}px + 2 * ${GUTTER})`,
  marginTop: SECTION_GAP,
  paddingInline: GUTTER,
  boxSizing: "border-box",
});

const headingStyle = css({
  margin: 0,
  fontSize: "clamp(2.5rem, 6.4vw, 6rem)",
  fontWeight: 700,
  lineHeight: 1.05,
  letterSpacing: "-0.035em",
  textAlign: "center",
  textWrap: "balance",
  color: TEXT,
});

// Space between a section's heading block and what it introduces.
const headingGapStyle = css({
  marginBottom: "clamp(2.5rem, 6vw, 5.5rem)",
});

// Scales with the screen from a phone size, never under the 44px touch
// target, up to the desktop size at about 700px wide. At the small end both
// hero buttons still share one row on a 375px phone.
const pillStyle = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.45em",
  minHeight: "clamp(2.75rem, 2.2rem + 2.4vw, 3.25rem)",
  padding: "0 clamp(0.8rem, 0.2rem + 2.6vw, 1.65rem)",
  boxSizing: "border-box",
  borderRadius: "999px",
  fontSize: "clamp(0.84375rem, 0.69rem + 0.62vw, 1.0625rem)",
  fontWeight: 600,
  letterSpacing: "-0.01em",
  textDecoration: "none",
  whiteSpace: "nowrap",
  transition: `background-color 0.3s ease, transform 0.4s ${EASE_OUT}`,
  ":active": {
    transform: "scale(0.97)",
  },
  ":focus-visible": {
    outline: `2px solid ${ACCENT}`,
    outlineOffset: "3px",
  },
});

const pillPrimaryStyle = css({
  backgroundColor: "#ffffff",
  color: "#000000",
  ":hover": {
    backgroundColor: "#e3e3e8",
  },
});

const pillSecondaryStyle = css({
  backgroundColor: RAISED,
  color: TEXT,
  ":hover": {
    backgroundColor: "#34363a",
  },
});

// Sized with the label so it shrinks along with the button.
const pillIconStyle = css({
  display: "block",
  width: "1.18em",
  height: "1.18em",
  flexShrink: 0,
});

// A direct file link downloads in place; only the fallback, a page, opens a tab.
function DownloadButton({ download }: { download?: Download }) {
  return (
    <a
      css={[pillStyle, pillPrimaryStyle]}
      href={download?.url ?? DOWNLOAD_URL}
      {...(download ? {} : { target: "_blank", rel: "noreferrer" })}
    >
      <img css={pillIconStyle} src="/images/cartcut/apple.svg" alt="" />
      Download for macOS
    </a>
  );
}

const heroStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: `calc(1232px + 2 * ${GUTTER})`,
  padding: `clamp(8rem, 14vw, 12.5rem) ${GUTTER} 0`,
  boxSizing: "border-box",
  textAlign: "center",
});

const heroTitleStyle = css({
  margin: 0,
  fontFamily: SCRIPT_FONT,
  fontSize: "clamp(3rem, 6.4vw, 6rem)",
  fontWeight: 400,
  lineHeight: 1.2,
  textWrap: "balance",
  color: TEXT,
});

const heroActionsStyle = css({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "clamp(0.5rem, 2vw, 1rem)",
  marginTop: "clamp(1.75rem, 3vw, 2.5rem)",
});

const heroShotStyle = css({
  width: "100%",
  marginTop: "clamp(3rem, 6vw, 4.5rem)",
});

const heroShotFrameStyle = css({
  position: "relative",
});

const heroImageStyle = css({
  display: "block",
  width: "100%",
  height: "auto",
});

// Shown on hover. Keyboard focus on the button shows it too, and on touch
// screens, which cannot hover, a tap on the screenshot toggles it.
const SHOW_HERO_CTA =
  "[data-hero-frame]:focus-within &, [data-hero-frame][data-open='true'] &";
const SHOW_HERO_CTA_ON_HOVER = "[data-hero-frame]:hover &";

// Dims the screenshot around a centered button.
const heroOverlayStyle = css({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.62) 0%, rgba(0, 0, 0, 0.38) 55%, rgba(0, 0, 0, 0) 80%)",
  opacity: 0,
  pointerEvents: "none",
  transition: `opacity 0.45s ${EASE_OUT}`,
  [SHOW_HERO_CTA]: {
    opacity: 1,
    pointerEvents: "auto",
  },
  "@media (hover: hover)": {
    [SHOW_HERO_CTA_ON_HOVER]: {
      opacity: 1,
      pointerEvents: "auto",
    },
  },
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
});

const heroTutorialStyle = css({
  minHeight: "clamp(2.75rem, 2.3rem + 2.4vw, 3.5rem)",
  padding: "0 clamp(1.1rem, 0.6rem + 2.4vw, 2rem)",
  fontSize: "clamp(0.9375rem, 0.85rem + 0.5vw, 1.125rem)",
  boxShadow: "0 18px 50px rgba(0, 0, 0, 0.45)",
  transform: "scale(0.9)",
  transition: `background-color 0.3s ease, transform 0.5s ${EASE_OUT}`,
  [SHOW_HERO_CTA]: {
    transform: "scale(1)",
  },
  "@media (hover: hover)": {
    [SHOW_HERO_CTA_ON_HOVER]: {
      transform: "scale(1)",
    },
  },
  "@media (prefers-reduced-motion: reduce)": {
    transform: "none",
  },
});

function HeroShot() {
  const [open, setOpen] = useState(false);
  const toggleOnTouch = () => {
    if (window.matchMedia("(hover: none)").matches) setOpen((value) => !value);
  };

  return (
    <div
      data-hero-frame
      data-open={open}
      css={heroShotFrameStyle}
      onClick={toggleOnTouch}
    >
      <img
        css={heroImageStyle}
        src="/images/cartcut.webp"
        width={2950}
        height={1932}
        alt="The CartCut editor with a title over archive footage and a full timeline"
      />
      <div css={heroOverlayStyle}>
        <Link
          css={[pillStyle, pillPrimaryStyle, heroTutorialStyle]}
          to={DOCS_ROOT}
        >
          View Tutorial
        </Link>
      </div>
    </div>
  );
}

const flowHeadingStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.4em",
  whiteSpace: "nowrap",
});

// The arrow from the Figma draft, traced as two strokes so it can move: the
// head starts at the left edge and travels to the tip while the shaft extends
// behind it, kept in step by the same duration and easing.
const ARROW_TIP = 306.027;
const ARROW_MID = 44.1838;
const ARROW_START_TIP = 44;
const ARROW_TRAVEL = "0.85s cubic-bezier(0.65, 0, 0.25, 1) 0.1s";

const flowArrowStyle = css({
  display: "block",
  flex: "0 1 300px",
  minWidth: "1.25em",
  height: "auto",
  overflow: "visible",
});

const arrowShaftStyle = css({
  strokeDasharray: ARROW_TIP,
  strokeDashoffset: ARROW_TIP - ARROW_START_TIP,
  transition: `stroke-dashoffset ${ARROW_TRAVEL}`,
  "[data-shown='true'] &": {
    strokeDashoffset: 0,
  },
  "@media (prefers-reduced-motion: reduce)": {
    strokeDashoffset: 0,
    transition: "none",
  },
});

const arrowHeadStyle = css({
  transform: `translateX(${ARROW_START_TIP - ARROW_TIP}px)`,
  transition: `transform ${ARROW_TRAVEL}`,
  "[data-shown='true'] &": {
    transform: "none",
  },
  "@media (prefers-reduced-motion: reduce)": {
    transform: "none",
    transition: "none",
  },
});

function FlowArrow() {
  return (
    <svg
      css={flowArrowStyle}
      viewBox="0 0 312.027 88.3675"
      width="312.027"
      height="88.3675"
      fill="none"
      stroke="currentColor"
      strokeWidth={12}
      aria-hidden="true"
    >
      <path css={arrowShaftStyle} d={`M0 ${ARROW_MID}H${ARROW_TIP}`} />
      <path
        css={arrowHeadStyle}
        d={`M267.843 6L${ARROW_TIP} ${ARROW_MID}L267.843 82.3675`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const visuallyHiddenStyle = css({
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
});

const scatterCharStyle = css({
  opacity: 0,
  transition: "opacity 0.5s ease",
  "[data-shown='true'] &": {
    opacity: 1,
  },
  "@media (prefers-reduced-motion: reduce)": {
    opacity: 1,
    transition: "none",
  },
});

// A random place in line for each of count items: ranks[i] is when item i
// goes, from 0 to count - 1.
function randomRanks(count: number) {
  const order = Array.from({ length: count }, (_, index) => index);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const ranks: number[] = [];
  order.forEach((index, rank) => {
    ranks[index] = rank;
  });
  return ranks;
}

// Each letter fades in on its own, in a random order that is drawn anew every
// time the page loads, while the arrow travels toward it.
function ScatterWord({ word, start }: { word: string; start: number }) {
  const [delays] = useState(() =>
    randomRanks(word.length).map(
      (rank) => start + rank * 55 + Math.random() * 40,
    ),
  );

  return (
    <span>
      <span css={visuallyHiddenStyle}>{word}</span>
      <span aria-hidden="true">
        {[...word].map((char, index) => (
          <span
            key={index}
            css={scatterCharStyle}
            style={{ transitionDelay: `${delays[index]}ms` }}
          >
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}

// Every card is the same size; each screenshot is cropped to fit it.
const FLOW_CARD_WIDTH = "min(clamp(17.5rem, 30vw, 28rem), 82vw)";

const scrollerStyle = css({
  width: "100%",
  overflowX: "auto",
  overflowY: "hidden",
  overscrollBehaviorX: "contain",
  scrollSnapType: "x mandatory",
  scrollPaddingInline: COLUMN_EDGE,
  scrollbarWidth: "none",
  touchAction: "pan-x pan-y",
  "::-webkit-scrollbar": {
    display: "none",
  },
});

const trackStyle = css({
  display: "flex",
  gap: "clamp(1rem, 2vw, 1.5rem)",
  width: "max-content",
  margin: 0,
  padding: `0 ${COLUMN_EDGE}`,
  listStyle: "none",
});

const flowCardStyle = css({
  position: "relative",
  flex: "none",
  width: FLOW_CARD_WIDTH,
  aspectRatio: "11 / 10",
  overflow: "hidden",
  borderRadius: "clamp(20px, 2.4vw, 32px)",
  backgroundColor: SURFACE,
  scrollSnapAlign: "start",
  isolation: "isolate",
});

const flowLinkStyle = css({
  display: "block",
  height: "100%",
  textDecoration: "none",
  ":focus-visible": {
    outline: `2px solid ${ACCENT}`,
    outlineOffset: "-2px",
    borderRadius: "inherit",
  },
});

const flowImageStyle = css({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const flowCaptionStyle = css({
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  padding: "3.5rem 1.75rem 1.65rem",
  background:
    "linear-gradient(to top, rgba(12, 12, 14, 0.94) 30%, rgba(12, 12, 14, 0))",
});

const flowTitleStyle = css({
  display: "block",
  fontSize: "1.3125rem",
  fontWeight: 700,
  lineHeight: 1.2,
  letterSpacing: "-0.02em",
  color: TEXT,
});

const roundIconStyle = css({
  width: "18px",
  height: "18px",
});

const carouselNavStyle = css({
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.85rem",
  width: "100%",
  maxWidth: `calc(${CONTENT_WIDTH}px + 2 * ${GUTTER})`,
  margin: "1.75rem auto 0",
  paddingInline: GUTTER,
  boxSizing: "border-box",
});

const carouselButtonStyle = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "2.75rem",
  height: "2.75rem",
  padding: 0,
  border: "none",
  borderRadius: "50%",
  backgroundColor: RAISED,
  color: TEXT,
  cursor: "pointer",
  transition: "background-color 0.3s ease, opacity 0.3s ease",
  ":hover:not(:disabled)": {
    backgroundColor: "#34363a",
  },
  ":disabled": {
    opacity: 0.35,
    cursor: "default",
  },
  ":focus-visible": {
    outline: `2px solid ${ACCENT}`,
    outlineOffset: "3px",
  },
});

const FLOW_CARDS = [
  {
    title: "Freedom Cut Edit",
    image: "/images/cartcut/cut.png",
    focus: "left top",
    slug: "cutting-and-trimming",
  },
  {
    title: "Keyframes",
    image: "/images/cartcut/keyframe.png",
    focus: "center top",
    slug: "keyframes",
  },
  {
    title: "Effects & Transitions",
    image: "/images/cartcut/effects.png",
    focus: "center top",
    slug: "effects-and-transitions",
  },
  {
    title: "Templates",
    image: "/images/cartcut/templates.png",
    focus: "center",
    slug: "templates",
  },
];

// A row of cards that runs off the right edge of the screen, scrolled by swipe
// or by the arrow buttons beneath it.
function FlowCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const { scrollLeft, clientWidth, scrollWidth } = scroller;
    setEdges({
      start: scrollLeft <= 4,
      end: scrollLeft + clientWidth >= scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const page = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({
      left: direction * scroller.clientWidth * 0.6,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <>
      <div ref={scrollerRef} css={scrollerStyle} onScroll={measure}>
        <ul css={trackStyle}>
          {FLOW_CARDS.map(({ title, image, focus, slug }) => (
            <li key={title} css={flowCardStyle}>
              <Link css={flowLinkStyle} to={docPath(slug)}>
                <img
                  css={flowImageStyle}
                  style={{ objectPosition: focus }}
                  src={image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <span css={flowCaptionStyle}>
                  <span css={flowTitleStyle}>{title}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {!(edges.start && edges.end) && (
        <div css={carouselNavStyle}>
          <button
            type="button"
            css={carouselButtonStyle}
            aria-label="Previous"
            disabled={edges.start}
            onClick={() => page(-1)}
          >
            <ChevronLeft css={roundIconStyle} strokeWidth={2.25} />
          </button>
          <button
            type="button"
            css={carouselButtonStyle}
            aria-label="Next"
            disabled={edges.end}
            onClick={() => page(1)}
          >
            <ChevronRight css={roundIconStyle} strokeWidth={2.25} />
          </button>
        </div>
      )}
    </>
  );
}

const agentFrameStyle = css({
  position: "relative",
  overflow: "hidden",
  aspectRatio: "1160 / 633",
  borderRadius: "clamp(20px, 2.8vw, 36px)",
  backgroundColor: "#000000",
  isolation: "isolate",
  "@media (max-width: 640px)": {
    aspectRatio: "4 / 3",
  },
});

const agentVideoStyle = css({
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const promptBarStyle = css({
  position: "absolute",
  left: "50%",
  bottom: "clamp(1rem, 3vw, 2.25rem)",
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  width: "min(36rem, calc(100% - 2rem))",
  padding: "0.55rem 0.55rem 0.55rem 1.15rem",
  boxSizing: "border-box",
  borderRadius: "999px",
  border: "1px solid rgba(255, 255, 255, 0.14)",
  backgroundColor: "rgba(28, 28, 31, 0.62)",
  backdropFilter: "blur(24px) saturate(180%)",
  WebkitBackdropFilter: "blur(24px) saturate(180%)",
  boxShadow: "0 16px 48px rgba(0, 0, 0, 0.35)",
  transform: "translateX(-50%)",
});

const promptIconStyle = css({
  width: "20px",
  height: "20px",
  flexShrink: 0,
  color: ACCENT,
});

const promptTextStyle = css({
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  whiteSpace: "nowrap",
  fontSize: "clamp(0.9375rem, 1.6vw, 1.125rem)",
  fontWeight: 500,
  letterSpacing: "-0.01em",
  textAlign: "left",
  color: TEXT,
});

const blink = keyframes({
  "0%, 50%": { opacity: 1 },
  "50.01%, 100%": { opacity: 0 },
});

const caretStyle = css({
  display: "inline-block",
  width: "2px",
  height: "1.15em",
  marginLeft: "2px",
  verticalAlign: "-0.2em",
  backgroundColor: ACCENT,
  animation: `${blink} 1s step-end infinite`,
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
});

const sendStyle = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: "2.25rem",
  height: "2.25rem",
  borderRadius: "50%",
  backgroundColor: "#ffffff",
  color: "#000000",
});

// From the "What to ask for" list in the AI editing tutorial.
const AGENT_PROMPTS = [
  "Cut the silences out of this interview",
  "Add subtitles to the whole video",
  "Add a cross dissolve between every clip",
  "Trim the first 30 seconds",
];

// Types each line out, holds it, erases it, and moves on to the next. Reduced
// motion keeps the first line still.
function useTypewriter(lines: string[], active: boolean) {
  const [text, setText] = useState(lines[0]);
  useEffect(() => {
    if (!active || prefersReducedMotion()) return;
    let line = 0;
    let length = 0;
    let erasing = false;
    let timer: number;
    const tick = () => {
      const full = lines[line];
      length += erasing ? -1 : 1;
      setText(full.slice(0, length));
      if (!erasing && length === full.length) {
        erasing = true;
        timer = window.setTimeout(tick, 2200);
      } else if (erasing && length === 0) {
        erasing = false;
        line = (line + 1) % lines.length;
        timer = window.setTimeout(tick, 450);
      } else {
        timer = window.setTimeout(tick, erasing ? 18 : 40 + Math.random() * 45);
      }
    };
    setText("");
    timer = window.setTimeout(tick, 700);
    return () => window.clearTimeout(timer);
  }, [lines, active]);
  return text;
}

function PromptBar() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const text = useTypewriter(AGENT_PROMPTS, inView);
  return (
    <div ref={ref} css={promptBarStyle} aria-hidden="true">
      <Sparkles css={promptIconStyle} strokeWidth={1.75} />
      <span css={promptTextStyle}>
        {text}
        <span css={caretStyle} />
      </span>
      <span css={sendStyle}>
        <ArrowUp css={roundIconStyle} strokeWidth={2.5} />
      </span>
    </div>
  );
}

function AgentDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  usePlayInView(videoRef);
  return (
    <div css={agentFrameStyle}>
      <video
        ref={videoRef}
        css={agentVideoStyle}
        src={AGENT_VIDEO.src}
        poster={AGENT_VIDEO.poster}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
      />
      <PromptBar />
    </div>
  );
}

// The track is taller than the screen; while it scrolls past, the stage inside
// stays pinned and the scroll distance drives the words.
const slamTrackStyle = css({
  position: "relative",
  width: "100%",
  height: "400vh",
  marginTop: "clamp(2rem, 6vw, 5rem)",
  "@media (prefers-reduced-motion: reduce)": {
    height: "auto",
  },
});

const slamStageStyle = css({
  position: "sticky",
  top: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: ["100vh", "100svh"],
  paddingInline: GUTTER,
  boxSizing: "border-box",
  // Cards drift up past the top; the stage crops them.
  overflow: "hidden",
  // One card's side, shared by the grid and the scrim over it.
  "--tile": "min(14.5vw, 22.4vh, 220px)",
  "@media (max-width: 640px)": {
    "--tile": "min(26vw, 15vh)",
  },
  "@media (prefers-reduced-motion: reduce)": {
    position: "relative",
    height: "auto",
    minHeight: "100vh",
  },
});

// Above the cards.
const slamHeadingStyle = css({
  position: "relative",
  zIndex: 1,
});

// Five by three squares centered behind the words (three by five on phones),
// sized to fit the screen either way.
const slamGridStyle = css({
  position: "absolute",
  top: "50%",
  left: "50%",
  display: "grid",
  gridTemplateColumns: "repeat(5, var(--tile))",
  gridAutoRows: "var(--tile)",
  gap: "calc(var(--tile) * 0.177)",
  transform: "translate(-50%, -50%)",
  "@media (max-width: 640px)": {
    gridTemplateColumns: "repeat(3, var(--tile))",
  },
});

// Keeps the cards behind the words faint so the headline reads over them. It
// is a wash of the page color over the middle of the stage rather than a mask
// on the grid, so cards drifting out of the grid are never clipped. The
// ellipse spans the grid: about 5.7 by 3.4 cards, or 3.4 by 5.7 on phones.
const slamScrimStyle = css({
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(ellipse calc(var(--tile) * 2.97) calc(var(--tile) * 1.68) at center, rgba(13, 14, 15, 0.78) 40%, rgba(13, 14, 15, 0) 100%)",
  pointerEvents: "none",
  "@media (max-width: 640px)": {
    background:
      "radial-gradient(ellipse calc(var(--tile) * 1.74) calc(var(--tile) * 2.85) at center, rgba(13, 14, 15, 0.78) 40%, rgba(13, 14, 15, 0) 100%)",
  },
});

// Fade in one by one, in random order, along with the words' fill; fade out
// together if the reader scrolls back up.
const slamTileStyle = css({
  overflow: "hidden",
  borderRadius: "calc(var(--tile) * 0.19)",
  backgroundColor: RAISED,
  opacity: 0,
  transition: "opacity 0.6s ease",
  "[data-filled='true'] &": {
    opacity: 1,
    transitionDelay: "var(--delay)",
  },
  "@media (prefers-reduced-motion: reduce)": {
    opacity: 1,
    transition: "none",
  },
});

const slamTileImageStyle = css({
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

// Sample crops from the tutorial screenshots until the real artwork is in.
const SLAM_TILES = [
  "duotone",
  "fonts",
  "heart-mask",
  "luts",
  "title",
  "tools",
  "grade",
  "title-presets",
  "star-shape",
  "speed-ramp",
  "dissolve",
  "effects",
  "picture-in-picture",
  "color",
  "media",
].map((name) => `/images/cartcut/grid/${name}.webp`);

// Outlined while the words fade in; filled once the last one has settled. The
// stroke is painted under a fill in the page color: variable fonts keep
// overlapping contours, and a bare stroke would trace those inside the
// letters. Half the stroke shows, hence the doubled width.
const slamWordStyle = css({
  display: "inline-block",
  transformOrigin: "50% 55%",
  color: PAGE_BG,
  WebkitTextStroke: `0.032em ${TEXT}`,
  paintOrder: "stroke fill",
  transition: "color 0.9s ease",
  "[data-filled='true'] &": {
    color: TEXT,
  },
  "@media (prefers-reduced-motion: reduce)": {
    color: TEXT,
    transition: "none",
  },
});

// The stage already leaves half a screen below the words.
const afterStageStyle = css({
  marginTop: "clamp(2rem, 6vw, 5rem)",
});

const SLAM_WORDS = ["All", "in", "one", "Platform"];
const SLAM_FROM_SCALE = 1.15;
// Each word takes this share of the pinned scroll, starting a step after the
// one before; the last settles with room left to fill the words and bring in
// the cards before the stage moves on.
const SLAM_SPAN = 0.18;
const SLAM_STEP = 0.14;
// The moment the last word settles.
const SLAM_FILL_AT = (SLAM_WORDS.length - 1) * SLAM_STEP + SLAM_SPAN;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

// Where a word is at progress t through its own share of the scroll: it fades
// in slightly enlarged and eases down to its size.
function slamFrame(t: number) {
  const settle = 1 - (1 - t) ** 3;
  return {
    scale: SLAM_FROM_SCALE + (1 - SLAM_FROM_SCALE) * settle,
    opacity: clamp01(t / 0.6),
  };
}

// How far each column of cards lifts per pixel scrolled once they are in, so
// neighbours drift apart: some rise quickly, others barely. Phones show the
// first three.
const SLAM_COLUMN_LIFT = [0.05, 0.11, 0.025, 0.085, 0.06];

function SlamHeadline() {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [tileRanks] = useState(() => randomRanks(SLAM_TILES.length));

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const grid = gridRef.current;
    if (!track || !stage || !grid || prefersReducedMotion()) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const pinned = rect.height - stage.offsetHeight;
      const progress = pinned > 0 ? clamp01(-rect.top / pinned) : 1;
      wordRefs.current.forEach((word, index) => {
        if (!word) return;
        const { scale, opacity } = slamFrame(
          clamp01((progress - index * SLAM_STEP) / SLAM_SPAN),
        );
        word.style.transform = `scale(${scale})`;
        word.style.opacity = String(opacity);
      });
      stage.dataset.filled = String(progress >= SLAM_FILL_AT);

      // Counted from the moment the cards appear, so they arrive in the grid
      // and only then spread; it keeps counting as the stage scrolls away.
      const lifted = Math.max(0, -rect.top - SLAM_FILL_AT * pinned);
      const columns =
        getComputedStyle(grid).gridTemplateColumns.split(" ").length;
      tileRefs.current.forEach((tile, index) => {
        if (!tile) return;
        const rate = SLAM_COLUMN_LIFT[index % columns];
        tile.style.transform = `translate3d(0, ${-lifted * rate}px, 0)`;
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    // The page scrolls on <body>, whose scroll events only reach a capturing
    // listener.
    document.addEventListener("scroll", schedule, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section ref={trackRef} css={slamTrackStyle}>
      <div ref={stageRef} css={slamStageStyle}>
        <div ref={gridRef} css={slamGridStyle} aria-hidden="true">
          {SLAM_TILES.map((src, index) => (
            <div
              key={src}
              ref={(node) => {
                tileRefs.current[index] = node;
              }}
              css={slamTileStyle}
              style={
                { "--delay": `${tileRanks[index] * 35}ms` } as CSSProperties
              }
            >
              <img
                css={slamTileImageStyle}
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
        <div css={slamScrimStyle} aria-hidden="true" />
        <h2 css={[headingStyle, slamHeadingStyle]}>
          {SLAM_WORDS.map((word, index) => (
            <Fragment key={word}>
              {index > 0 && " "}
              <span
                ref={(node) => {
                  wordRefs.current[index] = node;
                }}
                css={slamWordStyle}
              >
                {word}
              </span>
            </Fragment>
          ))}
        </h2>
      </div>
    </section>
  );
}

const showcaseGridStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "clamp(2rem, 4vw, 3.5rem) clamp(1rem, 2.5vw, 2rem)",
  "@media (max-width: 640px)": {
    gridTemplateColumns: "minmax(0, 1fr)",
  },
});

const demoCardStyle = css({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  minHeight: "clamp(24rem, 36vw, 30rem)",
  padding: "clamp(2rem, 5.5vw, 4.5rem)",
  boxSizing: "border-box",
  overflow: "hidden",
  isolation: "isolate",
  borderRadius: "clamp(24px, 2.8vw, 36px)",
  border: `1px solid ${RAISED}`,
  textDecoration: "none",
  transition: "border-color 0.4s ease",
  ":hover": {
    borderColor: "#3a3c40",
    "& [data-demo-cta]": {
      backgroundColor: "#e3e3e8",
    },
    "& [data-demo-browser]": {
      transform: "translateY(-0.5rem)",
    },
  },
  ":focus-visible": {
    outline: `2px solid ${ACCENT}`,
    outlineOffset: "4px",
  },
  "@media (max-width: 760px)": {
    paddingBottom: 0,
  },
});

// Held to the left half so it never runs under the browser window.
const demoTitleStyle = css({
  maxWidth: "min(9em, 46%)",
  textWrap: "balance",
  margin: 0,
  fontSize: "clamp(2.25rem, 4.3vw, 4rem)",
  fontWeight: 700,
  lineHeight: 1.08,
  letterSpacing: "-0.035em",
  color: TEXT,
  "@media (max-width: 760px)": {
    maxWidth: "9em",
  },
});

const demoActionStyle = css({
  marginTop: "auto",
  paddingTop: "2.5rem",
});

// A browser window peeking in from the lower right, cropped by the card.
const browserStyle = css({
  position: "absolute",
  zIndex: -1,
  top: "clamp(3.5rem, 8vw, 6.5rem)",
  left: "54%",
  width: "64%",
  overflow: "hidden",
  borderRadius: "14px",
  border: `1px solid ${HAIRLINE}`,
  backgroundColor: "#1a1b1d",
  boxShadow: "0 30px 80px rgba(0, 0, 0, 0.5)",
  transition: `transform 0.8s ${EASE_OUT}`,
  "@media (max-width: 760px)": {
    position: "relative",
    top: 0,
    left: 0,
    width: "130%",
    marginTop: "2.5rem",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});

const browserBarStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "0.45rem",
  padding: "0.7rem 0.9rem",
  borderBottom: `1px solid ${HAIRLINE}`,
});

const browserDotStyle = css({
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  backgroundColor: "#3a3b3f",
});

const browserUrlStyle = css({
  marginLeft: "1rem",
  padding: "0.3rem 1rem",
  borderRadius: "8px",
  backgroundColor: "#26272a",
  fontSize: "0.8125rem",
  color: MUTED,
  whiteSpace: "nowrap",
});

const browserImageStyle = css({
  display: "block",
  width: "100%",
  height: "auto",
});

const statGridStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "clamp(1rem, 2.5vw, 2rem)",
  "@media (max-width: 760px)": {
    gridTemplateColumns: "minmax(0, 1fr)",
  },
});

const statCardStyle = css({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: "2.5rem",
  height: "100%",
  minHeight: "clamp(12rem, 21vw, 19.5rem)",
  padding: "clamp(1.75rem, 3.2vw, 3rem)",
  boxSizing: "border-box",
  borderRadius: "clamp(20px, 2.8vw, 36px)",
  backgroundColor: SURFACE,
});

const statValueStyle = css({
  margin: 0,
  fontSize: "clamp(3.25rem, 5vw, 4.75rem)",
  fontWeight: 600,
  lineHeight: 1,
  letterSpacing: "-0.04em",
  color: TEXT,
});

const statUnitStyle = css({
  marginLeft: "0.08em",
  fontSize: "0.5em",
  letterSpacing: "-0.02em",
});

const statLabelStyle = css({
  margin: 0,
  fontSize: "clamp(1.125rem, 1.7vw, 1.5rem)",
  fontWeight: 500,
  lineHeight: 1.3,
  letterSpacing: "-0.015em",
  color: MUTED,
});

const STATS = [
  { value: "8K", label: "Max resolution" },
  { value: "240", unit: "fps", label: "Max frame rate" },
  { value: "5K+", label: "Creators" },
];

const ultimateHeadingStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "0.22em",
  margin: 0,
  fontSize: "clamp(1.5rem, 7.2vw, 6rem)",
  fontWeight: 700,
  lineHeight: 1.2,
  letterSpacing: "-0.035em",
  color: TEXT,
});

const ultimateLineStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "0.28em",
  whiteSpace: "nowrap",
});

// The slot takes whatever width the words leave on the line.
const barSlotStyle = css({
  display: "flex",
  flex: "1 1 0",
  minWidth: "0.6em",
  height: "0.9em",
});

const barFillStyle = css({
  width: 0,
  height: "100%",
  backgroundColor: "#ffffff",
  transitionProperty: "width",
  "[data-shown='true'] &": {
    width: "100%",
  },
  "@media (prefers-reduced-motion: reduce)": {
    width: "100%",
    transition: "none",
  },
});

// Wiped in left to right with the same hard edge as the bar. The small
// negative insets keep descenders and the last glyph's overhang uncut.
const ultimateTextStyle = css({
  display: "inline-block",
  clipPath: "inset(-0.1em 100% -0.25em 0)",
  transitionProperty: "clip-path",
  "[data-shown='true'] &": {
    clipPath: "inset(-0.1em -0.05em -0.25em 0)",
  },
  "@media (prefers-reduced-motion: reduce)": {
    clipPath: "none",
    transition: "none",
  },
});

// Every line is drawn as one left-to-right stroke: whichever of the words and
// the bar comes first speeds up into the other, which then eases to a stop.
// Durations roughly follow each piece's width on a wide screen, so the stroke
// keeps a steady pace across the seam.
const ULTIMATE_LINES: {
  text: string;
  bar: "before" | "after";
  textMs: number;
  barMs: number;
}[] = [
  { text: "The Ultimate", bar: "after", textMs: 650, barMs: 800 },
  { text: "Video Editing Platform", bar: "before", textMs: 950, barMs: 380 },
  { text: "for Creators", bar: "before", textMs: 650, barMs: 700 },
];

const STROKE_START = "cubic-bezier(0.4, 0, 1, 1)";
const STROKE_END = "cubic-bezier(0.3, 0.6, 0.4, 1)";

// Timing for one piece of a line, given whether it leads the stroke.
function strokeTiming(
  lead: boolean,
  start: number,
  leadMs: number,
  ms: number,
) {
  return {
    transitionDuration: `${ms}ms`,
    transitionDelay: `${lead ? start : start + leadMs - 40}ms`,
    transitionTimingFunction: lead ? STROKE_START : STROKE_END,
  };
}

function UltimateLine({
  line,
  index,
}: {
  line: (typeof ULTIMATE_LINES)[number];
  index: number;
}) {
  const start = 300 + index * 220;
  const barLeads = line.bar === "before";
  const leadMs = barLeads ? line.barMs : line.textMs;
  const bar = (
    <span css={barSlotStyle} aria-hidden="true">
      <span
        css={barFillStyle}
        style={strokeTiming(barLeads, start, leadMs, line.barMs)}
      />
    </span>
  );
  return (
    <span css={ultimateLineStyle}>
      {barLeads && bar}
      <span
        css={ultimateTextStyle}
        style={strokeTiming(!barLeads, start, leadMs, line.textMs)}
      >
        {line.text}
      </span>
      {!barLeads && bar}
    </span>
  );
}

const finaleStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
});

const wordmarkStyle = css({
  margin: 0,
  fontFamily: SCRIPT_FONT,
  fontSize: "clamp(4.5rem, 8.5vw, 8rem)",
  fontWeight: 400,
  lineHeight: 1.15,
  color: TEXT,
});

const wordmarkCutStyle = css({
  color: ACCENT,
});

const finaleActionsStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "clamp(2rem, 4vw, 3rem)",
});

const downloadMetaStyle = css({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "0.25rem 1.25rem",
  margin: "1.1rem 0 0 0",
  fontSize: "0.9375rem",
  lineHeight: 1.5,
  fontWeight: 400,
  color: MUTED,
});

const metaLinkStyle = css({
  color: MUTED,
  textDecoration: "underline",
  textUnderlineOffset: "3px",
  textDecorationColor: "rgba(134, 134, 139, 0.4)",
  transition: "color 0.3s ease, text-decoration-color 0.3s ease",
  ":hover": {
    color: TEXT,
    textDecorationColor: TEXT,
  },
});

const faqSectionStyle = css({
  maxWidth: `calc(820px + 2 * ${GUTTER})`,
});

const faqHeadingStyle = css({
  margin: "0 0 clamp(2rem, 4vw, 3rem) 0",
  fontSize: "clamp(2rem, 4vw, 3rem)",
  fontWeight: 700,
  letterSpacing: "-0.03em",
  textAlign: "center",
  color: TEXT,
});

const faqItemStyle = css({
  borderBottom: `1px solid ${HAIRLINE}`,
  ":first-of-type": {
    borderTop: `1px solid ${HAIRLINE}`,
  },
});

const faqQuestionStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1.5rem",
  width: "100%",
  padding: "1.6rem 0",
  border: "none",
  background: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "clamp(1.125rem, 1.8vw, 1.3125rem)",
  fontWeight: 600,
  letterSpacing: "-0.015em",
  textAlign: "left",
  color: TEXT,
  ":focus-visible": {
    outline: `2px solid ${ACCENT}`,
    outlineOffset: "2px",
    borderRadius: "6px",
  },
});

const faqIconStyle = css({
  width: "22px",
  height: "22px",
  flexShrink: 0,
  color: MUTED,
  transition: `transform 0.4s ${EASE_OUT}, color 0.3s ease`,
});

const faqIconOpenStyle = css({
  transform: "rotate(45deg)",
  color: TEXT,
});

// grid-template-rows 0fr -> 1fr animates the answer without a fixed height.
const faqAnswerWrapStyle = css({
  display: "grid",
  gridTemplateRows: "0fr",
  transition: `grid-template-rows 0.45s ${EASE_OUT}`,
});

const faqAnswerWrapOpenStyle = css({
  gridTemplateRows: "1fr",
});

const faqAnswerStyle = css({
  overflow: "hidden",
});

const faqAnswerTextStyle = css({
  margin: 0,
  paddingBottom: "1.75rem",
  paddingRight: "3rem",
  fontSize: "1.0625rem",
  lineHeight: 1.6,
  fontWeight: 400,
  color: MUTED,
});

const linkStyle = css({
  color: TEXT,
  textDecoration: "underline",
  textUnderlineOffset: "3px",
  textDecorationColor: "rgb(70, 70, 80)",
  transition: "text-decoration-color 0.3s ease",
  ":hover": {
    textDecorationColor: TEXT,
  },
});

const FAQ_ITEMS = [
  {
    question: "What is Cartcut?",
    answer:
      "An open-source video editing software built for creators who want professional editing without giving up ownership of their tools.",
  },
  {
    question: "Is it hard to learn?",
    answer:
      "There is a slight learning curve, as with any professional-grade editing software. If you have used a timeline editor before, you will be at home quickly.",
  },
  {
    question: "Is it really free?",
    answer:
      "Yes, it is completely free. There are no watermarks, and it operates entirely as a community-driven project.",
  },
  {
    question: "How do I contribute?",
    answer: (
      <>
        Open an issue or a pull request on{" "}
        <a css={linkStyle} href={REPO_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
        . Bug reports and feature requests are as welcome as code.
      </>
    ),
  },
];

export function CartCut() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const latest = useLatestRelease();
  const macDownload = latest?.mac.arm64;

  return (
    <div css={pageStyle}>
      <TopNavBar />

      <main css={mainStyle}>
        <header css={heroStyle}>
          <Reveal>
            <h1 css={heroTitleStyle}>Open Source Video Editor</h1>
          </Reveal>
          <Reveal delay={120} css={heroActionsStyle}>
            <DownloadButton download={macDownload} />
            <a
              css={[pillStyle, pillSecondaryStyle]}
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
            >
              <img
                css={pillIconStyle}
                src="/images/cartcut/github.svg"
                alt=""
              />
              View on GitHub
            </a>
          </Reveal>
          <Reveal delay={260} css={heroShotStyle}>
            <HeroShot />
          </Reveal>
        </header>

        <section css={[sectionStyle, headingGapStyle]}>
          <Reveal early>
            <h2 css={[headingStyle, flowHeadingStyle]}>
              <span>Cut</span>
              <span css={visuallyHiddenStyle}> to </span>
              <FlowArrow />
              <ScatterWord word="Keyframe" start={300} />
            </h2>
          </Reveal>
        </section>
        <Reveal delay={120} css={{ width: "100%" }}>
          <FlowCarousel />
        </Reveal>

        <section css={sectionStyle}>
          <Reveal css={headingGapStyle}>
            <h2 css={headingStyle}>AI Agent Edit</h2>
          </Reveal>
          <Reveal delay={120}>
            <AgentDemo />
          </Reveal>
        </section>

        <section css={sectionStyle}>
          <Reveal css={headingGapStyle}>
            <h2 css={headingStyle}>Made with CartCut</h2>
          </Reveal>
          <div css={showcaseGridStyle}>
            {SHOWCASE_VIDEOS.filter((video) => video.featured)
              .slice(0, SHOWCASE_TILE_COUNT)
              .map((video, index) => (
                <Reveal key={video.id} delay={(index % 2) * 120}>
                  <ShowcaseTile video={video} />
                </Reveal>
              ))}
          </div>
        </section>

        <SlamHeadline />

        <section css={[sectionStyle, afterStageStyle]}>
          <Reveal>
            <a
              css={demoCardStyle}
              href={DEMO_URL}
              target="_blank"
              rel="noreferrer"
            >
              <h2 css={demoTitleStyle}>Try CartCut in your browser</h2>
              <div css={demoActionStyle}>
                <span data-demo-cta css={[pillStyle, pillPrimaryStyle]}>
                  Open the demo
                  <ArrowUpRight css={pillIconStyle} strokeWidth={2.25} />
                </span>
              </div>
              <div data-demo-browser css={browserStyle} aria-hidden="true">
                <div css={browserBarStyle}>
                  <span css={browserDotStyle} />
                  <span css={browserDotStyle} />
                  <span css={browserDotStyle} />
                  <span css={browserUrlStyle}>cartcut.cartesiancs.com</span>
                </div>
                <img
                  css={browserImageStyle}
                  src="/images/cartcut/demo.webp"
                  width={1800}
                  height={1125}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </a>
          </Reveal>
        </section>

        <section css={sectionStyle}>
          <Reveal css={headingGapStyle}>
            <h2 css={headingStyle}>Design for Freedom</h2>
          </Reveal>
          <div css={statGridStyle}>
            {STATS.map(({ value, unit, label }, index) => (
              <Reveal key={label} delay={index * 120}>
                <div css={statCardStyle}>
                  <p css={statValueStyle}>
                    {value}
                    {unit && <span css={statUnitStyle}>{unit}</span>}
                  </p>
                  <p css={statLabelStyle}>{label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section css={sectionStyle}>
          <Reveal>
            <h2 css={ultimateHeadingStyle}>
              {ULTIMATE_LINES.map((line, index) => (
                <UltimateLine key={line.text} line={line} index={index} />
              ))}
            </h2>
          </Reveal>
        </section>

        <section css={[sectionStyle, finaleStyle]}>
          <Reveal>
            <p css={wordmarkStyle}>
              cart<span css={wordmarkCutStyle}>cut</span>
            </p>
          </Reveal>
          <Reveal delay={120} css={finaleActionsStyle}>
            <DownloadButton download={macDownload} />
            {latest && macDownload && (
              <p css={downloadMetaStyle}>
                <span>
                  v{latest.version} for Apple Silicon,{" "}
                  {formatSize(macDownload.size)}
                </span>
                {latest.mac.x64 && (
                  <a css={metaLinkStyle} href={latest.mac.x64.url}>
                    Intel Mac
                  </a>
                )}
                <a
                  css={metaLinkStyle}
                  href={latest.notesUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Release notes
                </a>
              </p>
            )}
          </Reveal>
        </section>

        <section css={[sectionStyle, faqSectionStyle]}>
          <Reveal>
            <h2 css={faqHeadingStyle}>Questions</h2>
          </Reveal>
          <Reveal delay={120}>
            {FAQ_ITEMS.map((item, index) => {
              const open = openIndex === index;
              return (
                <div key={item.question} css={faqItemStyle}>
                  <button
                    type="button"
                    css={faqQuestionStyle}
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? null : index)}
                  >
                    {item.question}
                    <Plus
                      css={[faqIconStyle, open && faqIconOpenStyle]}
                      strokeWidth={2}
                    />
                  </button>
                  <div
                    css={[faqAnswerWrapStyle, open && faqAnswerWrapOpenStyle]}
                  >
                    <div css={faqAnswerStyle}>
                      <p css={faqAnswerTextStyle}>{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
