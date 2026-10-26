/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";
import { SpeakButton } from "../components/SpeakButton";
import { TextReveal } from "../components/TextReveal";

const SCRIPT_FONT = '"Playball", "Snell Roundhand", cursive';

// The wordmark centered above the page copy.
const heroStyle = css({
  margin: 0,
  paddingTop: "5.5rem",
  fontFamily: SCRIPT_FONT,
  fontWeight: 400,
  fontSize: "clamp(3.5rem, 14vw, 6rem)",
  lineHeight: 1.25,
  color: "#ffffff",
  textAlign: "center",
  whiteSpace: "nowrap",
  "@media (max-width: 600px)": {
    paddingTop: "3.5rem",
  },
});

// The page copy. Edit it like plain HTML: <h1>, <h3>, <p>, <strong>, <em>,
// <code>, <a> and <img> all work. Everything in here fades in word by word.
// A line that ends right before a tag needs {" "} to keep the space between
// them.
function AboutText() {
  return (
    <TextReveal>
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

export function About() {
  return (
    <>
      <div
        css={css({
          display: "flex",
          minHeight: "100%",
          width: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "column",
          paddingTop: "2rem",
          paddingBottom: "0rem",
          boxSizing: "border-box",
        })}
      >
        <TopNavBar />

        <h1 css={heroStyle}>
          <TextReveal>cartesiancs</TextReveal>
        </h1>

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

        <Footer />
      </div>
    </>
  );
}
