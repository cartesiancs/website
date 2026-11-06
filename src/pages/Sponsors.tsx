/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { css, keyframes } from "@emotion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";
import { TextReveal } from "../components/TextReveal";
import {
  GITHUB_SPONSORS_URL,
  HALL_OF_FAME,
  type Sponsor,
} from "../features/sponsors/hallOfFame";

const SCRIPT_FONT = '"Playball", "Snell Roundhand", cursive';

const pageStyle = css({
  width: "100%",
  minHeight: "100%",
  display: "flex",
  flexDirection: "column",
});

// Same column as the About page.
const mainStyle = css({
  flex: 1,
  width: "100%",
  maxWidth: "600px",
  margin: "0 auto",
  padding: "7.5rem 2rem 10rem",
  boxSizing: "border-box",
  "@media (max-width: 600px)": {
    padding: "4.5rem 1rem 6rem",
  },
});

// Matches the Playball page titles on About and Products.
const titleStyle = css({
  margin: "0 0 3rem 0",
  fontFamily: SCRIPT_FONT,
  fontWeight: 400,
  fontSize: "clamp(3.5rem, 14vw, 6rem)",
  lineHeight: 1.25,
  color: "#ffffff",
  textAlign: "center",
  whiteSpace: "nowrap",
  "@media (max-width: 600px)": {
    marginBottom: "2rem",
  },
});

const introStyle = css({
  "& p": {
    margin: "0 0 1rem 0",
  },
  "& strong": {
    color: "#ffffff",
    fontWeight: 500,
  },
  "& a": {
    color: "#ffffff",
    textUnderlineOffset: "3px",
  },
});

const ctaStyle = css({
  marginTop: "2.5rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.9rem",
});

const sponsorButtonStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.85rem 1.6rem",
  borderRadius: "999px",
  backgroundColor: "#ffffff",
  color: "#0d0e0f",
  fontSize: "0.95rem",
  fontWeight: 600,
  textDecoration: "none",
  transition: "background-color 0.3s ease",
  "& svg": {
    width: "16px",
    height: "16px",
    transition: "transform 0.3s ease",
  },
  ":hover": {
    backgroundColor: "#e6e6eb",
  },
  ":hover svg": {
    transform: "translateX(3px)",
  },
  ":focus-visible": {
    outline: "2px solid #d9dae1",
    outlineOffset: "3px",
  },
});

const ctaNoteStyle = css({
  margin: 0,
  fontSize: "0.8rem",
  color: "#8a8a8f",
});

const hallHeaderStyle = css({
  margin: "7rem 0 2rem 0",
  "@media (max-width: 600px)": {
    marginTop: "5rem",
  },
});

const hallTitleStyle = css({
  margin: 0,
  fontFamily: SCRIPT_FONT,
  fontWeight: 400,
  fontSize: "clamp(2.5rem, 9vw, 3.5rem)",
  lineHeight: 1.25,
  color: "#ffffff",
  textAlign: "center",
});

const hallNoteStyle = css({
  margin: "0.5rem 0 0 0",
  fontSize: "0.85rem",
  color: "#8a8a8f",
  textAlign: "center",
});

const listStyle = css({
  listStyle: "none",
  margin: 0,
  padding: 0,
  borderTop: "1px solid rgb(36, 36, 43)",
});

const rowFadeIn = keyframes`
  from {
    opacity: 0;
  }
`;

const rowStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  padding: "1.1rem 0.5rem",
  borderBottom: "1px solid rgb(36, 36, 43)",
  textDecoration: "none",
  animation: `${rowFadeIn} 0.6s ease-out backwards`,
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
});

const rowLinkStyle = css({
  transition: "background-color 0.3s ease, padding-left 0.3s ease",
  ":hover": {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    paddingLeft: "1rem",
  },
  ":hover .row-arrow": {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  ":focus-visible": {
    outline: "2px solid #d9dae1",
    outlineOffset: "-2px",
  },
});

const rankStyle = css({
  width: "2ch",
  flexShrink: 0,
  fontSize: "0.85rem",
  fontVariantNumeric: "tabular-nums",
  color: "#5c5c63",
});

const avatarStyle = css({
  width: "40px",
  height: "40px",
  flexShrink: 0,
  borderRadius: "50%",
  backgroundColor: "#1a1a1f",
  objectFit: "cover",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1rem",
  fontWeight: 600,
  color: "#bfbfc7",
});

const nameBlockStyle = css({
  flex: 1,
  minWidth: 0,
});

// Names wrap rather than truncate: the full name is the point of the list.
const nameStyle = css({
  fontSize: "1.05rem",
  fontWeight: 500,
  lineHeight: 1.35,
  color: "#ffffff",
  overflowWrap: "anywhere",
});

const metaStyle = css({
  marginTop: "0.2rem",
  fontSize: "0.8rem",
  color: "#8a8a8f",
  overflowWrap: "anywhere",
});

const rowArrowStyle = css({
  width: "16px",
  height: "16px",
  flexShrink: 0,
  color: "#bfbfc7",
  opacity: 0,
  transform: "translate(-4px, 4px)",
  transition: "opacity 0.3s ease, transform 0.3s ease",
});

const emptyStyle = css({
  margin: 0,
  padding: "2rem 0.5rem",
  borderBottom: "1px solid rgb(36, 36, 43)",
  fontSize: "0.9rem",
  color: "#8a8a8f",
  textAlign: "center",
});

// "2026-11" -> "Nov 2026". Read as UTC so the month never shifts with the
// viewer's time zone.
function formatSince(since: string) {
  const [year, month] = since.split("-").map(Number);
  if (!year || !month) return since;
  return new Date(Date.UTC(year, month - 1)).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function SponsorRow({ sponsor, rank }: { sponsor: Sponsor; rank: number }) {
  const href =
    sponsor.url ??
    (sponsor.github ? `https://github.com/${sponsor.github}` : undefined);

  const content = (
    <>
      <span css={rankStyle}>{String(rank).padStart(2, "0")}</span>
      {sponsor.github ? (
        <img
          css={avatarStyle}
          src={`https://github.com/${sponsor.github}.png?size=96`}
          alt=""
          loading="lazy"
        />
      ) : (
        <span css={avatarStyle} aria-hidden>
          {sponsor.name.charAt(0).toUpperCase()}
        </span>
      )}
      <div css={nameBlockStyle}>
        <div css={nameStyle}>{sponsor.name}</div>
        <div css={metaStyle}>
          {sponsor.github && `@${sponsor.github} · `}Since{" "}
          {formatSince(sponsor.since)}
        </div>
      </div>
      {href && <ArrowUpRight className="row-arrow" css={rowArrowStyle} />}
    </>
  );

  const style = { animationDelay: `${Math.min(rank, 20) * 60}ms` };

  return (
    <li>
      {href ? (
        <a
          css={[rowStyle, rowLinkStyle]}
          style={style}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      ) : (
        <div css={rowStyle} style={style}>
          {content}
        </div>
      )}
    </li>
  );
}

export function Sponsors() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Sponsors | cartesiancs";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div css={pageStyle}>
      <TopNavBar />

      <main css={mainStyle}>
        <h1 css={titleStyle}>
          <TextReveal>Sponsors</TextReveal>
        </h1>

        <div css={introStyle}>
          <TextReveal>
            <p>
              Every sponsor is listed in the Hall of Fame below, and stays there
              for good. Investors and makers visit this page regularly, so your
              name is seen by the people building what comes next.
            </p>
            <p>
              If you would rather invest than sponsor, write to us at{" "}
              <a href="mailto:info@cartesiancs.com">info@cartesiancs.com</a>.
            </p>
          </TextReveal>
        </div>

        <div css={ctaStyle}>
          <a
            css={sponsorButtonStyle}
            href={GITHUB_SPONSORS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Sponsor on GitHub
            <ArrowRight />
          </a>
        </div>

        <section aria-labelledby="hall-of-fame">
          <header css={hallHeaderStyle}>
            <h2 id="hall-of-fame" css={hallTitleStyle}>
              Hall of Fame
            </h2>
            {HALL_OF_FAME.length > 0 && (
              <p css={hallNoteStyle}>In the order they joined.</p>
            )}
          </header>
          {HALL_OF_FAME.length > 0 ? (
            <ol css={listStyle}>
              {HALL_OF_FAME.map((sponsor, index) => (
                <SponsorRow
                  key={`${sponsor.github ?? sponsor.name}-${index}`}
                  sponsor={sponsor}
                  rank={index + 1}
                />
              ))}
            </ol>
          ) : (
            <div css={listStyle}>
              <p css={emptyStyle}>
                No sponsors yet. The first name here could be yours.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
