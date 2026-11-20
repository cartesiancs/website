/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { css } from "@emotion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";
import { FrameLines } from "../components/FrameLines";
import {
  DATA,
  MONO,
  MUTED,
  ServerSignature,
  TypedTitle,
  articleStyle,
  buttonStyle,
  frameColumnStyle,
  headerStyle,
  headingStyle,
  hrStyle,
  iconCellStyle,
  linkStyle,
  mainStyle,
  pageStyle,
  proseStyle,
  typed,
  useTyping,
} from "../components/EarlyWeb";
import {
  GITHUB_SPONSORS_URL,
  HALL_OF_FAME,
  type Sponsor,
} from "../features/sponsors/hallOfFame";

const TITLE = "Sponsors";

// Rows past this many type in together, so a long list doesn't drag.
const MAX_ROW_STAGGER = 20;

const ctaStyle = css({
  marginTop: "1.5rem",
});

const hallHeadingStyle = css({
  marginTop: "4.5rem",
});

const hallNoteStyle = css({
  margin: "0 0 0.75rem",
  fontFamily: MONO,
  fontSize: "0.8125rem",
  lineHeight: 1.7,
  color: MUTED,
  "@media (max-width: 640px)": {
    fontSize: "0.75rem",
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

// Rank, avatar, name, then when they joined. On narrow screens the date
// drops under the name.
const rowStyle = css({
  display: "grid",
  gridTemplateColumns: "3ch 20px minmax(0, 1fr) auto",
  // Rank and avatar stay on the first line when a long name wraps.
  alignItems: "start",
  columnGap: "1rem",
  padding: "0.3rem 0",
  ":hover .row-arrow": {
    opacity: 1,
  },
  "@media (max-width: 640px)": {
    gridTemplateColumns: "3ch 20px minmax(0, 1fr)",
    columnGap: "0.75rem",
  },
});

// The avatar takes the place of the listing's file icon.
const avatarStyle = css({
  width: "20px",
  height: "20px",
  marginTop: "1px",
  boxSizing: "border-box",
  border: "1px solid #3a3a42",
  backgroundColor: "#1a1a1f",
  objectFit: "cover",
  imageRendering: "pixelated",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: MONO,
  fontSize: "0.6875rem",
  lineHeight: 1,
  color: "#bfbfc7",
});

// Names wrap rather than truncate: the full name is the point of the list.
const nameStyle = css({
  minWidth: 0,
  overflowWrap: "anywhere",
  color: "#ffffff",
});

const metaStyle = css({
  color: MUTED,
  textAlign: "right",
  whiteSpace: "nowrap",
  "@media (max-width: 640px)": {
    gridColumn: "3 / -1",
    textAlign: "left",
    whiteSpace: "normal",
    overflowWrap: "anywhere",
  },
});

const rowArrowStyle = css({
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

function SponsorRow({
  sponsor,
  rank,
  line,
}: {
  sponsor: Sponsor;
  rank: number;
  line: ReturnType<typeof typed>;
}) {
  const href =
    sponsor.url ??
    (sponsor.github ? `https://github.com/${sponsor.github}` : undefined);

  return (
    <li css={[rowStyle, line.css]} style={line.style}>
      <span css={iconCellStyle}>{String(rank).padStart(2, "0")}</span>
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
      <span css={nameStyle}>
        {href ? (
          <a css={linkStyle} href={href} target="_blank" rel="noopener noreferrer">
            {sponsor.name}
            <ArrowUpRight className="row-arrow" css={rowArrowStyle} />
          </a>
        ) : (
          sponsor.name
        )}
      </span>
      <span css={metaStyle}>
        {sponsor.github && `@${sponsor.github} · `}Since{" "}
        {formatSince(sponsor.since)}
      </span>
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

  const typedChars = useTyping(TITLE);
  const shown = typedChars >= TITLE.length;

  // Every line below the title types in after the one before it, in page
  // order.
  let count = 0;
  const line = () => typed(shown, count++);
  const intro = [line(), line()];
  const cta = line();
  const hallHeading = line();
  const hallNote = line();
  const topRule = line();
  // The list's rows, or the empty note in their place.
  const listLines = HALL_OF_FAME.length
    ? HALL_OF_FAME.map((_, index) =>
        typed(shown, count + Math.min(index, MAX_ROW_STAGGER)),
      )
    : [typed(shown, count)];
  count += Math.min(listLines.length, MAX_ROW_STAGGER + 1);
  const bottomRule = line();
  const signature = line();

  return (
    <div css={pageStyle}>
      <TopNavBar />

      <main css={mainStyle}>
        <FrameLines />

        <article css={[frameColumnStyle, headerStyle, articleStyle]}>
          <TypedTitle text={TITLE} count={typedChars} />

          <div css={proseStyle}>
            <p css={intro[0].css} style={intro[0].style}>
              Every sponsor is listed in the Hall of Fame below, and stays there
              for good. Investors and makers visit this page regularly, so your
              name is seen by the people building what comes next.
            </p>
            <p css={intro[1].css} style={intro[1].style}>
              If you would rather invest than sponsor, write to us at{" "}
              <a css={linkStyle} href="mailto:info@cartesiancs.com">
                info@cartesiancs.com
              </a>
              .
            </p>
          </div>

          <div css={[ctaStyle, cta.css]} style={cta.style}>
            <a
              css={buttonStyle}
              href={GITHUB_SPONSORS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Sponsor on GitHub
              <ArrowRight />
            </a>
          </div>

          <section aria-labelledby="hall-of-fame">
            <header>
              <h2
                id="hall-of-fame"
                css={[headingStyle, hallHeadingStyle, hallHeading.css]}
                style={hallHeading.style}
              >
                Hall of Fame
              </h2>
              {HALL_OF_FAME.length > 0 && (
                <p css={[hallNoteStyle, hallNote.css]} style={hallNote.style}>
                  In the order they joined.
                </p>
              )}
            </header>

            <hr css={[hrStyle, topRule.css]} style={topRule.style} />
            {HALL_OF_FAME.length > 0 ? (
              <ol css={listStyle}>
                {HALL_OF_FAME.map((sponsor, index) => (
                  <SponsorRow
                    key={`${sponsor.github ?? sponsor.name}-${index}`}
                    sponsor={sponsor}
                    rank={index + 1}
                    line={listLines[index]}
                  />
                ))}
              </ol>
            ) : (
              <p
                css={[emptyStyle, listLines[0].css]}
                style={listLines[0].style}
              >
                No sponsors yet. The first name here could be yours.
              </p>
            )}
            <hr css={[hrStyle, bottomRule.css]} style={bottomRule.style} />
          </section>
        </article>

        <div css={signature.css} style={signature.style}>
          <ServerSignature css={signatureStyle} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
