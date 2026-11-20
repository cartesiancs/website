/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ArrowRight } from "lucide-react";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";
import { FrameLines } from "../components/FrameLines";
import {
  DATA,
  MONO,
  MUTED,
  ServerSignature,
  SiteLink,
  TypedTitle,
  articleStyle,
  frameColumnStyle,
  headerStyle,
  hrStyle,
  linkStyle,
  mainStyle,
  pageStyle,
  proseStyle,
  typed,
  useTyping,
} from "../components/EarlyWeb";

type ResearchEntry = {
  // The markdown file's name in public/docs/research, without ".md". It is
  // also the page's URL: /research/<slug>.
  slug: string;
  title: string;
  // The line under the title, e.g. "2026-11 · Networking".
  meta: string;
};

// Newest first. To publish one, add public/docs/research/<slug>.md and list
// it here.
const entries: ResearchEntry[] = [];

const TITLE = "Research";

const introStyle = css({
  marginBottom: "0.75rem",
  p: {
    color: MUTED,
  },
});

const listStyle = css({
  listStyle: "none",
  margin: 0,
  padding: 0,
  fontFamily: MONO,
  fontSize: "0.8125rem",
  lineHeight: 1.7,
  color: DATA,
  "@media (max-width: 640px)": {
    fontSize: "0.75rem",
  },
});

// Title, then its meta line; on narrow screens the meta drops under it.
const rowStyle = css({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  alignItems: "baseline",
  columnGap: "2rem",
  padding: "0.3rem 0",
  ":hover .row-arrow": {
    opacity: 1,
  },
  "@media (max-width: 640px)": {
    gridTemplateColumns: "minmax(0, 1fr)",
  },
});

const rowNameStyle = css({
  minWidth: 0,
  overflowWrap: "anywhere",
});

const rowMetaStyle = css({
  color: MUTED,
  whiteSpace: "nowrap",
});

const rowIconStyle = css({
  width: "12px",
  height: "12px",
  marginLeft: "0.3rem",
  verticalAlign: "-0.05em",
  opacity: 0,
  transition: "opacity 0.2s ease",
});

const emptyStyle = css({
  margin: 0,
  padding: "0.3rem 0",
  fontFamily: MONO,
  fontSize: "0.8125rem",
  lineHeight: 1.7,
  color: MUTED,
  "@media (max-width: 640px)": {
    fontSize: "0.75rem",
  },
});

const signatureStyle = css({
  paddingTop: "0.5rem",
  paddingBottom: "12rem",
  "@media (max-width: 640px)": {
    paddingTop: "0.5rem",
    paddingBottom: "8rem",
  },
});

export function Research() {
  const typedChars = useTyping(TITLE);
  const shown = typedChars >= TITLE.length;

  // Every line below the title types in after the one before it, in page
  // order.
  let count = 0;
  const line = () => typed(shown, count++);
  const intro = line();
  const topRule = line();
  // The list's rows, or the empty note in their place.
  const listLines = entries.length ? entries.map(() => line()) : [line()];
  const bottomRule = line();
  const signature = line();

  return (
    <div css={pageStyle}>
      <TopNavBar />

      <main css={mainStyle}>
        <FrameLines />

        <article css={[frameColumnStyle, headerStyle, articleStyle]}>
          <TypedTitle text={TITLE} count={typedChars} />
          <div css={[proseStyle, introStyle]}>
            <p css={intro.css} style={intro.style}>
              Papers, notes and experiments from our work.
            </p>
          </div>

          <hr css={[hrStyle, topRule.css]} style={topRule.style} />
          {entries.length === 0 ? (
            <p
              css={[emptyStyle, listLines[0].css]}
              style={listLines[0].style}
            >
              Nothing published yet.
            </p>
          ) : (
            <ul css={listStyle}>
              {entries.map((entry, index) => (
                <li
                  key={entry.slug}
                  css={[rowStyle, listLines[index].css]}
                  style={listLines[index].style}
                >
                  <span css={rowNameStyle}>
                    <SiteLink href={`/research/${entry.slug}`} css={linkStyle}>
                      {entry.title}
                      <ArrowRight className="row-arrow" css={rowIconStyle} />
                    </SiteLink>
                  </span>
                  <span css={rowMetaStyle}>{entry.meta}</span>
                </li>
              ))}
            </ul>
          )}
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
