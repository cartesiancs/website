/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";

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

const pageStyle = css({
  display: "flex",
  minHeight: "100%",
  width: "100%",
  flexDirection: "column",
  alignItems: "center",
});

const contentStyle = css({
  width: "100%",
  maxWidth: "720px",
  padding: "8rem 2rem 20rem 2rem",
  boxSizing: "border-box",
  "@media (max-width: 640px)": {
    padding: "7rem 1.5rem 6rem 1.5rem",
  },
});

const titleStyle = css({
  margin: 0,
  fontSize: "clamp(2rem, 5vw, 2.75rem)",
  fontWeight: 600,
  letterSpacing: "-0.03em",
  color: "#ffffff",
});

const introStyle = css({
  margin: "1rem 0 2rem 0",
  fontSize: "1rem",
  lineHeight: 1.7,
  color: "#8a8a8f",
  fontWeight: 200,
});

const listStyle = css({
  listStyle: "none",
  margin: 0,
  padding: 0,
  borderTop: "1px solid rgb(36, 36, 43)",
});

const rowStyle = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
  padding: "1.5rem 0.5rem",
  borderBottom: "1px solid rgb(36, 36, 43)",
  textDecoration: "none",
  transition: "background-color 0.3s ease, padding-left 0.3s ease",
  ":hover": {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    paddingLeft: "1rem",
  },
  ":hover svg": {
    opacity: 1,
    transform: "translateX(0)",
  },
});

const rowNameStyle = css({
  fontSize: "1.15rem",
  fontWeight: 500,
  color: "#ffffff",
});

const rowMetaStyle = css({
  marginTop: "0.3rem",
  fontSize: "0.85rem",
  color: "#8a8a8f",
});

const rowIconStyle = css({
  width: "18px",
  height: "18px",
  flexShrink: 0,
  color: "#bfbfc7",
  opacity: 0,
  transform: "translateX(-5px)",
  transition: "opacity 0.3s ease, transform 0.3s ease",
});

const emptyStyle = css({
  margin: 0,
  padding: "1.5rem 0.5rem",
  borderTop: "1px solid rgb(36, 36, 43)",
  borderBottom: "1px solid rgb(36, 36, 43)",
  fontSize: "0.95rem",
  color: "#8a8a8f",
});

export function Research() {
  return (
    <div css={pageStyle}>
      <TopNavBar />

      <div css={contentStyle}>
        <h1 css={titleStyle}>Research</h1>
        <p css={introStyle}>Papers, notes and experiments from our work.</p>

        {entries.length === 0 ? (
          <p css={emptyStyle}>Nothing published yet.</p>
        ) : (
          <ul css={listStyle}>
            {entries.map((entry) => (
              <li key={entry.slug}>
                <Link css={rowStyle} to={`/research/${entry.slug}`}>
                  <div>
                    <div css={rowNameStyle}>{entry.title}</div>
                    <div css={rowMetaStyle}>{entry.meta}</div>
                  </div>
                  <ArrowRight css={rowIconStyle} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Footer />
    </div>
  );
}
