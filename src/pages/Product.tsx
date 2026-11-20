/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";
import { FRAME_WIDTH, FrameLines } from "../components/FrameLines";
import { AsciiMedia, type AsciiSource } from "../components/AsciiMedia";
import { usePageTransition } from "../components/PageTransition";

// The page is dressed as an early web directory listing: Times headings,
// monospace data, underlined blue links, with the products drawn in ASCII.
const SERIF = '"Times New Roman", Times, serif';
const MONO =
  'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';

const LINE = "rgba(255, 255, 255, 0.1)";
const MUTED = "#8a8a8f";
const DATA = "#c4c4cc";
// The browser-default link blue and visited purple, lifted to read on the
// dark page.
const LINK = "#7aa7ff";
const LINK_HOVER = "#a9c6ff";
const VISITED = "#b39dff";

const TITLE = "Index of /products";
const TITLE_CHAR_MS = 40;
// Time between one typed line starting and the next.
const LINE_STEP_MS = 90;
// When the listing under the title is mostly typed in. The first product
// waits for it, so the page writes itself top to bottom.
const INTRO_MS = TITLE.length * TITLE_CHAR_MS + 4 * LINE_STEP_MS;

// Entries already on screen when the page opens start one after another.
const ENTRY_STAGGER_MS = 250;

// Same size as the About hero's image column.
const MEDIA_WIDTH = 568;
const MEDIA_ASPECT = 1.6;

type ProductItem = {
  // The entry's anchor on this page.
  slug: string;
  name: string;
  // Internal routes start with "/"; anything else opens in a new tab.
  href: string;
  // owner/name on GitHub; also where "Last modified" comes from.
  repo: string;
  // The listing's description column.
  summary: string;
  description: string;
  language: string;
  license: string;
  media: AsciiSource;
};

const PRODUCTS: ProductItem[] = [
  {
    slug: "landlink",
    name: "landlink.sh",
    href: "https://landlink.sh/",
    repo: "cartesiancs/landlink",
    summary: "Off-grid communication device",
    description: "Off-grid communication device. Build your own base station.",
    language: "C++",
    license: "Apache-2.0",
    media: { src: "/v-landlink.mp4", kind: "video", levels: [0.1, 0.85] },
  },
  {
    slug: "cartcut",
    name: "CartCut",
    href: "/cartcut",
    repo: "cartesiancs/cartcut",
    summary: "Video editor for AI agents",
    description:
      "Video editor for AI agents, built on the belief that open source can beat commercial tools.",
    language: "TypeScript",
    license: "MIT",
    // An edit made in CartCut, from the showcase.
    media: {
      src: "/videos/r1-preview.mp4",
      kind: "video",
      invert: "auto",
      levels: [0.08, 0.9],
    },
  },
  {
    slug: "map3d",
    name: "map3d",
    href: "https://github.com/cartesiancs/map3d",
    repo: "cartesiancs/map3d",
    summary: "3D city map generator",
    description:
      "Generates 3D city maps with React Three Fiber, including building and road information.",
    language: "TypeScript",
    license: "MIT",
    media: {
      src: "/i-map3d.webp",
      kind: "image",
      invert: true,
      levels: [0.12, 0.42],
      // Closer in on the dense blocks, so buildings read as shapes.
      zoom: 2,
      focus: [0.5, 0.5],
    },
  },
];

// ---------------------------------------------------------------------------
// Last modified dates

const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
const pad = (n: number) => String(n).padStart(2, "0");

// Apache's listing format, e.g. "19-Nov-2026 12:38" (UTC).
function formatModified(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return `${pad(d.getUTCDate())}-${MONTHS[d.getUTCMonth()]}-${d.getUTCFullYear()} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

// Each repository's last push, fetched once per page load from GitHub's
// public API. Null until it arrives, and if the request fails.
const modifiedRequests = new Map<string, Promise<string | null>>();

function fetchModified(repo: string) {
  let request = modifiedRequests.get(repo);
  if (!request) {
    request = fetch(`https://api.github.com/repos/${repo}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => (json?.pushed_at ? formatModified(json.pushed_at) : null))
      .catch(() => null);
    modifiedRequests.set(repo, request);
  }
  return request;
}

function useLastModified() {
  const [dates, setDates] = useState<Record<string, string | null>>({});
  useEffect(() => {
    let cancelled = false;
    for (const { repo } of PRODUCTS) {
      fetchModified(repo).then((date) => {
        if (!cancelled) setDates((prev) => ({ ...prev, [repo]: date }));
      });
    }
    return () => {
      cancelled = true;
    };
  }, []);
  return dates;
}

// ---------------------------------------------------------------------------
// Styles

const pageStyle = css({
  width: "100%",
  minHeight: "100%",
  display: "flex",
  flexDirection: "column",
});

// Fills the space above the footer so the frame lines reach it.
const mainStyle = css({
  position: "relative",
  isolation: "isolate",
  flex: 1,
  width: "100%",
  // Clips the full-width dividers without making a scroll box.
  overflowX: "clip",
});

const frameColumnStyle = css({
  width: "100%",
  maxWidth: FRAME_WIDTH,
  margin: "0 auto",
  boxSizing: "border-box",
});

const headerStyle = css({
  padding: "8rem 1.5rem 2.5rem",
  "@media (max-width: 640px)": {
    padding: "6.5rem 1rem 2rem",
  },
});

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

function typed(shown: boolean, index: number, baseMs = 0) {
  return {
    css: shown ? lineTypedStyle : lineHiddenStyle,
    style: { animationDelay: `${baseMs + index * LINE_STEP_MS}ms` },
  };
}

const linkStyle = css({
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

// The listing, set like Apache's autoindex page. Rows are grids with columns
// sized in ch, so the monospace text lines up the way the original <pre> did.
const listingStyle = css({
  fontFamily: MONO,
  fontSize: "0.8125rem",
  lineHeight: 1.7,
  color: DATA,
  "@media (max-width: 640px)": {
    fontSize: "0.75rem",
  },
});

const listingRowStyle = css({
  display: "grid",
  gridTemplateColumns: "5ch 17ch 17ch 10ch minmax(0, 1fr)",
  columnGap: "2rem",
  "> span": {
    whiteSpace: "nowrap",
  },
  "> span:last-child": {
    whiteSpace: "normal",
  },
  // Dates and licences drop out first on narrow screens.
  "@media (max-width: 640px)": {
    gridTemplateColumns: "5ch 13ch minmax(0, 1fr)",
    columnGap: "1rem",
    ".wide": {
      display: "none",
    },
  },
});

const listingHeadStyle = css({
  color: MUTED,
});

const iconCellStyle = css({
  color: "#5c5c66",
});

// The browser-default <hr>: a sunken groove.
const hrStyle = css({
  height: 0,
  margin: "0.45rem 0",
  border: "none",
  borderTop: "1px solid #3a3a42",
  borderBottom: "1px solid #1c1c21",
});

// A 1px line that runs to both screen edges.
const dividerStyle = css({
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

const entryStyle = css({
  display: "grid",
  gridTemplateColumns: `minmax(0, ${MEDIA_WIDTH}px) minmax(0, 1fr)`,
  scrollMarginTop: "4rem",
  "@media (max-width: 900px)": {
    gridTemplateColumns: "minmax(0, 1fr)",
  },
});

const mediaLinkStyle = css({
  display: "block",
});

const mediaFrameStyle = css({
  display: "block",
  borderRight: `1px solid ${LINE}`,
  "@media (max-width: 900px)": {
    borderRight: "none",
    borderBottom: `1px solid ${LINE}`,
  },
});

const infoStyle = css({
  display: "flex",
  flexDirection: "column",
  padding: "1.75rem 2rem 2rem",
  minWidth: 0,
  "@media (max-width: 640px)": {
    padding: "1.5rem 1rem 2.25rem",
  },
});

const pathStyle = css({
  margin: 0,
  fontFamily: MONO,
  fontSize: "0.75rem",
  lineHeight: 1.6,
  color: MUTED,
});

const nameStyle = css({
  margin: "0.5rem 0 0.75rem",
  fontFamily: SERIF,
  fontSize: "2.25rem",
  fontWeight: 700,
  lineHeight: 1.1,
});

const descriptionStyle = css({
  margin: 0,
  fontFamily: SERIF,
  fontSize: "1.125rem",
  fontWeight: 400,
  lineHeight: 1.45,
  color: "#d4d4dc",
});

// Label, dotted leader, value: the old spec sheet look.
const specListStyle = css({
  margin: "auto 0 0",
  paddingTop: "1.75rem",
  fontFamily: MONO,
  fontSize: "0.75rem",
  lineHeight: 1.9,
  color: DATA,
  "> div": {
    display: "flex",
    alignItems: "baseline",
    gap: "0.5rem",
  },
  dt: {
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  dd: {
    margin: 0,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
});

const leaderStyle = css({
  flex: 1,
  minWidth: "1rem",
  borderBottom: "1px dotted rgba(255, 255, 255, 0.22)",
  transform: "translateY(-0.3em)",
});

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

// ---------------------------------------------------------------------------
// Components

function isInternal(href: string) {
  return href.startsWith("/");
}

// Internal pages go through the same fade as the nav bar's links.
function ProductLink({
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

  if (isInternal(href)) {
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

function useTitleTyping() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(TITLE.length);
      return;
    }
    const id = window.setInterval(() => {
      setCount((n) => {
        if (n >= TITLE.length) window.clearInterval(id);
        return Math.min(TITLE.length, n + 1);
      });
    }, TITLE_CHAR_MS);
    return () => window.clearInterval(id);
  }, []);
  return count;
}

function Listing({ dates }: { dates: Record<string, string | null> }) {
  const typedChars = useTitleTyping();
  const shown = typedChars >= TITLE.length;

  const scrollTo = (event: MouseEvent<HTMLAnchorElement>, slug: string) => {
    event.preventDefault();
    document.getElementById(slug)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  const row = (index: number) => typed(shown, index);

  return (
    <header css={[frameColumnStyle, headerStyle]}>
      <h1 css={titleStyle} aria-label={TITLE}>
        <span aria-hidden="true">{TITLE.slice(0, typedChars)}</span>
        <span css={cursorStyle} aria-hidden="true" />
      </h1>

      <div css={listingStyle} role="table" aria-label="Products">
        <div
          css={[listingRowStyle, listingHeadStyle, row(0).css]}
          style={row(0).style}
          role="row"
        >
          <span role="columnheader" aria-label="Type" />
          <span role="columnheader">Name</span>
          <span role="columnheader" className="wide">
            Last modified
          </span>
          <span role="columnheader" className="wide">
            License
          </span>
          <span role="columnheader">Description</span>
        </div>
        <hr css={[hrStyle, row(1).css]} style={row(1).style} />

        <div
          css={[listingRowStyle, row(2).css]}
          style={row(2).style}
          role="row"
        >
          <span css={iconCellStyle} role="cell">
            [UP]
          </span>
          <span role="cell">
            <ProductLink href="/" css={linkStyle}>
              Parent Directory
            </ProductLink>
          </span>
          <span role="cell" className="wide" />
          <span role="cell" className="wide">
            -
          </span>
          <span role="cell" />
        </div>
        {PRODUCTS.map((item, index) => (
          <div
            key={item.slug}
            css={[listingRowStyle, row(3 + index).css]}
            style={row(3 + index).style}
            role="row"
          >
            <span css={iconCellStyle} role="cell">
              [DIR]
            </span>
            <span role="cell">
              <a
                css={linkStyle}
                href={`#${item.slug}`}
                onClick={(event) => scrollTo(event, item.slug)}
              >
                {item.name}/
              </a>
            </span>
            <span role="cell" className="wide">
              {dates[item.repo] ?? "-"}
            </span>
            <span role="cell" className="wide">
              {item.license}
            </span>
            <span role="cell">{item.summary}</span>
          </div>
        ))}
        <hr
          css={[hrStyle, row(3 + PRODUCTS.length).css]}
          style={row(3 + PRODUCTS.length).style}
        />
      </div>
    </header>
  );
}

// Turns true once the element has come into view, and stays true.
function useSeenOnce<T extends Element>(ref: RefObject<T>) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSeen(true);
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, seen]);
  return seen;
}

function Entry({
  item,
  index,
  modified,
  notBefore,
}: {
  item: ProductItem;
  index: number;
  modified: string | null | undefined;
  // performance.now() time the entry may not start before.
  notBefore: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const seen = useSeenOnce(ref);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!seen) return;
    const id = window.setTimeout(
      () => setShown(true),
      Math.max(0, notBefore - performance.now()),
    );
    return () => window.clearTimeout(id);
  }, [seen, notBefore]);

  // The text types in alongside the picture's scan.
  const line = (i: number) => typed(shown, i, 150);

  const spec: [string, ReactNode][] = [
    ["Lang", item.language],
    ["License", item.license],
    ["Modified", modified ?? "-"],
    [
      "Source",
      <a
        css={linkStyle}
        href={`https://github.com/${item.repo}`}
        target="_blank"
        rel="noreferrer"
      >
        github.com/{item.repo}
      </a>,
    ],
  ];

  return (
    <article ref={ref} id={item.slug} css={[frameColumnStyle, entryStyle]}>
      <ProductLink
        href={item.href}
        css={mediaLinkStyle}
        tabIndex={-1}
        ariaHidden
      >
        <span css={mediaFrameStyle}>
          <AsciiMedia
            source={item.media}
            aspect={MEDIA_ASPECT}
            start={shown}
            label={`${item.name}, drawn in ASCII`}
          />
        </span>
      </ProductLink>

      <div css={infoStyle}>
        <p css={[pathStyle, line(0).css]} style={line(0).style}>
          /products/{item.name}/ &nbsp;[{pad(index + 1)}]
        </p>
        <h2 css={[nameStyle, line(1).css]} style={line(1).style}>
          <ProductLink href={item.href} css={linkStyle}>
            {item.name}
          </ProductLink>
        </h2>
        <p css={[descriptionStyle, line(2).css]} style={line(2).style}>
          {item.description}
        </p>

        <dl css={specListStyle}>
          {spec.map(([label, value], i) => (
            <div key={label} css={line(3 + i).css} style={line(3 + i).style}>
              <dt>{label}</dt>
              <span css={leaderStyle} aria-hidden="true" />
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

export function Product() {
  const dates = useLastModified();
  // Fixed at first render so entries already in view wait for the listing.
  const [introEnd] = useState(
    () =>
      performance.now() +
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : INTRO_MS),
  );

  return (
    <div css={pageStyle}>
      <TopNavBar />

      <main css={mainStyle}>
        <FrameLines />

        <Listing dates={dates} />

        <div css={dividerStyle} aria-hidden="true" />
        {PRODUCTS.map((item, index) => (
          <div key={item.slug}>
            <Entry
              item={item}
              index={index}
              modified={dates[item.repo]}
              notBefore={introEnd + index * ENTRY_STAGGER_MS}
            />
            <div css={dividerStyle} aria-hidden="true" />
          </div>
        ))}

        <address css={[frameColumnStyle, addressStyle]}>
          cartesiancs/1.0 Server at cartesiancs.com Port 443
        </address>
      </main>

      <Footer />
    </div>
  );
}
