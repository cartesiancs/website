/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import type { MouseEvent } from "react";
import { ArrowRight, Mail } from "lucide-react";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";
import { SpeakButton } from "../components/SpeakButton";
import { TextReveal } from "../components/TextReveal";
import { usePageTransition } from "../components/PageTransition";

const SCRIPT_FONT = '"Playball", "Snell Roundhand", cursive';

// Same 1024px frame as the footer, so their side lines meet.
const FRAME_WIDTH = "1024px";
const LINE = "rgba(255, 255, 255, 0.1)";
const LINE_SOFT = "rgba(255, 255, 255, 0.05)";
const LG = "@media (min-width: 1024px)";
const MD = "@media (min-width: 768px)";

// When the body copy starts writing in, so the hero lands first.
const BODY_REVEAL_DELAY_MS = 600;

const riseIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(2.5rem);
  }
`;

// Each hero piece rises in on its own delay, top to bottom.
const rise = (delayMs: number) =>
  css({
    animation: `${riseIn} 0.5s ease-out ${delayMs}ms backwards`,
    "@media (prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  });

const pageStyle = css({
  display: "flex",
  minHeight: "100%",
  width: "100%",
  flexDirection: "column",
  alignItems: "center",
  boxSizing: "border-box",
});

// Holds the hero and body copy. isolation keeps the decorations behind the
// content but above the page background.
const mainStyle = css({
  position: "relative",
  isolation: "isolate",
  width: "100%",
  paddingBottom: "4rem",
  // Clips the full-width divider without making a scroll box.
  overflowX: "clip",
});

// Soft light falling from the top centre.
const topShadeStyle = css({
  display: "none",
  position: "absolute",
  top: "-3.5rem",
  left: 0,
  right: 0,
  height: "100vh",
  zIndex: -1,
  pointerEvents: "none",
  background:
    "radial-gradient(35% 80% at 49% 0%, rgba(255, 255, 255, 0.08), transparent)",
  [LG]: {
    display: "block",
  },
});

// The frame's side lines. They fade in at the top and run down into the
// footer's side borders.
const frameLinesStyle = css({
  display: "none",
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  maxWidth: FRAME_WIDTH,
  margin: "0 auto",
  boxSizing: "border-box",
  borderLeft: "1px solid rgba(255, 255, 255, 0.15)",
  borderRight: "1px solid rgba(255, 255, 255, 0.15)",
  pointerEvents: "none",
  WebkitMaskImage: "linear-gradient(to bottom, transparent, black 14rem)",
  maskImage: "linear-gradient(to bottom, transparent, black 14rem)",
  [LG]: {
    display: "block",
  },
});

const heroStyle = css({
  width: "100%",
  maxWidth: FRAME_WIDTH,
  margin: "0 auto",
});

const heroContentStyle = css({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1.25rem",
  padding: "8rem 1.5rem 7.5rem",
});

// Two pairs of thin lines just inside the frame, fading in from the top.
const innerLine = (side: "left" | "right", inset: string, mdInset: string, color: string) =>
  css({
    position: "absolute",
    top: 0,
    bottom: 0,
    [side]: inset,
    width: "1px",
    background: `linear-gradient(to bottom, transparent, ${color} 50%, ${color})`,
    [MD]: {
      [side]: mdInset,
    },
  });

const innerLinesStyle = css({
  position: "absolute",
  inset: 0,
  zIndex: -1,
  overflow: "hidden",
  pointerEvents: "none",
});

// The wordmark, lit from behind.
const titleStyle = css({
  margin: 0,
  fontFamily: SCRIPT_FONT,
  fontWeight: 400,
  fontSize: "3.5rem",
  lineHeight: 1.25,
  color: "#ffffff",
  textAlign: "center",
  textShadow: "0 0 50px rgba(255, 255, 255, 0.2)",
  [MD]: {
    fontSize: "4.5rem",
  },
  [LG]: {
    fontSize: "5.5rem",
  },
});

const subtitleStyle = css({
  margin: 0,
  // Sits closer to the title than the hero's usual gap.
  marginTop: "-1rem",
  maxWidth: "28rem",
  textAlign: "center",
  fontSize: "1rem",
  lineHeight: 1.5,
  fontWeight: 400,
  letterSpacing: "0.05em",
  color: "rgba(255, 255, 255, 0.8)",
  "@media (min-width: 640px)": {
    fontSize: "1.125rem",
  },
  [MD]: {
    fontSize: "1.25rem",
  },
});

const actionsStyle = css({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.75rem",
  paddingTop: "1.5rem",
});

const buttonStyle = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  height: "2.5rem",
  padding: "0 1.5rem",
  boxSizing: "border-box",
  borderRadius: "9999px",
  fontSize: "0.875rem",
  fontWeight: 500,
  whiteSpace: "nowrap",
  textDecoration: "none",
  transition: "background-color 0.2s ease",
  svg: {
    width: "1rem",
    height: "1rem",
    flexShrink: 0,
  },
  ":focus-visible": {
    outline: "none",
    boxShadow: "0 0 0 3px rgba(115, 115, 115, 0.5)",
  },
});

const secondaryButtonStyle = css({
  paddingLeft: "1.25rem",
  backgroundColor: "#262626",
  color: "#fafafa",
  ":hover": {
    backgroundColor: "rgba(38, 38, 38, 0.8)",
  },
});

const primaryButtonStyle = css({
  paddingRight: "1.25rem",
  backgroundColor: "#e5e5e5",
  color: "#171717",
  ":hover": {
    backgroundColor: "rgba(229, 229, 229, 0.9)",
  },
});

// A 1px line under the hero that runs to both screen edges.
const dividerStyle = css({
  position: "relative",
  height: "1px",
  "::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "50%",
    width: "100vw",
    height: "1px",
    transform: "translateX(-50%)",
    backgroundColor: LINE,
  },
});

// The page copy. Edit it like plain HTML: <h1>, <h3>, <p>, <strong>, <em>,
// <code>, <a> and <img> all work. Everything in here fades in word by word.
// A line that ends right before a tag needs {" "} to keep the space between
// them.
function AboutText() {
  return (
    <TextReveal delayMs={BODY_REVEAL_DELAY_MS}>
      <p>
        cartesiancs ( pronounced: <code>/kɑːrˈtiːʒəns/</code>{" "}
        <SpeakButton src="/speak.mp3" />, Korean: <code>카르테시안스</code>)
      </p>

      <p>
        Our ultimate goal is to give each person the{" "}
        <strong>strength to change the world</strong> and the{" "}
        <strong>freedom to pursue their own dreams</strong> by helping them
        live <strong>independently</strong>. That is our mission.
      </p>

      <p>
        <img src="/banner.png" alt="banner" />
      </p>

      <p>
        Our contact email is{" "}
        <a href="mailto:info@cartesiancs.com" target="_blank">
          info@cartesiancs.com
        </a>
      </p>

      <h3>Origin</h3>

      <p>
        The name <em>"cartesiancs"</em> comes from the Cartesian Coordinate
        System. It was Descartes who united geometry and algebra, opening a new
        paradigm in mathematics and heralding the dawn of the Renaissance.
      </p>

      <p>
        The Cartesian plane is infinite. We hope that on this plane, everyone
        will sketch their own ideas, analyze the world, and reason through it.
        Just as the simplest combinations give rise to emergent complexity, we
        believe open source is how technological freedom becomes available to
        all.
      </p>

      <h3>Vision</h3>

      <p>
        The project we are currently focused on is{" "}
        <strong>
          <a href="https://landlink.sh/" target="_blank">
            landlink
          </a>
        </strong>
        . The map3d, cartcut, and vessel projects are all being integrated into
        landlink. landlink is designed to let individuals build their own
        communication networks, and it operates over LoRa networks. Going
        further, integration with drones will enable autonomous flight on top
        of the landlink platform, such as setting waypoint based flight paths
        or surveying specific areas.
      </p>

      <p>
        The vision portrayed in <em>&lt;Star Trek&gt;</em> is the same as our
        goal. "to send humanity far beyond into space", and to prove that a
        single person can survive there indefinitely. And we believe that
        independent survival for the individual is possible not only in space
        but here on Earth as well. Achieving this requires the self sustaining
        ground communication network that landlink implements.
      </p>

      <p>
        Ultimately, even if Earth becomes an uninhabitable environment, or an
        extremely harsh one, our vision is to give humanity the minimal set of
        tools it needs to survive and endure. That is our vision.
      </p>

      <p>
        And this runs on fundamentally the same technology as survival in
        space. Space is harsh. For humanity to pursue its own dreams, people
        should not merely survive atop massive infrastructure funded at the
        scale of nation states. Instead, each individual should be able to
        source their own supplies and build their own ventures. Yet this is a
        domain that demands advanced technology, much like calculating the
        orbit of a spacecraft. To make it possible, we are developing AI that
        reduces the need for human intervention and lets the system operate on
        its own.
      </p>
    </TextReveal>
  );
}

function Hero() {
  const transitionTo = usePageTransition();

  // Plain clicks get the page transition; modified clicks open as usual.
  const goToProduct = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    transitionTo("/product");
  };

  return (
    <section css={heroStyle}>
      <div css={heroContentStyle}>
        <div css={innerLinesStyle} aria-hidden="true">
          <div css={innerLine("left", "1rem", "2rem", LINE)} />
          <div css={innerLine("right", "1rem", "2rem", LINE)} />
          <div css={innerLine("left", "2rem", "3rem", LINE_SOFT)} />
          <div css={innerLine("right", "2rem", "3rem", LINE_SOFT)} />
        </div>

        <h1 css={[titleStyle, rise(100)]}>cartesiancs</h1>

        <p css={[subtitleStyle, rise(200)]}>to explore strange new worlds.</p>

        <div css={[actionsStyle, rise(300)]}>
          <a
            css={[buttonStyle, secondaryButtonStyle]}
            href="mailto:info@cartesiancs.com"
          >
            <Mail />
            Contact
          </a>
          <a
            css={[buttonStyle, primaryButtonStyle]}
            href="/product"
            onClick={goToProduct}
          >
            Explore products
            <ArrowRight />
          </a>
        </div>
      </div>

      <div css={dividerStyle} aria-hidden="true" />
    </section>
  );
}

export function About() {
  return (
    <div css={pageStyle}>
      <TopNavBar />

      <main css={mainStyle}>
        <div css={topShadeStyle} aria-hidden="true" />
        <div css={frameLinesStyle} aria-hidden="true" />

        <Hero />

        {/* Same column as the markdown pages (see MarkdownContent). */}
        <div
          css={css({
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            minHeight: "100%",
            width: "100%",
          })}
        >
          <div
            css={css({
              display: "flex",
              padding: "1rem",
              maxWidth: "600px",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              paddingTop: "2rem",
              gap: "1rem",
              width: "100%",
            })}
          >
            <div
              css={css({
                paddingTop: "1.5rem",
                minHeight: "100%",
                padding: "1rem",
              })}
            >
              <AboutText />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
