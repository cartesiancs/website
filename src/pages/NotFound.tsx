/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { css } from "@emotion/react";
import { Link, useLocation } from "react-router-dom";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";
import { TextReveal } from "../components/TextReveal";

const SCRIPT_FONT = '"Playball", "Snell Roundhand", cursive';

const pageStyle = css({
  width: "100%",
  minHeight: "100%",
  display: "flex",
  flexDirection: "column",
});

// Same column as the About page, so the 404 reads like the rest of the site.
const mainStyle = css({
  flex: 1,
  width: "100%",
  maxWidth: "600px",
  margin: "0 auto",
  padding: "7.5rem 2rem 10rem",
  boxSizing: "border-box",
  "@media (max-width: 600px)": {
    padding: "4.5rem 1.5rem 6rem",
  },
});

// Matches the Playball page titles on About and Products.
const titleStyle = css({
  margin: "0 0 3.5rem 0",
  fontFamily: SCRIPT_FONT,
  fontWeight: 400,
  fontSize: "clamp(3.5rem, 14vw, 6rem)",
  lineHeight: 1.25,
  color: "#ffffff",
  textAlign: "center",
  whiteSpace: "nowrap",
  "@media (max-width: 600px)": {
    marginBottom: "2.5rem",
  },
});

const bodyStyle = css({
  "& p": {
    margin: "0 0 1rem 0",
  },
  "& code": {
    color: "#ffffff",
    overflowWrap: "anywhere",
  },
  "& a": {
    color: "#ffffff",
    textUnderlineOffset: "3px",
  },
});

export function NotFound() {
  const { pathname } = useLocation();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Page not found | cartesiancs";

    // The SPA fallback answers unknown URLs with 200, so tell crawlers not to
    // index this soft 404.
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.appendChild(robots);

    return () => {
      document.title = previousTitle;
      robots.remove();
    };
  }, []);

  return (
    <div css={pageStyle}>
      <TopNavBar />

      <main css={mainStyle}>
        <h1 css={titleStyle}>
          <TextReveal>Not found</TextReveal>
        </h1>

        <div css={bodyStyle}>
          <TextReveal>
            <p>
              There is no page at <code>{pathname}</code>. It may have moved, or
              the address may have a typo.
            </p>
            <p>
              You can start again from the <Link to="/">home page</Link>, look
              through <Link to="/product">our products</Link>, or see{" "}
              <Link to="/career">open roles</Link>.
            </p>
            <p>
              If a link on this site brought you here, tell us at{" "}
              <a href="mailto:info@cartesiancs.com">info@cartesiancs.com</a> and
              we will fix it.
            </p>
          </TextReveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
