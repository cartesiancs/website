/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Markdown from "marked-react";
import { marked } from "marked";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";
import { FrameLines } from "../components/FrameLines";
import {
  ParentDirectory,
  ServerSignature,
  TypedTitle,
  articleStyle,
  documentStyle,
  frameColumnStyle,
  headerStyle,
  hrStyle,
  mainStyle,
  metaLineStyle,
  pageStyle,
  proseStyle,
  titleWithMetaStyle,
  typed,
  useTypedChildren,
  useTyping,
} from "../components/EarlyWeb";

type PostProps = {
  // The folder under public/docs that holds the markdown files.
  folder: string;
  // The listing the [UP] link goes back to.
  parent: string;
  // The monospace line under the title, looked up by the post's slug.
  meta?: (slug: string) => string | undefined;
};

type Status = "loading" | "ready" | "missing";

// Children past this many type in together (see useTypedChildren).
const MAX_TYPED_BLOCKS = 40;

const NOT_FOUND = {
  title: "Not Found",
  text: "The post you are looking for does not exist or is unavailable.",
};

// The file's leading "# " heading becomes the typed page title; the rest is
// the body.
function splitTitle(markdown: string) {
  const match = markdown.match(/^\s*#\s+(.+?)[ \t]*(?:\r?\n|$)/);
  if (!match) return { title: "", body: markdown };
  return { title: match[1], body: markdown.slice(match[0].length) };
}

const bodyStyle = css({
  padding: "0.75rem 0 0.5rem",
});

const signatureStyle = css({
  paddingTop: "0.5rem",
});

export default function Post({ folder, parent, meta }: PostProps) {
  const { slug = "" } = useParams();
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setContent("");

    fetch(`/docs/${folder}/${slug}.md`)
      .then((response) => {
        // A missing file comes back as the app's index.html, not a 404.
        const isHtml = response.headers
          .get("content-type")
          ?.includes("text/html");
        if (!response.ok || isHtml) throw new Error("Post not found");
        return response.text();
      })
      .then((text) => {
        if (cancelled) return;
        setContent(text);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("missing");
      });

    return () => {
      cancelled = true;
    };
  }, [folder, slug]);

  const split = splitTitle(content);
  const title =
    status === "missing"
      ? NOT_FOUND.title
      : status === "ready"
        ? split.title || slug
        : "";
  const metaText = status === "ready" ? meta?.(slug) : undefined;

  useEffect(() => {
    if (!title) return;
    const previousTitle = document.title;
    document.title = `${title} | cartesiancs`;
    return () => {
      document.title = previousTitle;
    };
  }, [title]);

  // Until the file arrives, only the cursor shows.
  const typedChars = useTyping(title);
  const shown = title !== "" && typedChars >= title.length;

  // Every line below the title types in after the one before it, in page
  // order. The body's blocks are counted from the markdown, since its
  // elements are rendered by the markdown library.
  const blockCount =
    status === "ready"
      ? marked.lexer(split.body).filter((token) => token.type !== "space")
          .length
      : 1;
  let count = 0;
  const line = () => typed(shown, count++);
  const up = line();
  const metaLine = line();
  const topRule = line();
  const bodyStart = count;
  count += Math.min(blockCount, MAX_TYPED_BLOCKS + 1);
  const bottomRule = line();
  const signature = line();
  const body = useTypedChildren<HTMLDivElement>(
    shown,
    bodyStart,
    MAX_TYPED_BLOCKS,
  );

  return (
    <div css={pageStyle}>
      <TopNavBar />

      <main css={mainStyle}>
        <FrameLines />

        <article css={[frameColumnStyle, headerStyle, articleStyle]}>
          <ParentDirectory href={parent} css={up.css} style={up.style} />

          <TypedTitle
            text={title}
            count={typedChars}
            css={metaText ? titleWithMetaStyle : undefined}
          />
          {metaText && (
            <p css={[metaLineStyle, metaLine.css]} style={metaLine.style}>
              {metaText}
            </p>
          )}
          <hr css={[hrStyle, topRule.css]} style={topRule.style} />

          <div
            ref={body.ref}
            css={[proseStyle, documentStyle, bodyStyle, body.css]}
          >
            {status === "ready" && <Markdown>{split.body}</Markdown>}
            {status === "missing" && <p>{NOT_FOUND.text}</p>}
          </div>

          <hr css={[hrStyle, bottomRule.css]} style={bottomRule.style} />
        </article>

        <div css={signature.css} style={signature.style}>
          <ServerSignature css={signatureStyle} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
