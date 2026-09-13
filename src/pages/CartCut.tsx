/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  ReactNode,
  PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronDown, Github, Layers, Puzzle, Sparkles } from "lucide-react";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";

const DOWNLOAD_URL = "https://github.com/cartesiancs/cartcut/releases";
const REPO_URL = "https://github.com/cartesiancs/cartcut";
// Rewritten by the cartcut repo's mirror-r2 workflow on every release.
const LATEST_URL = "https://download.cartesiancs.com/cartcut/latest.json";

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

const pageStyle = css({
  display: "flex",
  minHeight: "100%",
  width: "100%",
  flexDirection: "column",
  alignItems: "center",
});

const contentStyle = css({
  width: "100%",
  maxWidth: "720px",
  padding: "6rem 2rem 8rem 2rem",
  boxSizing: "border-box",
  "@media (max-width: 640px)": {
    padding: "7rem 1.5rem 6rem 1.5rem",
  },
});

const logoStyle = css({
  display: "block",
  width: "100%",
  maxWidth: "320px",
  height: "auto",
  marginTop: "2.5rem",
  marginBottom: "3rem",
});

const leadStyle = css({
  marginTop: "1.25rem",
  marginBottom: 0,
  fontSize: "1rem",
  lineHeight: 1.7,
  color: "#e6e6eb",
  fontWeight: 200,
});

const actionsStyle = css({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: "0.75rem",
  marginTop: "2rem",
});

const buttonBaseStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.55rem",
  padding: "0.7rem 1.2rem",
  borderRadius: "8px",
  fontSize: "0.9rem",
  fontWeight: 500,
  textDecoration: "none",
  border: "1px solid transparent",
  transition:
    "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease",
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

const downloadMetaStyle = css({
  margin: "0.9rem 0 0 0",
  fontSize: "0.85rem",
  lineHeight: 1.6,
  color: "#8a8a8f",
  fontWeight: 200,
});

const buttonIconStyle = css({
  width: "18px",
  height: "18px",
  flexShrink: 0,
});

const sectionTitleStyle = css({
  margin: "3.5rem 0 0 0",
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#8a8a8f",
});

const itemListStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "1.75rem",
  marginTop: "6rem",
});

// Covers the viewport so icons can fly into the side gutters, and clips them at
// the screen edge so they never widen the page.
const sprayLayerStyle = css({
  position: "fixed",
  inset: 0,
  zIndex: 10,
  overflow: "hidden",
  pointerEvents: "none",
});

const sprayIconStyle = css({
  position: "absolute",
  top: 0,
  left: 0,
  opacity: 0,
  willChange: "transform, opacity",
});

const itemTitleStyle = css({
  margin: 0,
  fontSize: "1.05rem",
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

const videoStyle = css({
  display: "block",
  width: "100%",
  aspectRatio: "16 / 9",
  marginTop: "6rem",
  borderRadius: "12px",
  "@media (max-width: 640px)": {
    marginTop: "4rem",
  },
});

const cardGridStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "1rem",
  marginTop: "6rem",
  "@media (max-width: 640px)": {
    gridTemplateColumns: "minmax(0, 1fr)",
    marginTop: "4rem",
  },
});

const cardStyle = css({
  position: "relative",
  isolation: "isolate",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "1.5rem",
  borderRadius: "12px",
  border: "1px solid rgb(36, 36, 43)",
  transition: "border-color 0.3s ease, background-color 0.3s ease",
  ":hover": {
    borderColor: "rgb(70, 70, 80)",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    "& > img": {
      opacity: 1,
    },
  },
});

// Sits behind the card content; the mask fades the top out so the title and
// text stay readable over the screenshot.
const cardImageStyle = css({
  position: "absolute",
  inset: 0,
  zIndex: -1,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: 0,
  transition: "opacity 0.5s ease",
  maskImage: "linear-gradient(to bottom, transparent 10%, #000 100%)",
  pointerEvents: "none",
});

const cardIconWrapStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  color: "#ffffff",
  marginBottom: "1.25rem",
});

const cardIconStyle = css({
  width: "18px",
  height: "18px",
  strokeWidth: 1.5,
});

const cardTitleStyle = css({
  margin: 0,
  fontSize: "1rem",
  fontWeight: 500,
  letterSpacing: "-0.01em",
  color: "#ffffff",
});

const cardTextStyle = css({
  margin: "0.6rem 0 0 0",
  fontSize: "0.9rem",
  lineHeight: 1.65,
  color: "#8a8a8f",
  fontWeight: 200,
});

const quoteStyle = css({
  margin: "6rem 0 0 0",
  paddingLeft: "1.25rem",
  borderLeft: "1px solid rgb(36, 36, 43)",
  fontSize: "1rem",
  lineHeight: 1.7,
  color: "#e6e6eb",
  fontWeight: 200,
});

const quoteNameStyle = css({
  display: "block",
  marginTop: "0.75rem",
  fontSize: "0.85rem",
  color: "#8a8a8f",
});

const faqListStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  marginTop: "6rem",
  "@media (max-width: 640px)": {
    marginTop: "4rem",
  },
});

const faqItemStyle = css({
  padding: "0 1.5rem",
  borderRadius: "12px",
  border: "1px solid rgb(36, 36, 43)",
  transition: "border-color 0.3s ease, background-color 0.3s ease",
  ":hover": {
    borderColor: "rgb(70, 70, 80)",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
});

const faqQuestionStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  width: "100%",
  padding: "1.35rem 0",
  background: "none",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "1rem",
  fontWeight: 400,
  letterSpacing: "-0.01em",
  color: "#e6e6eb",
  transition: "color 0.3s ease",
  ":hover": {
    color: "#ffffff",
  },
});

const faqChevronStyle = css({
  width: "18px",
  height: "18px",
  flexShrink: 0,
  color: "#8a8a8f",
  transition: "transform 0.3s ease",
});

const faqChevronOpenStyle = css({
  transform: "rotate(180deg)",
  color: "#ffffff",
});

// grid-template-rows 0fr -> 1fr animates the answer without a fixed height.
const faqAnswerWrapStyle = css({
  display: "grid",
  gridTemplateRows: "0fr",
  transition: "grid-template-rows 0.3s ease",
});

const faqAnswerWrapOpenStyle = css({
  gridTemplateRows: "1fr",
});

const faqAnswerStyle = css({
  overflow: "hidden",
});

const faqAnswerTextStyle = css({
  margin: 0,
  paddingBottom: "1.25rem",
  paddingRight: "2rem",
  fontSize: "0.95rem",
  lineHeight: 1.7,
  color: "#8a8a8f",
  fontWeight: 200,
});

const linkStyle = css({
  color: "#ffffff",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
  textDecorationColor: "rgb(70, 70, 80)",
  transition: "text-decoration-color 0.3s ease",
  ":hover": {
    textDecorationColor: "#ffffff",
  },
});

// lucide-react ships a fruit for "apple", so the platform mark is inline.
function AppleIcon() {
  return (
    <svg
      css={buttonIconStyle}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.36 12.72c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.83-.81-3-.79-1.55.02-2.98.9-3.77 2.28-1.61 2.79-.41 6.92 1.15 9.19.77 1.11 1.68 2.35 2.87 2.31 1.15-.05 1.59-.74 2.98-.74 1.39 0 1.78.74 3 .72 1.24-.02 2.02-1.13 2.78-2.24.87-1.28 1.23-2.53 1.25-2.6-.03-.01-2.4-.92-2.42-3.7zM14.1 5.98c.63-.77 1.06-1.83.94-2.89-.91.04-2.01.61-2.67 1.37-.59.68-1.1 1.76-.96 2.8 1.01.08 2.05-.51 2.69-1.28z" />
    </svg>
  );
}

const SPRAY_COLORS = ["#ffffff", "#e6e6eb", "#bfbfc7", "#8a8a8f"];
const SPRAY_FRAMES = 24;
const SPRAY_INTERVAL_MS = 50;
const SPRAY_BURST = 6;
// Below this much side gutter (phones, narrow windows) there is nowhere to fly.
const SPRAY_MIN_REACH = 80;
const SPRAY_MAX_PARTICLES = 120;

type SprayParticle = {
  id: number;
  size: number;
  color: string;
  duration: number;
  keyframes: Keyframe[];
};

function random(min: number, max: number) {
  return min + Math.random() * (max - min);
}

// Fast at launch, coasting to a stop at progress 1, like motion under drag.
function drag(progress: number, strength: number) {
  return (1 - Math.exp(-strength * progress)) / (1 - Math.exp(-strength));
}

function createSprayParticle(
  id: number,
  originX: number,
  originY: number,
  direction: -1 | 1,
  reach: number,
): SprayParticle {
  const size = random(14, 30);
  const distance = random(0.35, 1) * reach;
  const rise = Math.tan(random(-0.6, 0.6)) * distance;
  const gravity = random(20, 70);
  const spin = direction * random(360, 900);
  // Half the diagonal clears the item even mid-turn, so no icon covers the text.
  const startX = originX + direction * (size * 0.75 + 8);

  // Sampled in JS because the path mixes drag, gravity, and spin, which no
  // single CSS easing curve can describe.
  const keyframes = Array.from({ length: SPRAY_FRAMES + 1 }, (_, frame) => {
    const progress = frame / SPRAY_FRAMES;
    const travel = drag(progress, 3);
    const x = startX + direction * distance * travel - size / 2;
    const y = originY + rise * travel + gravity * progress ** 2 - size / 2;
    const rotate = spin * drag(progress, 1.5);
    const scale = 0.4 + 0.6 * Math.min(progress / 0.2, 1);
    const opacity = Math.min(progress / 0.08, (1 - progress) / 0.35, 1);
    return {
      offset: progress,
      opacity,
      transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`,
    };
  });

  return {
    id,
    size,
    color: SPRAY_COLORS[Math.floor(Math.random() * SPRAY_COLORS.length)],
    duration: random(900, 1500),
    keyframes,
  };
}

function SprayIcon({
  particle,
  onDone,
}: {
  particle: SprayParticle;
  onDone: (id: number) => void;
}) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const animation = ref.current?.animate(particle.keyframes, {
      duration: particle.duration,
    });
    if (!animation) return;
    animation.onfinish = () => onDone(particle.id);
    return () => animation.cancel();
  }, [particle, onDone]);

  return (
    <Github
      ref={ref}
      css={sprayIconStyle}
      size={particle.size}
      strokeWidth={1.5}
      color={particle.color}
    />
  );
}

// Hovering the wrapped area sprays spinning GitHub marks out of both sides into
// the empty gutters beside the content column.
function GithubSpray({ children }: { children: ReactNode }) {
  const areaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number>();
  const nextIdRef = useRef(0);
  const [particles, setParticles] = useState<SprayParticle[]>([]);

  const spray = useCallback((perSide: number) => {
    const area = areaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const sides = [
      { direction: -1 as const, originX: rect.left, reach: rect.left },
      {
        direction: 1 as const,
        originX: rect.right,
        reach: viewportWidth - rect.right,
      },
    ];

    const born: SprayParticle[] = [];
    for (const side of sides) {
      if (side.reach < SPRAY_MIN_REACH) continue;
      for (let i = 0; i < perSide; i++) {
        born.push(
          createSprayParticle(
            nextIdRef.current++,
            side.originX,
            random(rect.top, rect.bottom),
            side.direction,
            side.reach,
          ),
        );
      }
    }
    if (born.length === 0) return;
    setParticles((prev) => [...prev, ...born].slice(-SPRAY_MAX_PARTICLES));
  }, []);

  const stop = useCallback(() => {
    window.clearInterval(timerRef.current);
    timerRef.current = undefined;
  }, []);

  const start = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    stop();
    spray(SPRAY_BURST);
    timerRef.current = window.setInterval(() => spray(1), SPRAY_INTERVAL_MS);
  };

  const remove = useCallback((id: number) => {
    setParticles((prev) => prev.filter((particle) => particle.id !== id));
  }, []);

  useEffect(() => stop, [stop]);

  return (
    <div ref={areaRef} onPointerEnter={start} onPointerLeave={stop}>
      {children}
      {particles.length > 0 && (
        <div css={sprayLayerStyle} aria-hidden="true">
          {particles.map((particle) => (
            <SprayIcon key={particle.id} particle={particle} onDone={remove} />
          ))}
        </div>
      )}
    </div>
  );
}

const FEATURES = [
  {
    icon: Layers,
    title: "Unlimited timeline",
    text: "Stack video, audio, text, and images across an unlimited number of layers, as far as the edit needs to go.",
    image: "/cc-timeline.jpg",
  },
  {
    icon: Sparkles,
    title: "Advanced motion",
    text: "Keyframes, easing, and transforms live in the timeline itself, so motion you would look for in After Effects stays one tool away.",
    image: "/cc-motion.jpg",
  },
  {
    icon: Puzzle,
    title: "External extensions",
    text: "The editor is built to be extended, so a missing capability is something you can write rather than wait for.",
    image: "/cc-ext.jpg",
  },
];

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

      <div css={contentStyle}>
        <img css={logoStyle} src="/cartcut.png" alt="CartCut" />

        <p css={leadStyle}>
          <b>Open Source Video Editor.</b> It is aimed at protecting the freedom
          of creation and the rights of the creators. No subscription, no
          watermark, no account. You download it, you own it, and the source is
          yours to read and change.
        </p>

        <div css={actionsStyle}>
          {/* A direct file link downloads in place; only the fallback, a
              page, opens a tab. */}
          <a
            css={[buttonBaseStyle, primaryButtonStyle]}
            href={macDownload?.url ?? DOWNLOAD_URL}
            {...(macDownload ? {} : { target: "_blank", rel: "noreferrer" })}
          >
            <AppleIcon />
            Download for macOS
          </a>
          <a
            css={[buttonBaseStyle, secondaryButtonStyle]}
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
          >
            <Github css={buttonIconStyle} />
            View on GitHub
          </a>
        </div>

        {latest && macDownload && (
          <p css={downloadMetaStyle}>
            v{latest.version} for Apple Silicon, {formatSize(macDownload.size)}
            {latest.mac.x64 && (
              <>
                {" · "}
                <a css={linkStyle} href={latest.mac.x64.url}>
                  Intel Mac
                </a>
              </>
            )}
            {" · "}
            <a
              css={linkStyle}
              href={latest.notesUrl}
              target="_blank"
              rel="noreferrer"
            >
              Release notes
            </a>
          </p>
        )}

        <iframe
          css={videoStyle}
          src="https://www.youtube.com/embed/AFZVSosNOUw?si=QTgA76zITTZGxTJV"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>

        <div css={cardGridStyle}>
          {FEATURES.map(({ icon: Icon, title, text, image }) => (
            <div key={title} css={cardStyle}>
              <img css={cardImageStyle} src={image} alt="" loading="lazy" />
              <span css={cardIconWrapStyle}>
                <Icon css={cardIconStyle} />
              </span>
              <h3 css={cardTitleStyle}>{title}</h3>
              <p css={cardTextStyle}>{text}</p>
            </div>
          ))}
        </div>

        <div css={itemListStyle}>
          <GithubSpray>
            <h3 css={itemTitleStyle}>Open source</h3>
            <p css={itemTextStyle}>
              The whole editor is public. Read it, fork it, ship a patch, or run
              your own build.
            </p>
          </GithubSpray>
          <div>
            <h3 css={itemTitleStyle}>Easy editing</h3>
            <p css={itemTextStyle}>
              An easy yet free style of editing. The basics are where you expect
              them, and nothing is locked behind a plan.
            </p>
          </div>
          <div>
            <h3 css={itemTitleStyle}>Lightweight</h3>
            <p css={itemTextStyle}>
              A familiar and lightweight editor for smooth editing without
              stumbling. It starts fast and stays out of the way.
            </p>
          </div>
          <div>
            <h3 css={itemTitleStyle}>And more</h3>
            <p css={itemTextStyle}>
              Features keep arriving through open-source contribution. What the
              community needs is what gets built next.
            </p>
          </div>
        </div>

        <blockquote css={quoteStyle}>
          I made this because I was pissed off that the free editing program
          started charging for its services.
          <span css={quoteNameStyle}>H. Jun Huh @ cartesiancs</span>
        </blockquote>

        <div css={faqListStyle}>
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
                  <ChevronDown
                    css={[faqChevronStyle, open && faqChevronOpenStyle]}
                  />
                </button>
                <div css={[faqAnswerWrapStyle, open && faqAnswerWrapOpenStyle]}>
                  <div css={faqAnswerStyle}>
                    <p css={faqAnswerTextStyle}>{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
