/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";
import { SpeakButton } from "../components/SpeakButton";
import { TextReveal } from "../components/TextReveal";

// Same 1024px frame as the footer, so their side lines meet.
const FRAME_WIDTH = "1024px";
const LINE = "rgba(255, 255, 255, 0.1)";
const LG = "@media (min-width: 1024px)";

// When the body copy starts writing in, so the hero lands first.
const BODY_REVEAL_DELAY_MS = 600;

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

// Empty band above the divider.
const heroContentStyle = css({
  height: "15.5rem",
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
        <strong>freedom to pursue their own dreams</strong> by helping them live{" "}
        <strong>independently</strong>. That is our mission.
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
        further, integration with drones will enable autonomous flight on top of
        the landlink platform, such as setting waypoint based flight paths or
        surveying specific areas.
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
        And this runs on fundamentally the same technology as survival in space.
        Space is harsh. For humanity to pursue its own dreams, people should not
        merely survive atop massive infrastructure funded at the scale of nation
        states. Instead, each individual should be able to source their own
        supplies and build their own ventures. Yet this is a domain that demands
        advanced technology, much like calculating the orbit of a spacecraft. To
        make it possible, we are developing AI that reduces the need for human
        intervention and lets the system operate on its own.
      </p>
    </TextReveal>
  );
}

function Hero() {
  return (
    <section css={heroStyle}>
      <div css={heroContentStyle} />

      <div css={dividerStyle} aria-hidden="true" />
    </section>
  );
}

export function About() {
  return (
    <div css={pageStyle}>
      <TopNavBar />

      <main css={mainStyle}>
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
