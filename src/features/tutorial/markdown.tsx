/** @jsxImportSource @emotion/react */
import { Fragment, type ReactNode, useState } from "react";
import { css } from "@emotion/react";
import { marked, type Token, type Tokens } from "marked";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Copy,
  Info,
  Lightbulb,
} from "lucide-react";
import { docPath, type Lang } from "./manifest";
import { ui } from "./strings";

export type Heading = { id: string; text: string; depth: number };

export type ImageSizes = Record<string, [number, number]>;

type RenderContext = {
  lang: Lang;
  // Pixel sizes of the page's screenshots, keyed by file name.
  sizes: ImageSizes;
  // Folder the page's relative image paths resolve against.
  base: string;
  onZoom: (src: string, alt: string) => void;
  // Heading ids are minted in document order; the same counter is replayed by
  // `extractHeadings`, so the table of contents and the anchors always agree.
  ids: Map<string, number>;
};

// marked hands back text with its HTML entities already escaped.
function decode(text: string) {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

export function plainText(tokens: Token[] | undefined): string {
  if (!tokens) return "";
  return tokens
    .map((token) => {
      const t = token as Tokens.Generic;
      if (t.type === "html") return "";
      if (t.tokens) return plainText(t.tokens);
      return decode(t.text ?? "");
    })
    .join("");
}

export function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "section"
  );
}

function mintId(text: string, ids: Map<string, number>) {
  const base = slugify(text);
  const seen = ids.get(base) ?? 0;
  ids.set(base, seen + 1);
  return seen === 0 ? base : `${base}-${seen}`;
}

export function lex(source: string) {
  return marked.lexer(source, { gfm: true });
}

export function extractHeadings(tokens: Token[]): Heading[] {
  const ids = new Map<string, number>();
  const out: Heading[] = [];
  for (const token of tokens) {
    if (token.type !== "heading") continue;
    const heading = token as Tokens.Heading;
    const text = plainText(heading.tokens);
    const id = mintId(text, ids);
    if (heading.depth === 2 || heading.depth === 3) {
      out.push({ id, text, depth: heading.depth });
    }
  }
  return out;
}

const CALLOUT = /^\s*\[!(TIP|NOTE|WARNING|IMPORTANT)\]\s*\n?/i;

// ---------------------------------------------------------------- styles

const proseStyle = css({
  color: "#d4d4da",
  fontSize: "1rem",
  lineHeight: 1.8,
  wordBreak: "keep-all",
  overflowWrap: "anywhere",
  "& p": {
    margin: "0 0 1.1rem 0",
    lineHeight: 1.8,
    fontWeight: 300,
    color: "#d4d4da",
  },
  "& strong": { fontWeight: 600, color: "#ffffff" },
  "& em": { fontStyle: "italic" },
  "& hr": {
    border: "none",
    borderTop: "1px solid rgb(36, 36, 43)",
    margin: "2.5rem 0",
  },
});

const h1Style = css({
  margin: "0 0 1rem 0",
  fontSize: "2.25rem",
  fontWeight: 600,
  lineHeight: 1.2,
  letterSpacing: "-0.02em",
  color: "#ffffff",
  "@media (max-width: 640px)": { fontSize: "1.8rem" },
});

const headingBase = css({
  position: "relative",
  color: "#ffffff",
  letterSpacing: "-0.01em",
  scrollMarginTop: "6rem",
  "& .anchor": {
    marginLeft: "0.5rem",
    color: "#55555e",
    textDecoration: "none",
    opacity: 0,
    transition: "opacity 0.2s ease, color 0.2s ease",
  },
  ":hover .anchor": { opacity: 1 },
  "& .anchor:hover": { color: "#ffffff" },
});

const h2Style = css(headingBase, {
  margin: "3.25rem 0 1rem 0",
  paddingTop: "2rem",
  borderTop: "1px solid rgb(36, 36, 43)",
  fontSize: "1.5rem",
  fontWeight: 600,
  lineHeight: 1.35,
});

const h3Style = css(headingBase, {
  margin: "2.25rem 0 0.75rem 0",
  fontSize: "1.15rem",
  fontWeight: 600,
  lineHeight: 1.4,
});

const h4Style = css(headingBase, {
  margin: "1.75rem 0 0.5rem 0",
  fontSize: "1rem",
  fontWeight: 600,
});

const linkStyle = css({
  color: "#ffffff",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
  textDecorationColor: "rgb(70, 70, 80)",
  transition: "text-decoration-color 0.25s ease",
  ":hover": { textDecorationColor: "#95b4f0" },
});

const codespanStyle = css({
  fontFamily:
    'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  fontSize: "0.85em",
  padding: "0.15em 0.4em",
  borderRadius: "6px",
  backgroundColor: "rgba(255, 255, 255, 0.06)",
  border: "1px solid rgb(36, 36, 43)",
  color: "#e6e6eb",
});

const kbdStyle = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "1.6em",
  height: "1.6em",
  padding: "0 0.4em",
  margin: "0 0.1em",
  boxSizing: "border-box",
  fontFamily: "inherit",
  fontSize: "0.8em",
  fontWeight: 500,
  lineHeight: 1,
  color: "#ffffff",
  verticalAlign: "0.1em",
  borderRadius: "6px",
  border: "1px solid rgb(58, 58, 66)",
  borderBottomWidth: "2px",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
});

const listStyle = css({
  margin: "0 0 1.25rem 0",
  paddingLeft: "1.25rem",
  "& li": {
    margin: "0.4rem 0",
    lineHeight: 1.75,
    fontWeight: 300,
    paddingLeft: "0.25rem",
  },
  "& li::marker": { color: "#6b6b73" },
  "& li > p": { margin: "0.25rem 0" },
  "& li > ul, & li > ol": { marginTop: "0.4rem", marginBottom: "0.4rem" },
});

// Ordered lists read as numbered steps, the shape every tutorial step takes.
const stepsStyle = css({
  listStyle: "none",
  counterReset: "step",
  margin: "0 0 1.5rem 0",
  padding: 0,
  "& > li": {
    position: "relative",
    counterIncrement: "step",
    margin: 0,
    padding: "0 0 1.25rem 2.75rem",
    lineHeight: 1.75,
    fontWeight: 300,
  },
  "& > li::before": {
    content: "counter(step)",
    position: "absolute",
    left: 0,
    top: "0.05rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "1.75rem",
    height: "1.75rem",
    borderRadius: "50%",
    border: "1px solid rgb(58, 58, 66)",
    backgroundColor: "#16171a",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#ffffff",
  },
  // The thread that joins one step to the next.
  "& > li:not(:last-child)::after": {
    content: '""',
    position: "absolute",
    left: "calc(0.875rem - 0.5px)",
    top: "2.1rem",
    bottom: "0.3rem",
    width: "1px",
    backgroundColor: "rgb(36, 36, 43)",
  },
  "& > li:last-child": { paddingBottom: 0 },
  "& > li > p": { margin: "0 0 0.5rem 0" },
  "& > li > p:last-child": { marginBottom: 0 },
  "& > li figure": { marginTop: "0.75rem", marginBottom: "0.5rem" },
});

const figureStyle = css({
  margin: "1.5rem 0 1.75rem 0",
  "& img": {
    display: "block",
    width: "100%",
    height: "auto",
    margin: "0 auto",
    borderRadius: "12px",
    border: "1px solid rgb(36, 36, 43)",
    backgroundColor: "#16171a",
    cursor: "zoom-in",
    transition: "border-color 0.3s ease",
  },
  "& img:hover": { borderColor: "rgb(70, 70, 80)" },
  "& figcaption": {
    marginTop: "0.65rem",
    fontSize: "0.85rem",
    lineHeight: 1.6,
    color: "#8a8a8f",
    textAlign: "center",
    fontWeight: 300,
  },
});

const inlineImageStyle = css({
  display: "inline-block",
  width: "auto",
  maxWidth: "100%",
  height: "1.4em",
  verticalAlign: "middle",
});

const calloutStyle = css({
  display: "flex",
  gap: "0.85rem",
  margin: "1.5rem 0",
  padding: "1rem 1.15rem",
  borderRadius: "12px",
  border: "1px solid rgb(36, 36, 43)",
  backgroundColor: "rgba(255, 255, 255, 0.025)",
  "& > svg": { flexShrink: 0, width: "18px", height: "18px", marginTop: "0.3rem" },
  "& p": { margin: "0 0 0.5rem 0", fontSize: "0.95rem", lineHeight: 1.7 },
  "& p:last-child": { marginBottom: 0 },
  "& ul, & ol": { marginBottom: 0 },
});

const calloutTitleStyle = css({
  display: "block",
  marginBottom: "0.2rem",
  fontSize: "0.8rem",
  fontWeight: 600,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
});

const CALLOUT_TONES = {
  tip: { color: "#7ee0a8", border: "rgba(126, 224, 168, 0.22)", icon: Lightbulb },
  note: { color: "#95b4f0", border: "rgba(149, 180, 240, 0.25)", icon: Info },
  important: { color: "#95b4f0", border: "rgba(149, 180, 240, 0.25)", icon: Info },
  warning: {
    color: "#f0c674",
    border: "rgba(240, 198, 116, 0.25)",
    icon: AlertTriangle,
  },
} as const;

const quoteStyle = css({
  margin: "1.5rem 0",
  paddingLeft: "1.15rem",
  borderLeft: "2px solid rgb(58, 58, 66)",
  color: "#bfbfc7",
});

const codeWrapStyle = css({
  position: "relative",
  margin: "1.25rem 0 1.5rem 0",
  borderRadius: "12px",
  border: "1px solid rgb(36, 36, 43)",
  backgroundColor: "#121316",
  overflow: "hidden",
});

const codeHeaderStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0.45rem 0.6rem 0.45rem 1rem",
  borderBottom: "1px solid rgb(36, 36, 43)",
  fontSize: "0.75rem",
  color: "#8a8a8f",
  letterSpacing: "0.02em",
});

const copyButtonStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  padding: "0.3rem 0.5rem",
  border: "1px solid transparent",
  borderRadius: "6px",
  background: "none",
  color: "#8a8a8f",
  fontFamily: "inherit",
  fontSize: "0.75rem",
  cursor: "pointer",
  transition: "color 0.2s ease, border-color 0.2s ease",
  ":hover": { color: "#ffffff", borderColor: "rgb(58, 58, 66)" },
  "& svg": { width: "13px", height: "13px" },
});

const preStyle = css({
  margin: 0,
  padding: "1rem 1.15rem",
  overflowX: "auto",
  fontFamily:
    'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  fontSize: "0.85rem",
  lineHeight: 1.7,
  color: "#e6e6eb",
  "::-webkit-scrollbar": { display: "none" },
});

const tableWrapStyle = css({
  margin: "1.25rem 0 1.75rem 0",
  overflowX: "auto",
  borderRadius: "12px",
  border: "1px solid rgb(36, 36, 43)",
});

const tableStyle = css({
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.9rem",
  lineHeight: 1.6,
  "& th": {
    padding: "0.7rem 1rem",
    textAlign: "left",
    fontWeight: 600,
    fontSize: "0.8rem",
    color: "#ffffff",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderBottom: "1px solid rgb(36, 36, 43)",
    whiteSpace: "nowrap",
  },
  "& td": {
    padding: "0.65rem 1rem",
    verticalAlign: "top",
    fontWeight: 300,
    color: "#d4d4da",
    borderBottom: "1px solid rgb(30, 30, 36)",
  },
  "& tr:last-child td": { borderBottom: "none" },
});

const cardGridStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "0.85rem",
  margin: "1.5rem 0 2rem 0",
  "@media (max-width: 640px)": { gridTemplateColumns: "minmax(0, 1fr)" },
});

const cardStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "0.35rem",
  padding: "1.1rem 1.2rem",
  borderRadius: "12px",
  border: "1px solid rgb(36, 36, 43)",
  textDecoration: "none",
  transition: "border-color 0.3s ease, background-color 0.3s ease",
  ":hover": {
    borderColor: "rgb(70, 70, 80)",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  ":hover svg": { transform: "translateX(3px)", color: "#ffffff" },
});

const cardTitleStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.5rem",
  fontSize: "0.98rem",
  fontWeight: 500,
  color: "#ffffff",
  "& svg": {
    width: "16px",
    height: "16px",
    color: "#6b6b73",
    transition: "transform 0.3s ease, color 0.3s ease",
  },
});

const cardTextStyle = css({
  fontSize: "0.88rem",
  lineHeight: 1.6,
  color: "#8a8a8f",
  fontWeight: 300,
});

// ---------------------------------------------------------------- pieces

function CodeBlock({ code, lang, ctx }: { code: string; lang?: string; ctx: RenderContext }) {
  const [copied, setCopied] = useState(false);
  const label =
    lang === "bash" || lang === "sh" || lang === "shell"
      ? ui(ctx.lang, "terminal")
      : lang || ui(ctx.lang, "code");

  const copy = () => {
    navigator.clipboard
      ?.writeText(code)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      })
      .catch(() => {});
  };

  return (
    <div css={codeWrapStyle}>
      <div css={codeHeaderStyle}>
        <span>{label}</span>
        <button type="button" css={copyButtonStyle} onClick={copy}>
          {copied ? <Check /> : <Copy />}
          {copied ? ui(ctx.lang, "copied") : ui(ctx.lang, "copy")}
        </button>
      </div>
      <pre css={preStyle}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ```cards
// Title | target | description
// ```
function Cards({ source, ctx }: { source: string; ctx: RenderContext }) {
  const cards = source
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split("|").map((part) => part.trim()));

  return (
    <div css={cardGridStyle}>
      {cards.map(([title, target, text]) => (
        <SmartLink key={title} href={target} ctx={ctx} cssOverride={cardStyle}>
          <span css={cardTitleStyle}>
            {title}
            <ArrowRight />
          </span>
          {text && <span css={cardTextStyle}>{text}</span>}
        </SmartLink>
      ))}
    </div>
  );
}

function SmartLink({
  href,
  ctx,
  children,
  cssOverride,
}: {
  href: string;
  ctx: RenderContext;
  children: ReactNode;
  cssOverride?: ReturnType<typeof css>;
}) {
  const style = cssOverride ?? linkStyle;
  if (/^(https?:|mailto:)/.test(href)) {
    return (
      <a css={style} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  if (href.startsWith("#") || href.startsWith("/")) {
    return (
      <a css={style} href={href}>
        {children}
      </a>
    );
  }
  // Anything else is another page of these docs: `slug` or `slug#anchor`.
  const [slug, hash] = href.replace(/^\.\//, "").split("#");
  return (
    <Link css={style} to={`${docPath(slug)}${hash ? `#${hash}` : ""}`}>
      {children}
    </Link>
  );
}

function resolveSrc(src: string, ctx: RenderContext) {
  if (/^(https?:)?\//.test(src)) return src;
  return `${ctx.base}/${src.replace(/^\.\//, "")}`;
}

// Screenshots are captured at 2x; showing a small crop at 1.25x its CSS size
// keeps its text readable without blowing it up to the column width.
const DISPLAY_DIVISOR = 1.6;

function Figure({ token, ctx }: { token: Tokens.Image; ctx: RenderContext }) {
  const src = resolveSrc(token.href, ctx);
  const alt = decode(token.text);
  const size = ctx.sizes[token.href.split("/").pop() ?? ""];
  return (
    <figure css={figureStyle}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        width={size?.[0]}
        height={size?.[1]}
        style={
          size
            ? { maxWidth: `min(100%, ${Math.round(size[0] / DISPLAY_DIVISOR)}px)` }
            : undefined
        }
        onClick={() => ctx.onZoom(src, alt)}
      />
      {token.title && <figcaption>{decode(token.title)}</figcaption>}
    </figure>
  );
}

// ---------------------------------------------------------------- inline

function renderInline(tokens: Token[] | undefined, ctx: RenderContext): ReactNode[] {
  if (!tokens) return [];
  const out: ReactNode[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i] as Tokens.Generic;
    const key = `${i}`;
    switch (token.type) {
      case "text":
        out.push(
          token.tokens ? (
            <Fragment key={key}>{renderInline(token.tokens, ctx)}</Fragment>
          ) : (
            decode(token.text)
          ),
        );
        break;
      case "escape":
        out.push(decode(token.text));
        break;
      case "strong":
        out.push(<strong key={key}>{renderInline(token.tokens, ctx)}</strong>);
        break;
      case "em":
        out.push(<em key={key}>{renderInline(token.tokens, ctx)}</em>);
        break;
      case "del":
        out.push(<del key={key}>{renderInline(token.tokens, ctx)}</del>);
        break;
      case "codespan":
        out.push(
          <code key={key} css={codespanStyle}>
            {decode(token.text)}
          </code>,
        );
        break;
      case "br":
        out.push(<br key={key} />);
        break;
      case "link":
        out.push(
          <SmartLink key={key} href={token.href} ctx={ctx}>
            {renderInline(token.tokens, ctx)}
          </SmartLink>,
        );
        break;
      case "image":
        out.push(
          <img
            key={key}
            css={inlineImageStyle}
            src={resolveSrc(token.href, ctx)}
            alt={decode(token.text)}
          />,
        );
        break;
      case "html": {
        const raw = token.raw.trim().toLowerCase();
        // marked splits `<kbd>⌘</kbd>` into open tag, text, close tag.
        if (raw === "<kbd>") {
          const inner: Token[] = [];
          let j = i + 1;
          while (
            j < tokens.length &&
            !(tokens[j].type === "html" && tokens[j].raw.trim().toLowerCase() === "</kbd>")
          ) {
            inner.push(tokens[j]);
            j++;
          }
          out.push(
            <kbd key={key} css={kbdStyle}>
              {renderInline(inner, ctx)}
            </kbd>,
          );
          i = j;
        } else if (raw === "<br>" || raw === "<br/>" || raw === "<br />") {
          out.push(<br key={key} />);
        }
        break;
      }
      default:
        if (token.tokens) out.push(<Fragment key={key}>{renderInline(token.tokens, ctx)}</Fragment>);
        else if (typeof token.text === "string") out.push(decode(token.text));
    }
  }
  return out;
}

// ---------------------------------------------------------------- blocks

function onlyImage(tokens: Token[]): Tokens.Image | null {
  const meaningful = tokens.filter(
    (t) => !(t.type === "text" && !(t as Tokens.Text).text.trim()),
  );
  if (meaningful.length === 1 && meaningful[0].type === "image") {
    return meaningful[0] as Tokens.Image;
  }
  return null;
}

function renderBlocks(tokens: Token[], ctx: RenderContext): ReactNode[] {
  return tokens.map((token, index) => renderBlock(token, ctx, `${index}`));
}

function renderBlock(token: Token, ctx: RenderContext, key: string): ReactNode {
  const t = token as Tokens.Generic;
  switch (t.type) {
    case "space":
    case "def":
      return null;
    case "heading": {
      const heading = t as Tokens.Heading;
      const text = plainText(heading.tokens);
      const id = mintId(text, ctx.ids);
      const content = renderInline(heading.tokens, ctx);
      if (heading.depth === 1) {
        return (
          <h1 key={key} id={id} css={h1Style}>
            {content}
          </h1>
        );
      }
      const anchor = (
        <a className="anchor" href={`#${id}`} aria-label={text}>
          #
        </a>
      );
      if (heading.depth === 2)
        return (
          <h2 key={key} id={id} css={h2Style}>
            {content}
            {anchor}
          </h2>
        );
      if (heading.depth === 3)
        return (
          <h3 key={key} id={id} css={h3Style}>
            {content}
            {anchor}
          </h3>
        );
      return (
        <h4 key={key} id={id} css={h4Style}>
          {content}
        </h4>
      );
    }
    case "paragraph": {
      const paragraph = t as Tokens.Paragraph;
      const image = onlyImage(paragraph.tokens);
      if (image) return <Figure key={key} token={image} ctx={ctx} />;
      return <p key={key}>{renderInline(paragraph.tokens, ctx)}</p>;
    }
    case "text": {
      // A tight list item's body arrives as a block-level text token.
      const image = t.tokens ? onlyImage(t.tokens) : null;
      if (image) return <Figure key={key} token={image} ctx={ctx} />;
      return (
        <Fragment key={key}>
          {t.tokens ? renderInline(t.tokens, ctx) : decode(t.text)}
        </Fragment>
      );
    }
    case "list": {
      const list = t as Tokens.List;
      const items = list.items.map((item, i) => (
        <li key={i}>{renderBlocks(item.tokens, ctx)}</li>
      ));
      // A list interrupted by an image resumes at its own number, which the
      // CSS counter has to be told about.
      const start = typeof list.start === "number" ? list.start : 1;
      return list.ordered ? (
        <ol key={key} css={stepsStyle} style={{ counterReset: `step ${start - 1}` }}>
          {items}
        </ol>
      ) : (
        <ul key={key} css={listStyle}>
          {items}
        </ul>
      );
    }
    case "blockquote": {
      const quote = t as Tokens.Blockquote;
      const match = quote.text.match(CALLOUT);
      if (match) {
        const kind = match[1].toLowerCase() as keyof typeof CALLOUT_TONES;
        const tone = CALLOUT_TONES[kind];
        const Icon = tone.icon;
        const body = lex(quote.text.replace(CALLOUT, ""));
        return (
          <div
            key={key}
            css={calloutStyle}
            style={{ borderColor: tone.border }}
          >
            <Icon color={tone.color} />
            <div>
              <span css={calloutTitleStyle} style={{ color: tone.color }}>
                {ui(ctx.lang, kind)}
              </span>
              {renderBlocks(body, ctx)}
            </div>
          </div>
        );
      }
      return (
        <blockquote key={key} css={quoteStyle}>
          {renderBlocks(quote.tokens, ctx)}
        </blockquote>
      );
    }
    case "code": {
      const code = t as Tokens.Code;
      if (code.lang === "cards") return <Cards key={key} source={code.text} ctx={ctx} />;
      return <CodeBlock key={key} code={code.text} lang={code.lang} ctx={ctx} />;
    }
    case "table": {
      const table = t as Tokens.Table;
      return (
        <div key={key} css={tableWrapStyle}>
          <table css={tableStyle}>
            <thead>
              <tr>
                {table.header.map((cell, i) => (
                  <th key={i} style={{ textAlign: cell.align ?? undefined }}>
                    {renderInline(cell.tokens, ctx)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c} style={{ textAlign: cell.align ?? undefined }}>
                      {renderInline(cell.tokens, ctx)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case "hr":
      return <hr key={key} />;
    case "html":
      return null;
    default:
      return null;
  }
}

export function DocMarkdown({
  tokens,
  lang,
  base,
  sizes,
  onZoom,
}: {
  tokens: Token[];
  lang: Lang;
  base: string;
  sizes: ImageSizes;
  onZoom: (src: string, alt: string) => void;
}) {
  const ctx: RenderContext = { lang, base, sizes, onZoom, ids: new Map() };
  return <div css={proseStyle}>{renderBlocks(tokens, ctx)}</div>;
}
