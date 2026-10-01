/** @jsxImportSource @emotion/react */
import { useEffect, useMemo, useRef, useState } from "react";
import { css } from "@emotion/react";
import { CornerDownLeft, FileText, Hash, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loadSearchIndex, type SearchSection } from "./content";
import { docPath, type Lang } from "./manifest";
import { ui } from "./strings";

const overlayStyle = css({
  position: "fixed",
  inset: 0,
  zIndex: 200000,
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "12vh 1rem 1rem",
  boxSizing: "border-box",
  backgroundColor: "rgba(8, 8, 10, 0.72)",
  backdropFilter: "blur(6px)",
  "@media (max-width: 640px)": { paddingTop: "1rem" },
});

const panelStyle = css({
  width: "100%",
  maxWidth: "640px",
  maxHeight: "70vh",
  display: "flex",
  flexDirection: "column",
  borderRadius: "14px",
  border: "1px solid rgb(46, 46, 54)",
  backgroundColor: "#141518",
  boxShadow: "0 24px 80px rgba(0, 0, 0, 0.55)",
  overflow: "hidden",
});

const inputRowStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "0 1rem",
  borderBottom: "1px solid rgb(36, 36, 43)",
  "& > svg": { width: "18px", height: "18px", color: "#8a8a8f", flexShrink: 0 },
});

const inputStyle = css({
  flex: 1,
  height: "3.25rem",
  border: "none",
  outline: "none",
  background: "none",
  color: "#ffffff",
  fontFamily: "inherit",
  fontSize: "1rem",
  "::placeholder": { color: "#6b6b73" },
});

const escStyle = css({
  padding: "0.15rem 0.4rem",
  borderRadius: "5px",
  border: "1px solid rgb(46, 46, 54)",
  fontSize: "0.7rem",
  color: "#8a8a8f",
});

const listStyle = css({
  overflowY: "auto",
  padding: "0.5rem",
});

const emptyStyle = css({
  padding: "2rem 1rem",
  textAlign: "center",
  fontSize: "0.9rem",
  color: "#8a8a8f",
});

const resultStyle = css({
  display: "flex",
  alignItems: "flex-start",
  gap: "0.75rem",
  width: "100%",
  padding: "0.7rem 0.75rem",
  border: "none",
  borderRadius: "10px",
  background: "none",
  textAlign: "left",
  fontFamily: "inherit",
  cursor: "pointer",
  color: "#bfbfc7",
  "& > svg": { width: "16px", height: "16px", marginTop: "0.2rem", flexShrink: 0, color: "#6b6b73" },
  '&[data-active="true"]': {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    color: "#ffffff",
  },
  '&[data-active="true"] > svg': { color: "#ffffff" },
});

const resultBodyStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "0.2rem",
  minWidth: 0,
  flex: 1,
});

const resultTitleStyle = css({
  fontSize: "0.92rem",
  fontWeight: 500,
  color: "inherit",
});

const resultPathStyle = css({
  fontSize: "0.75rem",
  color: "#6b6b73",
});

const snippetStyle = css({
  fontSize: "0.82rem",
  lineHeight: 1.55,
  color: "#8a8a8f",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  "& mark": {
    backgroundColor: "rgba(149, 180, 240, 0.22)",
    color: "#ffffff",
    borderRadius: "3px",
    padding: "0 0.1em",
  },
});

const enterStyle = css({
  width: "14px",
  height: "14px",
  marginTop: "0.25rem",
  color: "#8a8a8f",
  flexShrink: 0,
});

type Result = SearchSection & { score: number; order: number };

function rank(sections: SearchSection[], query: string): Result[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  const out: Result[] = [];
  sections.forEach((section, order) => {
    const title = section.pageTitle.toLowerCase();
    const heading = section.heading.toLowerCase();
    const text = section.text.toLowerCase();
    let score = 0;
    for (const term of terms) {
      const inTitle = title.includes(term);
      const inHeading = heading.includes(term);
      const inText = text.includes(term);
      // Every word has to appear somewhere in the section.
      if (!inTitle && !inHeading && !inText) return;
      score += (inTitle ? 3 : 0) + (inHeading ? 4 : 0) + (inText ? 1 : 0);
    }
    if (!section.anchor && score < 3 * terms.length) score -= 1;
    out.push({ ...section, score, order });
  });
  return out.sort((a, b) => b.score - a.score || a.order - b.order).slice(0, 30);
}

function Snippet({ text, query }: { text: string; query: string }) {
  const term = query.toLowerCase().split(/\s+/).filter(Boolean)[0] ?? "";
  const at = term ? text.toLowerCase().indexOf(term) : -1;
  if (at === -1) return <>{text.slice(0, 140)}</>;
  const start = Math.max(0, at - 40);
  const before = (start > 0 ? "..." : "") + text.slice(start, at);
  const hit = text.slice(at, at + term.length);
  const after = text.slice(at + term.length, at + term.length + 110);
  return (
    <>
      {before}
      <mark>{hit}</mark>
      {after}
    </>
  );
}

export function SearchDialog({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState<SearchSection[] | null>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    inputRef.current?.focus();
    let alive = true;
    loadSearchIndex(lang).then((sections) => alive && setIndex(sections));
    return () => {
      alive = false;
    };
  }, [lang]);

  const results = useMemo(() => (index ? rank(index, query) : []), [index, query]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const open = (result: Result) => {
    navigate(`${docPath(result.slug)}${result.anchor ? `#${result.anchor}` : ""}`);
    onClose();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      open(results[active]);
    }
  };

  return (
    <div
      css={overlayStyle}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div css={panelStyle} role="dialog" aria-label={ui(lang, "search")}>
        <div css={inputRowStyle}>
          <Search />
          <input
            ref={inputRef}
            css={inputStyle}
            value={query}
            placeholder={ui(lang, "search_placeholder")}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            aria-label={ui(lang, "search")}
          />
          <span css={escStyle}>ESC</span>
        </div>
        <div css={listStyle} ref={listRef}>
          {!query.trim() ? (
            <div css={emptyStyle}>{ui(lang, "search_hint")}</div>
          ) : !index ? (
            <div css={emptyStyle}>{ui(lang, "search_loading")}</div>
          ) : results.length === 0 ? (
            <div css={emptyStyle}>
              {ui(lang, "search_empty")} "{query}"
            </div>
          ) : (
            results.map((result, i) => {
              const Icon = result.anchor ? Hash : FileText;
              return (
                <button
                  key={`${result.slug}#${result.anchor}`}
                  type="button"
                  css={resultStyle}
                  data-active={i === active}
                  onMouseMove={() => setActive(i)}
                  onClick={() => open(result)}
                >
                  <Icon />
                  <span css={resultBodyStyle}>
                    <span css={resultTitleStyle}>{result.heading}</span>
                    {result.anchor && (
                      <span css={resultPathStyle}>{result.pageTitle}</span>
                    )}
                    {result.text && (
                      <span css={snippetStyle}>
                        <Snippet text={result.text} query={query} />
                      </span>
                    )}
                  </span>
                  {i === active && <CornerDownLeft css={enterStyle} />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
