/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect } from "react";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";
import { FrameLines } from "../components/FrameLines";
import {
  MUTED,
  ServerSignature,
  SiteLink,
  TypedTitle,
  articleStyle,
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
import { BLOG_POSTS, formatPostDate } from "../features/blog/posts";

// The blog's index: every post as a row of a directory listing, newest first.

const TITLE = "Index of /blog";

// Icon, date, then the title with its summary under it.
const listingColumnsStyle = css({
  gridTemplateColumns: "5ch 11ch minmax(0, 1fr)",
  padding: "0.15rem 0",
});

const titleCellStyle = css({
  minWidth: 0,
  overflowWrap: "anywhere",
});

const summaryStyle = css({
  display: "block",
  color: MUTED,
});

const signatureStyle = css({
  paddingTop: "0.5rem",
  paddingBottom: "12rem",
  "@media (max-width: 640px)": {
    paddingTop: "0.5rem",
    paddingBottom: "8rem",
  },
});

export function Blog() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Blog | cartesiancs";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const typedChars = useTyping(TITLE);
  const shown = typedChars >= TITLE.length;

  // Every line below the title types in after the one before it, in page
  // order.
  let count = 0;
  const line = () => typed(shown, count++);
  const head = line();
  const topRule = line();
  const up = line();
  const rows = BLOG_POSTS.map(() => line());
  const bottomRule = line();
  const signature = line();

  const rowCss = [listingRowStyle, listingColumnsStyle];

  return (
    <div css={pageStyle}>
      <TopNavBar />

      <main css={mainStyle}>
        <FrameLines />

        <article css={[frameColumnStyle, headerStyle, articleStyle]}>
          <TypedTitle text={TITLE} count={typedChars} />

          <div css={listingStyle} role="table" aria-label="Blog posts">
            <div
              css={[...rowCss, listingHeadStyle, head.css]}
              style={head.style}
              role="row"
            >
              <span role="columnheader" aria-label="Type" />
              <span role="columnheader">Date</span>
              <span role="columnheader">Title</span>
            </div>
            <hr css={[hrStyle, topRule.css]} style={topRule.style} />

            <div css={[...rowCss, up.css]} style={up.style} role="row">
              <span css={iconCellStyle} role="cell">
                [UP]
              </span>
              <span role="cell" />
              <span role="cell">
                <SiteLink href="/" css={linkStyle}>
                  Parent Directory
                </SiteLink>
              </span>
            </div>

            {BLOG_POSTS.map((post, index) => (
              <div
                key={post.slug}
                css={[...rowCss, rows[index].css]}
                style={rows[index].style}
                role="row"
              >
                <span css={iconCellStyle} role="cell">
                  [TXT]
                </span>
                <span role="cell">{formatPostDate(post.date)}</span>
                <span css={titleCellStyle} role="cell">
                  <SiteLink href={`/blog/${post.slug}`} css={linkStyle}>
                    {post.title}
                  </SiteLink>
                  {post.summary && (
                    <span css={summaryStyle}>{post.summary}</span>
                  )}
                </span>
              </div>
            ))}

            <hr css={[hrStyle, bottomRule.css]} style={bottomRule.style} />
          </div>
        </article>

        <div css={signature.css} style={signature.style}>
          <ServerSignature css={signatureStyle} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
