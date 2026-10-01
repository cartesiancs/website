import type { Token } from "marked";
import { extractHeadings, lex, plainText, type Heading, type ImageSizes } from "./markdown";
import { PAGES, sourceFolder, type Lang } from "./manifest";

export type LoadedDoc = {
  tokens: Token[];
  headings: Heading[];
};

const cache = new Map<string, Promise<LoadedDoc | null>>();

// A missing file on a single-page host comes back as the app's index.html with
// a 200, so the body is checked rather than the status alone.
function looksLikeHtml(text: string) {
  const head = text.trimStart().slice(0, 32).toLowerCase();
  return head.startsWith("<!doctype") || head.startsWith("<html");
}

export function loadDoc(lang: Lang, slug: string): Promise<LoadedDoc | null> {
  const key = `${lang}/${slug}`;
  let pending = cache.get(key);
  if (!pending) {
    pending = fetch(`${sourceFolder(lang)}/${slug}.md`)
      .then((res) => (res.ok ? res.text() : null))
      .then((text) => {
        if (text === null || looksLikeHtml(text)) return null;
        const tokens = lex(text);
        return { tokens, headings: extractHeadings(tokens) };
      })
      .catch(() => null);
    // A failed request is not cached, so a flaky connection can retry.
    pending.then((doc) => {
      if (!doc) cache.delete(key);
    });
    cache.set(key, pending);
  }
  return pending;
}

const sizeCache = new Map<Lang, Promise<ImageSizes>>();

// Optional: without it images still show, just without reserved space.
export function loadImageSizes(lang: Lang): Promise<ImageSizes> {
  let pending = sizeCache.get(lang);
  if (!pending) {
    pending = fetch(`${sourceFolder(lang)}/img/sizes.json`)
      .then((res) => (res.ok ? res.json() : {}))
      .catch(() => ({}));
    sizeCache.set(lang, pending);
  }
  return pending;
}

export type SearchSection = {
  slug: string;
  pageTitle: string;
  heading: string;
  // Empty for the part of a page above its first subheading.
  anchor: string;
  text: string;
};

function blockText(token: Token): string {
  const t = token as Token & { tokens?: Token[]; items?: { tokens: Token[] }[] };
  switch (t.type) {
    case "paragraph":
    case "text":
    case "blockquote":
      return plainText(t.tokens).replace(/\[!(TIP|NOTE|WARNING|IMPORTANT)\]/gi, "");
    case "list":
      return (t.items ?? []).map((item) => item.tokens.map(blockText).join(" ")).join(" ");
    case "table": {
      const table = token as Token & {
        header: { tokens: Token[] }[];
        rows: { tokens: Token[] }[][];
      };
      return [table.header, ...table.rows]
        .map((row) => row.map((cell) => plainText(cell.tokens)).join(" "))
        .join(" ");
    }
    case "code":
      return (token as Token & { text: string; lang?: string }).lang === "cards"
        ? (token as Token & { text: string }).text.replace(/\|/g, " ")
        : (token as Token & { text: string }).text;
    default:
      return "";
  }
}

export async function loadSearchIndex(lang: Lang): Promise<SearchSection[]> {
  const docs = await Promise.all(PAGES.map((p) => loadDoc(lang, p.slug)));
  const sections: SearchSection[] = [];
  docs.forEach((doc, index) => {
    if (!doc) return;
    const page = PAGES[index];
    const pageTitle = page.title[lang];
    let headingIndex = 0;
    let current: SearchSection = {
      slug: page.slug,
      pageTitle,
      heading: pageTitle,
      anchor: "",
      text: "",
    };
    const flush = () => {
      current.text = current.text.replace(/\s+/g, " ").trim();
      sections.push(current);
    };
    for (const token of doc.tokens) {
      if (token.type === "heading") {
        const depth = (token as Token & { depth: number }).depth;
        if (depth === 2 || depth === 3) {
          const heading = doc.headings[headingIndex++];
          flush();
          current = {
            slug: page.slug,
            pageTitle,
            heading: heading?.text ?? "",
            anchor: heading?.id ?? "",
            text: "",
          };
        }
        continue;
      }
      current.text += ` ${blockText(token)}`;
    }
    flush();
  });
  return sections;
}
