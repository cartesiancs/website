/** @jsxImportSource @emotion/react */
import { useCallback, useEffect, useMemo, useState } from "react";
import { css } from "@emotion/react";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Github,
  Menu,
  Search,
  X,
} from "lucide-react";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";
import { DocMarkdown, type Heading, type ImageSizes } from "../features/tutorial/markdown";
import { loadDoc, loadImageSizes, type LoadedDoc } from "../features/tutorial/content";
import {
  docPath,
  findPage,
  FIRST_SLUG,
  LANG_LABEL,
  LANGS,
  NAV,
  sourceFolder,
  type Lang,
} from "../features/tutorial/manifest";
import { ui } from "../features/tutorial/strings";
import { SearchDialog } from "../features/tutorial/SearchDialog";

const LANG_KEY = "cartcut-docs-lang";
const ISSUES_URL = "https://github.com/cartesiancs/cartcut/issues";
const DOWNLOAD_PAGE = "/cartcut";

function isLang(value: unknown): value is Lang {
  return value === "en" || value === "ko";
}

function readStoredLang(): Lang | null {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    return isLang(stored) ? stored : null;
  } catch {
    return null;
  }
}

function storeLang(lang: Lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // Private windows can refuse storage; the ?lang= in the URL still works.
  }
}

function browserLang(): Lang {
  const languages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  return languages.some((l) => l?.toLowerCase().startsWith("ko")) ? "ko" : "en";
}

// ?lang= wins, so a shared link opens in the language it was shared in; after
// that the last choice is remembered, and a first visit follows the browser.
function useDocLang() {
  const [params, setParams] = useSearchParams();
  const fromUrl = params.get("lang");
  const [lang, setLangState] = useState<Lang>(() =>
    isLang(fromUrl) ? fromUrl : readStoredLang() ?? browserLang(),
  );

  useEffect(() => {
    if (isLang(fromUrl)) {
      setLangState(fromUrl);
      storeLang(fromUrl);
    }
  }, [fromUrl]);

  const setLang = useCallback(
    (next: Lang) => {
      setLangState(next);
      storeLang(next);
      setParams(
        (prev) => {
          const copy = new URLSearchParams(prev);
          copy.set("lang", next);
          return copy;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  return [lang, setLang] as const;
}

// The body, not the window, is the scroll container here (see App.css).
function scrollTop() {
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

function useActiveHeading(headings: Heading[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (headings.length === 0) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = headings[0].id;
      for (const heading of headings) {
        const node = document.getElementById(heading.id);
        if (node && node.getBoundingClientRect().top < 140) current = heading.id;
      }
      // At the very bottom the last short section can never reach the top.
      const doc = document.scrollingElement ?? document.documentElement;
      const atBottom =
        window.innerHeight + scrollTop() >=
        Math.max(doc.scrollHeight, document.body.scrollHeight) - 4;
      if (atBottom) current = headings[headings.length - 1].id;
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    const options = { capture: true, passive: true } as const;
    window.addEventListener("scroll", onScroll, options);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, options);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [headings]);
  return active;
}

function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}

// ---------------------------------------------------------------- styles

const pageStyle = css({
  display: "flex",
  minHeight: "100%",
  width: "100%",
  flexDirection: "column",
});

const shellStyle = css({
  width: "100%",
  maxWidth: "1320px",
  margin: "0 auto",
  padding: "5.25rem 2rem 0 2rem",
  boxSizing: "border-box",
  "@media (max-width: 900px)": { padding: "4.75rem 1rem 0 1rem" },
});

const headerStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  padding: "0.75rem 0 1.25rem 0",
  borderBottom: "1px solid rgb(36, 36, 43)",
});

const brandStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  textDecoration: "none",
  color: "#ffffff",
  minWidth: 0,
  "& img": { width: "auto", height: "22px", display: "block" },
});

const brandDividerStyle = css({
  width: "1px",
  height: "18px",
  backgroundColor: "rgb(58, 58, 66)",
  "@media (max-width: 480px)": { display: "none" },
});

const brandLabelStyle = css({
  fontSize: "0.95rem",
  fontWeight: 500,
  color: "#bfbfc7",
  whiteSpace: "nowrap",
  "@media (max-width: 480px)": { display: "none" },
});

const headerActionsStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

const segmentedStyle = css({
  display: "inline-flex",
  padding: "3px",
  borderRadius: "9px",
  border: "1px solid rgb(36, 36, 43)",
  backgroundColor: "rgba(255, 255, 255, 0.02)",
});

const segmentStyle = css({
  padding: "0.35rem 0.7rem",
  border: "none",
  borderRadius: "6px",
  background: "none",
  color: "#8a8a8f",
  fontFamily: "inherit",
  fontSize: "0.8rem",
  fontWeight: 500,
  whiteSpace: "nowrap",
  cursor: "pointer",
  transition: "color 0.2s ease, background-color 0.2s ease",
  ":hover": { color: "#ffffff" },
  '&[aria-pressed="true"]': {
    color: "#0d0e0f",
    backgroundColor: "#ffffff",
  },
});

const ghostButtonStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  height: "2.15rem",
  padding: "0 0.8rem",
  borderRadius: "8px",
  border: "1px solid rgb(36, 36, 43)",
  background: "none",
  color: "#e6e6eb",
  fontFamily: "inherit",
  fontSize: "0.82rem",
  fontWeight: 500,
  textDecoration: "none",
  cursor: "pointer",
  whiteSpace: "nowrap",
  transition: "border-color 0.3s ease, color 0.3s ease",
  ":hover": { borderColor: "rgb(70, 70, 80)", color: "#ffffff" },
  "& svg": { width: "15px", height: "15px" },
});

const iconOnlyStyle = css(ghostButtonStyle, {
  width: "2.15rem",
  padding: 0,
  justifyContent: "center",
});

const desktopOnly = css({ "@media (max-width: 900px)": { display: "none" } });
const mobileOnly = css({ "@media (min-width: 901px)": { display: "none" } });
const hideOnPhone = css({ "@media (max-width: 520px)": { display: "none" } });

const gridStyle = css({
  display: "grid",
  gridTemplateColumns: "236px minmax(0, 1fr) 208px",
  gap: "3.5rem",
  "@media (max-width: 1240px)": {
    gridTemplateColumns: "236px minmax(0, 1fr)",
    gap: "3rem",
  },
  "@media (max-width: 900px)": { gridTemplateColumns: "minmax(0, 1fr)" },
});

const sidebarStyle = css({
  position: "sticky",
  top: "4.5rem",
  alignSelf: "start",
  maxHeight: "calc(100vh - 4.5rem)",
  overflowY: "auto",
  padding: "1.5rem 0.25rem 3rem 0",
  boxSizing: "border-box",
  "@media (max-width: 900px)": { display: "none" },
});

const searchTriggerStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "0.55rem",
  width: "100%",
  height: "2.4rem",
  marginBottom: "1.5rem",
  padding: "0 0.6rem 0 0.75rem",
  boxSizing: "border-box",
  borderRadius: "9px",
  border: "1px solid rgb(36, 36, 43)",
  backgroundColor: "rgba(255, 255, 255, 0.02)",
  color: "#8a8a8f",
  fontFamily: "inherit",
  fontSize: "0.85rem",
  cursor: "pointer",
  transition: "border-color 0.3s ease, color 0.3s ease",
  ":hover": { borderColor: "rgb(70, 70, 80)", color: "#e6e6eb" },
  "& > svg": { width: "15px", height: "15px", flexShrink: 0 },
  "& > span": { flex: 1, textAlign: "left" },
});

const shortcutHintStyle = css({
  padding: "0.1rem 0.4rem",
  borderRadius: "5px",
  border: "1px solid rgb(46, 46, 54)",
  fontSize: "0.7rem",
  color: "#8a8a8f",
});

const navGroupStyle = css({
  marginBottom: "1.6rem",
});

const navGroupTitleStyle = css({
  margin: "0 0 0.5rem 0",
  padding: "0 0.75rem",
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#6b6b73",
});

const navLinkStyle = css({
  display: "block",
  padding: "0.42rem 0.75rem",
  borderRadius: "7px",
  fontSize: "0.9rem",
  lineHeight: 1.4,
  color: "#a5a5ae",
  textDecoration: "none",
  transition: "color 0.2s ease, background-color 0.2s ease",
  ":hover": { color: "#ffffff" },
  '&[aria-current="page"]': {
    color: "#ffffff",
    fontWeight: 500,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
});

const articleStyle = css({
  minWidth: 0,
  maxWidth: "780px",
  padding: "2.25rem 0 6rem 0",
  "@media (max-width: 900px)": { padding: "1.75rem 0 4rem 0" },
});

const eyebrowStyle = css({
  margin: "0 0 0.85rem 0",
  fontSize: "0.8rem",
  fontWeight: 500,
  color: "#95b4f0",
  letterSpacing: "0.01em",
});

const tocStyle = css({
  position: "sticky",
  top: "4.5rem",
  alignSelf: "start",
  maxHeight: "calc(100vh - 4.5rem)",
  overflowY: "auto",
  padding: "2.4rem 0 3rem 0",
  boxSizing: "border-box",
  "@media (max-width: 1240px)": { display: "none" },
});

const tocTitleStyle = css({
  margin: "0 0 0.75rem 0",
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#6b6b73",
});

const tocLinkStyle = css({
  display: "block",
  padding: "0.3rem 0 0.3rem 0.85rem",
  borderLeft: "1px solid rgb(36, 36, 43)",
  fontSize: "0.82rem",
  lineHeight: 1.45,
  color: "#8a8a8f",
  textDecoration: "none",
  transition: "color 0.2s ease, border-color 0.2s ease",
  ":hover": { color: "#ffffff" },
  '&[data-depth="3"]': { paddingLeft: "1.6rem" },
  '&[data-active="true"]': { color: "#ffffff", borderLeftColor: "#95b4f0" },
});

const pagerStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "0.85rem",
  marginTop: "4rem",
  "@media (max-width: 640px)": { gridTemplateColumns: "minmax(0, 1fr)" },
});

const pagerCardStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "0.3rem",
  padding: "1rem 1.15rem",
  borderRadius: "12px",
  border: "1px solid rgb(36, 36, 43)",
  textDecoration: "none",
  transition: "border-color 0.3s ease, background-color 0.3s ease",
  ":hover": {
    borderColor: "rgb(70, 70, 80)",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  "&[data-dir='next']": { alignItems: "flex-end", textAlign: "right", gridColumn: 2 },
  "@media (max-width: 640px)": { "&[data-dir='next']": { gridColumn: 1 } },
});

const pagerLabelStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  fontSize: "0.78rem",
  color: "#8a8a8f",
  "& svg": { width: "14px", height: "14px" },
});

const pagerTitleStyle = css({
  fontSize: "0.98rem",
  fontWeight: 500,
  color: "#ffffff",
});

const metaStyle = css({
  marginTop: "2.5rem",
  paddingTop: "1.5rem",
  borderTop: "1px solid rgb(36, 36, 43)",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  fontSize: "0.8rem",
  lineHeight: 1.6,
  color: "#6b6b73",
  "& a": {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    color: "#bfbfc7",
    textDecoration: "none",
    transition: "color 0.2s ease",
  },
  "& a:hover": { color: "#ffffff" },
  "& svg": { width: "14px", height: "14px" },
});

const statusStyle = css({
  padding: "4rem 0",
  color: "#8a8a8f",
  "& h1": { margin: "0 0 0.75rem 0", color: "#ffffff", fontSize: "1.75rem" },
});

const skeletonStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "0.9rem",
  paddingTop: "0.5rem",
  "& div": {
    height: "0.9rem",
    borderRadius: "6px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
});

const drawerOverlayStyle = css({
  position: "fixed",
  inset: 0,
  zIndex: 200000,
  backgroundColor: "rgba(8, 8, 10, 0.72)",
  backdropFilter: "blur(6px)",
});

const drawerStyle = css({
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  width: "min(320px, 86vw)",
  padding: "1rem 1rem 2rem 1rem",
  boxSizing: "border-box",
  overflowY: "auto",
  backgroundColor: "#111214",
  borderRight: "1px solid rgb(36, 36, 43)",
});

const drawerHeaderStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "1.25rem",
});

const lightboxStyle = css({
  position: "fixed",
  inset: 0,
  zIndex: 200001,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem",
  boxSizing: "border-box",
  backgroundColor: "rgba(8, 8, 10, 0.9)",
  backdropFilter: "blur(8px)",
  cursor: "zoom-out",
  "& img": {
    width: "auto",
    maxWidth: "100%",
    maxHeight: "100%",
    borderRadius: "10px",
    boxShadow: "0 30px 100px rgba(0, 0, 0, 0.6)",
  },
  "@media (max-width: 640px)": { padding: "0.75rem" },
});

// ---------------------------------------------------------------- pieces

function NavList({
  lang,
  current,
  onNavigate,
}: {
  lang: Lang;
  current: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label={ui(lang, "tutorial")}>
      {NAV.map((group) => (
        <div key={group.title.en} css={navGroupStyle}>
          <h4 css={navGroupTitleStyle}>{group.title[lang]}</h4>
          {group.pages.map((page) => (
            <Link
              key={page.slug}
              to={docPath(page.slug)}
              css={navLinkStyle}
              aria-current={page.slug === current ? "page" : undefined}
              onClick={onNavigate}
            >
              {page.title[lang]}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}

function LangSwitch({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div css={segmentedStyle} role="group" aria-label="Language">
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          css={segmentStyle}
          aria-pressed={l === lang}
          onClick={() => onChange(l)}
        >
          {l === "en" ? "EN" : LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}

const isMac =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

export function Tutorial() {
  const { slug } = useParams();
  const current = slug ?? FIRST_SLUG;
  const location = useLocation();
  const [lang, setLang] = useDocLang();
  // findPage builds a fresh object per call; without memoizing, every
  // re-render (e.g. the active TOC heading changing) would re-run the load
  // effect below and flash the skeleton, collapsing the scroll position.
  const found = useMemo(() => findPage(current), [current]);

  const [doc, setDoc] = useState<LoadedDoc | null>(null);
  const [sizes, setSizes] = useState<ImageSizes>({});
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [zoomed, setZoomed] = useState<{ src: string; alt: string } | null>(null);

  useBodyScrollLock(searchOpen || drawerOpen || zoomed !== null);

  useEffect(() => {
    if (!found) {
      setStatus("missing");
      setDoc(null);
      return;
    }
    let alive = true;
    setStatus("loading");
    Promise.all([loadDoc(lang, current), loadImageSizes(lang)]).then(
      ([loaded, imageSizes]) => {
        if (!alive) return;
        setDoc(loaded);
        setSizes(imageSizes);
        setStatus(loaded ? "ready" : "missing");
      },
    );
    return () => {
      alive = false;
    };
  }, [lang, current, found]);

  // Jump to #anchor once the page it points into has rendered.
  useEffect(() => {
    if (status !== "ready" || !location.hash) return;
    const id = decodeURIComponent(location.hash.slice(1));
    const frame = requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ block: "start" }),
    );
    return () => cancelAnimationFrame(frame);
  }, [status, location.hash, location.key]);

  useEffect(() => {
    const title = found ? found.page.title[lang] : ui(lang, "not_found_title");
    document.title = `${title} | CartCut ${ui(lang, "tutorial")}`;
    document.documentElement.lang = lang;
  }, [found, lang]);

  useEffect(
    () => () => {
      document.title = "cartesiancs | Open Source Organization";
      document.documentElement.lang = "en";
    },
    [],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((open) => !open);
      } else if (event.key === "/" && !typing) {
        event.preventDefault();
        setSearchOpen(true);
      } else if (event.key === "Escape") {
        setZoomed(null);
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const headings = doc?.headings ?? [];
  const activeHeading = useActiveHeading(status === "ready" ? headings : []);
  const onZoom = useCallback((src: string, alt: string) => setZoomed({ src, alt }), []);

  return (
    <div css={pageStyle}>
      <TopNavBar />

      <div css={shellStyle}>
        <header css={headerStyle}>
          <Link to={docPath(FIRST_SLUG)} css={brandStyle}>
            <img src="/cartcut.png" alt="CartCut" />
            <span css={brandDividerStyle} />
            <span css={brandLabelStyle}>{ui(lang, "tutorial")}</span>
          </Link>
          <div css={headerActionsStyle}>
            <button
              type="button"
              css={[iconOnlyStyle, mobileOnly]}
              aria-label={ui(lang, "search")}
              onClick={() => setSearchOpen(true)}
            >
              <Search />
            </button>
            <LangSwitch lang={lang} onChange={setLang} />
            <a css={[ghostButtonStyle, hideOnPhone]} href={DOWNLOAD_PAGE}>
              <Download />
              {ui(lang, "download")}
            </a>
            <button
              type="button"
              css={[iconOnlyStyle, mobileOnly]}
              aria-label={ui(lang, "menu")}
              onClick={() => setDrawerOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </header>

        <div css={gridStyle}>
          <aside css={sidebarStyle}>
            <button
              type="button"
              css={searchTriggerStyle}
              onClick={() => setSearchOpen(true)}
            >
              <Search />
              <span>{ui(lang, "search")}</span>
              <kbd css={shortcutHintStyle}>{isMac ? "⌘K" : "Ctrl K"}</kbd>
            </button>
            <NavList lang={lang} current={current} />
          </aside>

          <main css={articleStyle}>
            {status === "missing" ? (
              <div css={statusStyle}>
                <h1>{ui(lang, "not_found_title")}</h1>
                <p>{ui(lang, "not_found_text")}</p>
                <Link css={ghostButtonStyle} to={docPath(FIRST_SLUG)}>
                  {ui(lang, "back_to_start")}
                  <ArrowRight />
                </Link>
              </div>
            ) : status === "loading" || !doc || !found ? (
              <div css={skeletonStyle} aria-label={ui(lang, "loading")}>
                <div style={{ width: "28%", height: "0.8rem" }} />
                <div style={{ width: "62%", height: "2.2rem", marginBottom: "1rem" }} />
                <div style={{ width: "100%" }} />
                <div style={{ width: "94%" }} />
                <div style={{ width: "71%" }} />
              </div>
            ) : (
              <>
                <p css={eyebrowStyle}>{found.group.title[lang]}</p>
                <DocMarkdown
                  key={`${lang}/${current}`}
                  tokens={doc.tokens}
                  lang={lang}
                  base={sourceFolder(lang)}
                  sizes={sizes}
                  onZoom={onZoom}
                />

                <div css={pagerStyle}>
                  {found.previous && (
                    <Link
                      css={pagerCardStyle}
                      data-dir="previous"
                      to={docPath(found.previous.slug)}
                    >
                      <span css={pagerLabelStyle}>
                        <ArrowLeft />
                        {ui(lang, "previous")}
                      </span>
                      <span css={pagerTitleStyle}>{found.previous.title[lang]}</span>
                    </Link>
                  )}
                  {found.next && (
                    <Link css={pagerCardStyle} data-dir="next" to={docPath(found.next.slug)}>
                      <span css={pagerLabelStyle}>
                        {ui(lang, "next")}
                        <ArrowRight />
                      </span>
                      <span css={pagerTitleStyle}>{found.next.title[lang]}</span>
                    </Link>
                  )}
                </div>

                <div css={metaStyle}>
                  <span>
                    {ui(lang, "edit_suggestion")}{" "}
                    <a href={ISSUES_URL} target="_blank" rel="noreferrer">
                      <Github />
                      {ui(lang, "open_issue")}
                    </a>
                  </span>
                  <span>{ui(lang, "sample_credit")}</span>
                </div>
              </>
            )}
          </main>

          <aside css={tocStyle}>
            {status === "ready" && headings.length > 0 && (
              <>
                <h4 css={tocTitleStyle}>{ui(lang, "on_this_page")}</h4>
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    css={tocLinkStyle}
                    data-depth={heading.depth}
                    data-active={heading.id === activeHeading}
                  >
                    {heading.text}
                  </a>
                ))}
              </>
            )}
          </aside>
        </div>
      </div>

      <Footer />

      {searchOpen && <SearchDialog lang={lang} onClose={() => setSearchOpen(false)} />}

      {drawerOpen && (
        <div
          css={drawerOverlayStyle}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDrawerOpen(false);
          }}
        >
          <div css={drawerStyle}>
            <div css={drawerHeaderStyle}>
              <LangSwitch lang={lang} onChange={setLang} />
              <button
                type="button"
                css={iconOnlyStyle}
                aria-label={ui(lang, "close")}
                onClick={() => setDrawerOpen(false)}
              >
                <X />
              </button>
            </div>
            <NavList lang={lang} current={current} onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      {zoomed && (
        <div css={lightboxStyle} onClick={() => setZoomed(null)} role="dialog">
          <img src={zoomed.src} alt={zoomed.alt} />
        </div>
      )}
    </div>
  );
}
