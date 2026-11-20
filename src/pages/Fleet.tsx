/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Fragment, useEffect, useState, type ReactNode } from "react";
import { marked, type Token, type Tokens } from "marked";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";
import { FrameLines } from "../components/FrameLines";
import {
  ServerSignature,
  SiteLink,
  TypedTitle,
  articleStyle,
  frameColumnStyle,
  headerStyle,
  headingStyle,
  hrStyle,
  iconCellStyle,
  linkStyle,
  listingRowStyle,
  listingStyle,
  mainStyle,
  pageStyle,
  proseStyle,
  typed,
  useTyping,
} from "../components/EarlyWeb";

// The page's text lives in public/docs/fleet.md. Its "# " heading is the
// title, and a paragraph made only of links is shown as a directory listing.

type Block =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; tokens: Token[] }
  | { kind: "listing"; links: Tokens.Link[] };

function parse(markdown: string) {
  let title = "";
  const blocks: Block[] = [];

  for (const token of marked.lexer(markdown)) {
    if (token.type === "heading") {
      if (token.depth === 1 && !title) title = token.text;
      else blocks.push({ kind: "heading", text: token.text });
    } else if (token.type === "paragraph") {
      const inline = token.tokens ?? [];
      const links = inline.filter(
        (t): t is Tokens.Link => t.type === "link",
      );
      const onlyLinks =
        links.length > 0 &&
        inline.every(
          (t) =>
            t.type === "link" ||
            t.type === "br" ||
            (t.type === "text" && !t.raw.trim()),
        );
      blocks.push(
        onlyLinks
          ? { kind: "listing", links }
          : { kind: "paragraph", tokens: inline },
      );
    }
  }

  return { title, blocks };
}

function renderInline(tokens: Token[]): ReactNode[] {
  return tokens.map((token, i) => {
    switch (token.type) {
      case "link":
        return (
          <SiteLink key={i} href={token.href} css={linkStyle}>
            {renderInline(token.tokens ?? [])}
          </SiteLink>
        );
      case "strong":
        return <strong key={i}>{renderInline(token.tokens ?? [])}</strong>;
      case "em":
        return <em key={i}>{renderInline(token.tokens ?? [])}</em>;
      case "codespan":
        return <code key={i}>{token.text}</code>;
      case "br":
        return <br key={i} />;
      case "text":
        return token.tokens ? (
          <Fragment key={i}>{renderInline(token.tokens)}</Fragment>
        ) : (
          token.text
        );
      default:
        return token.raw;
    }
  });
}

// File icon, then the link.
const listingColumnsStyle = css({
  gridTemplateColumns: "5ch minmax(0, 1fr)",
});

const listingHeadingStyle = css({
  marginBottom: "0.75rem",
});

const signatureStyle = css({
  paddingTop: "0.5rem",
});

export function Fleet() {
  const [content, setContent] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/docs/fleet.md")
      .then((response) => response.text())
      .then((text) => {
        if (!cancelled) setContent(text);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const { title, blocks } = parse(content);
  // Until the file arrives, only the cursor shows.
  const typedChars = useTyping(title);
  const shown = title !== "" && typedChars >= title.length;

  // Every line below the title types in after the one before it, in page
  // order.
  let count = 0;
  const line = () => typed(shown, count++);

  const body = blocks.map((block, index) => {
    if (block.kind === "heading") {
      const next = blocks[index + 1];
      const l = line();
      return (
        <h2
          key={index}
          css={[
            headingStyle,
            next?.kind === "listing" && listingHeadingStyle,
            l.css,
          ]}
          style={l.style}
        >
          {block.text}
        </h2>
      );
    }

    if (block.kind === "paragraph") {
      const l = line();
      return (
        <div key={index} css={proseStyle}>
          <p css={l.css} style={l.style}>
            {renderInline(block.tokens)}
          </p>
        </div>
      );
    }

    const topRule = line();
    const rows = block.links.map(() => line());
    const bottomRule = line();
    return (
      <div key={index} css={listingStyle} role="table" aria-label={title}>
        <hr css={[hrStyle, topRule.css]} style={topRule.style} />
        {block.links.map((link, i) => (
          <div
            key={link.href}
            css={[listingRowStyle, listingColumnsStyle, rows[i].css]}
            style={rows[i].style}
            role="row"
          >
            <span css={iconCellStyle} role="cell">
              [DIR]
            </span>
            <span role="cell">
              <SiteLink href={link.href} css={linkStyle}>
                {renderInline(link.tokens ?? [])}
              </SiteLink>
            </span>
          </div>
        ))}
        <hr css={[hrStyle, bottomRule.css]} style={bottomRule.style} />
      </div>
    );
  });

  const signature = line();

  return (
    <div css={pageStyle}>
      <TopNavBar />

      <main css={mainStyle}>
        <FrameLines />

        <article css={[frameColumnStyle, headerStyle, articleStyle]}>
          <TypedTitle text={title} count={typedChars} />
          {body}
        </article>

        <div css={signature.css} style={signature.style}>
          <ServerSignature css={signatureStyle} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
