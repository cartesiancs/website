/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";
import { FrameLines } from "../components/FrameLines";
import {
  MONO,
  MUTED,
  SERIF,
  ServerSignature,
  SiteLink,
  TypedTitle,
  frameColumnStyle,
  headerStyle,
  hrStyle,
  iconCellStyle,
  linkStyle,
  mainStyle,
  pageStyle,
  typed,
  useTyping,
} from "../components/EarlyWeb";

const TITLE = "Product Engineer";

const SECTIONS: [string, string[]][] = [
  [
    "Responsibilities",
    [
      "Ship features across the web client, backend, and device firmware.",
      "Own an area end to end, including its reliability.",
      "Work in public repositories under MIT.",
      "Build interfaces for maps, telemetry, and network topology.",
      "Prototype pilot products under Project Fleet.",
    ],
  ],
  [
    "Requirements",
    [
      "Shipped products you can show us.",
      "TypeScript, and one systems language.",
      "Able to work across the stack without handoffs.",
      "Clear writing. The team is distributed and async.",
    ],
  ],
  [
    "Bonus",
    [
      "LoRa, RF, or mesh networking.",
      "Embedded work in Rust, C, or C++.",
      "WebGL, Three.js, or GIS.",
      "Drones or robotics.",
    ],
  ],
];

const articleStyle = css({
  paddingBottom: 0,
  "@media (max-width: 640px)": {
    paddingBottom: 0,
  },
});

const upStyle = css({
  margin: "0 0 1.25rem",
  fontFamily: MONO,
  fontSize: "0.8125rem",
  lineHeight: 1.7,
  "@media (max-width: 640px)": {
    fontSize: "0.75rem",
  },
});

const titleStyle = css({
  marginBottom: "0.5rem",
});

const metaStyle = css({
  margin: "0 0 0.75rem",
  fontFamily: MONO,
  fontSize: "0.8125rem",
  lineHeight: 1.7,
  color: MUTED,
  "@media (max-width: 640px)": {
    fontSize: "0.75rem",
  },
});

// Plain document text, as a browser set it before stylesheets.
const bodyStyle = css({
  maxWidth: "40rem",
  padding: "0.75rem 0 0.5rem",
  fontFamily: SERIF,
  fontSize: "1.125rem",
  lineHeight: 1.55,
  color: "#d4d4dc",
  p: {
    margin: "0 0 1rem",
    fontWeight: 400,
    lineHeight: 1.55,
    color: "inherit",
  },
  h2: {
    margin: "2rem 0 0.5rem",
    fontSize: "1.375rem",
    fontWeight: 700,
    lineHeight: 1.2,
    color: "#ffffff",
  },
  ul: {
    margin: 0,
    paddingLeft: "1.25rem",
  },
  li: {
    marginBottom: "0.25rem",
  },
  "li::marker": {
    color: MUTED,
  },
});

const signatureStyle = css({
  paddingTop: "0.5rem",
});

export function CareerProductEngineer() {
  const typedChars = useTyping(TITLE);
  const shown = typedChars >= TITLE.length;

  // Every line below the title types in after the one before it, in page
  // order.
  let count = 0;
  const line = () => typed(shown, count++);
  const up = line();
  const meta = line();
  const topRule = line();
  const summary = line();
  const sections = SECTIONS.map(([title, items]) => ({
    title,
    items,
    heading: line(),
    list: line(),
  }));
  const applyHeading = line();
  const applyText = line();
  const bottomRule = line();
  const signature = line();

  return (
    <div css={pageStyle}>
      <TopNavBar />

      <main css={mainStyle}>
        <FrameLines />

        <article css={[frameColumnStyle, headerStyle, articleStyle]}>
          <p css={[upStyle, up.css]} style={up.style}>
            <span css={iconCellStyle}>[UP]</span>{" "}
            <SiteLink href="/career" css={linkStyle}>
              Parent Directory
            </SiteLink>
          </p>

          <TypedTitle text={TITLE} count={typedChars} css={titleStyle} />
          <p css={[metaStyle, meta.css]} style={meta.style}>
            Engineering · Full-time · Remote
          </p>
          <hr css={[hrStyle, topRule.css]} style={topRule.style} />

          <div css={bodyStyle}>
            <p css={summary.css} style={summary.style}>
              You will work on landlink, a communication network individuals
              run themselves over LoRa. Engineers here own an area from decision
              to release.
            </p>

            {sections.map(({ title, items, heading, list }) => (
              <section key={title}>
                <h2 css={heading.css} style={heading.style}>
                  {title}
                </h2>
                <ul css={list.css} style={list.style}>
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}

            <h2 css={applyHeading.css} style={applyHeading.style}>
              Apply
            </h2>
            <p css={applyText.css} style={applyText.style}>
              Send your GitHub and one thing you shipped to{" "}
              <a
                css={linkStyle}
                href="mailto:info@cartesiancs.com?subject=Product Engineer"
              >
                info@cartesiancs.com
              </a>
              .
            </p>
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
