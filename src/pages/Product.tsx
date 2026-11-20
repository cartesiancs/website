/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
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
import { FrameLines } from "../components/FrameLines";
import { AsciiMedia, type AsciiSource } from "../components/AsciiMedia";
import {
  DATA,
  LINE,
  LINE_STEP_MS,
  MONO,
  MUTED,
  SERIF,
  ServerSignature,
  SiteLink,
  TITLE_CHAR_MS,
  TypedTitle,
  dividerStyle,
  frameColumnStyle,
  headerStyle,
  hrStyle,
  iconCellStyle,
  linkStyle,
  listingHeadStyle,
  listingRowStyle,
  listingStyle,
  mainStyle,
  pageStyle,
  typed,
  useTyping,
} from "../components/EarlyWeb";

// The page is dressed as an early web directory listing (see EarlyWeb), with
// the products drawn in ASCII.

const TITLE = "Index of /products";
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

// Name, Last modified, License, Description; dates and licences drop out
// first on narrow screens.
const listingColumnsStyle = css({
  gridTemplateColumns: "5ch 17ch 17ch 10ch minmax(0, 1fr)",
  "@media (max-width: 640px)": {
    gridTemplateColumns: "5ch 13ch minmax(0, 1fr)",
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

// ---------------------------------------------------------------------------
// Components

function Listing({ dates }: { dates: Record<string, string | null> }) {
  const typedChars = useTyping(TITLE);
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
      <TypedTitle text={TITLE} count={typedChars} />

      <div css={listingStyle} role="table" aria-label="Products">
        <div
          css={[
            listingRowStyle,
            listingColumnsStyle,
            listingHeadStyle,
            row(0).css,
          ]}
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
          css={[listingRowStyle, listingColumnsStyle, row(2).css]}
          style={row(2).style}
          role="row"
        >
          <span css={iconCellStyle} role="cell">
            [UP]
          </span>
          <span role="cell">
            <SiteLink href="/" css={linkStyle}>
              Parent Directory
            </SiteLink>
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
            css={[listingRowStyle, listingColumnsStyle, row(3 + index).css]}
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
      <SiteLink
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
      </SiteLink>

      <div css={infoStyle}>
        <p css={[pathStyle, line(0).css]} style={line(0).style}>
          /products/{item.name}/ &nbsp;[{pad(index + 1)}]
        </p>
        <h2 css={[nameStyle, line(1).css]} style={line(1).style}>
          <SiteLink href={item.href} css={linkStyle}>
            {item.name}
          </SiteLink>
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

        <ServerSignature />
      </main>

      <Footer />
    </div>
  );
}
