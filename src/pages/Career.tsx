/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";

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
  marginBottom: "2rem",
});

const introStyle = css({
  marginTop: "1rem",
  marginBottom: 0,
  fontSize: "1rem",
  lineHeight: 1.7,
  color: "#8a8a8f",
  fontWeight: 200,
});

const listTitleStyle = css({
  margin: "3.5rem 0 1rem 0",
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#8a8a8f",
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

export function Career() {
  return (
    <div css={pageStyle}>
      <TopNavBar />

      <div css={contentStyle}>
        <h1 css={titleStyle}>Careers</h1>

        <ul css={listStyle}>
          <li>
            <Link css={rowStyle} to="/career/product-engineer">
              <div>
                <div css={rowNameStyle}>Product Engineer</div>
                <div css={rowMetaStyle}>Engineering · Full-time · Remote</div>
              </div>
              <ArrowRight css={rowIconStyle} />
            </Link>
          </li>
        </ul>
      </div>

      <Footer />
    </div>
  );
}
