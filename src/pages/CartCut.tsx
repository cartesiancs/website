/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import { ChevronDown, Github, Layers, Puzzle, Sparkles } from "lucide-react";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";

const DOWNLOAD_URL = "https://github.com/cartesiancs/cartcut/releases";
const REPO_URL = "https://github.com/cartesiancs/cartcut";

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
  padding: "6rem 2rem 8rem 2rem",
  boxSizing: "border-box",
  "@media (max-width: 640px)": {
    padding: "7rem 1.5rem 6rem 1.5rem",
  },
});

const logoStyle = css({
  display: "block",
  width: "100%",
  maxWidth: "320px",
  height: "auto",
  marginTop: "2.5rem",
  marginBottom: "3rem",
});

const leadStyle = css({
  marginTop: "1.25rem",
  marginBottom: 0,
  fontSize: "1rem",
  lineHeight: 1.7,
  color: "#e6e6eb",
  fontWeight: 200,
});

const actionsStyle = css({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: "0.75rem",
  marginTop: "2rem",
});

const buttonBaseStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.55rem",
  padding: "0.7rem 1.2rem",
  borderRadius: "8px",
  fontSize: "0.9rem",
  fontWeight: 500,
  textDecoration: "none",
  border: "1px solid transparent",
  transition:
    "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease",
});

const primaryButtonStyle = css({
  backgroundColor: "#ffffff",
  color: "#0d0e0f",
  ":hover": {
    backgroundColor: "#d8d8e0",
  },
});

const secondaryButtonStyle = css({
  backgroundColor: "transparent",
  borderColor: "rgb(36, 36, 43)",
  color: "#e6e6eb",
  ":hover": {
    borderColor: "rgb(70, 70, 80)",
    color: "#ffffff",
  },
});

const buttonIconStyle = css({
  width: "18px",
  height: "18px",
  flexShrink: 0,
});

const sectionTitleStyle = css({
  margin: "3.5rem 0 0 0",
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#8a8a8f",
});

const itemListStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "1.75rem",
  marginTop: "6rem",
});

const itemTitleStyle = css({
  margin: 0,
  fontSize: "1.05rem",
  fontWeight: 500,
  letterSpacing: "-0.01em",
  color: "#ffffff",
});

const itemTextStyle = css({
  margin: "0.5rem 0 0 0",
  fontSize: "0.95rem",
  lineHeight: 1.7,
  color: "#bfbfc7",
  fontWeight: 200,
});

const videoStyle = css({
  display: "block",
  width: "100%",
  aspectRatio: "16 / 9",
  marginTop: "6rem",
  borderRadius: "12px",
  "@media (max-width: 640px)": {
    marginTop: "4rem",
  },
});

const cardGridStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "1rem",
  marginTop: "6rem",
  "@media (max-width: 640px)": {
    gridTemplateColumns: "minmax(0, 1fr)",
    marginTop: "4rem",
  },
});

const cardStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "1.5rem",
  borderRadius: "12px",
  border: "1px solid rgb(36, 36, 43)",
  transition: "border-color 0.3s ease, background-color 0.3s ease",
  ":hover": {
    borderColor: "rgb(70, 70, 80)",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
});

const cardIconWrapStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  color: "#ffffff",
  marginBottom: "1.25rem",
});

const cardIconStyle = css({
  width: "18px",
  height: "18px",
  strokeWidth: 1.5,
});

const cardTitleStyle = css({
  margin: 0,
  fontSize: "1rem",
  fontWeight: 500,
  letterSpacing: "-0.01em",
  color: "#ffffff",
});

const cardTextStyle = css({
  margin: "0.6rem 0 0 0",
  fontSize: "0.9rem",
  lineHeight: 1.65,
  color: "#8a8a8f",
  fontWeight: 200,
});

const quoteStyle = css({
  margin: "6rem 0 0 0",
  paddingLeft: "1.25rem",
  borderLeft: "1px solid rgb(36, 36, 43)",
  fontSize: "1rem",
  lineHeight: 1.7,
  color: "#e6e6eb",
  fontWeight: 200,
});

const quoteNameStyle = css({
  display: "block",
  marginTop: "0.75rem",
  fontSize: "0.85rem",
  color: "#8a8a8f",
});

const faqListStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  marginTop: "6rem",
  "@media (max-width: 640px)": {
    marginTop: "4rem",
  },
});

const faqItemStyle = css({
  padding: "0 1.5rem",
  borderRadius: "12px",
  border: "1px solid rgb(36, 36, 43)",
  transition: "border-color 0.3s ease, background-color 0.3s ease",
  ":hover": {
    borderColor: "rgb(70, 70, 80)",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
});

const faqQuestionStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  width: "100%",
  padding: "1.35rem 0",
  background: "none",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "1rem",
  fontWeight: 400,
  letterSpacing: "-0.01em",
  color: "#e6e6eb",
  transition: "color 0.3s ease",
  ":hover": {
    color: "#ffffff",
  },
});

const faqChevronStyle = css({
  width: "18px",
  height: "18px",
  flexShrink: 0,
  color: "#8a8a8f",
  transition: "transform 0.3s ease",
});

const faqChevronOpenStyle = css({
  transform: "rotate(180deg)",
  color: "#ffffff",
});

// grid-template-rows 0fr -> 1fr animates the answer without a fixed height.
const faqAnswerWrapStyle = css({
  display: "grid",
  gridTemplateRows: "0fr",
  transition: "grid-template-rows 0.3s ease",
});

const faqAnswerWrapOpenStyle = css({
  gridTemplateRows: "1fr",
});

const faqAnswerStyle = css({
  overflow: "hidden",
});

const faqAnswerTextStyle = css({
  margin: 0,
  paddingBottom: "1.25rem",
  paddingRight: "2rem",
  fontSize: "0.95rem",
  lineHeight: 1.7,
  color: "#8a8a8f",
  fontWeight: 200,
});

const linkStyle = css({
  color: "#ffffff",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
  textDecorationColor: "rgb(70, 70, 80)",
  transition: "text-decoration-color 0.3s ease",
  ":hover": {
    textDecorationColor: "#ffffff",
  },
});

// lucide-react ships a fruit for "apple", so the platform mark is inline.
function AppleIcon() {
  return (
    <svg
      css={buttonIconStyle}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.36 12.72c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.83-.81-3-.79-1.55.02-2.98.9-3.77 2.28-1.61 2.79-.41 6.92 1.15 9.19.77 1.11 1.68 2.35 2.87 2.31 1.15-.05 1.59-.74 2.98-.74 1.39 0 1.78.74 3 .72 1.24-.02 2.02-1.13 2.78-2.24.87-1.28 1.23-2.53 1.25-2.6-.03-.01-2.4-.92-2.42-3.7zM14.1 5.98c.63-.77 1.06-1.83.94-2.89-.91.04-2.01.61-2.67 1.37-.59.68-1.1 1.76-.96 2.8 1.01.08 2.05-.51 2.69-1.28z" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: Layers,
    title: "Unlimited timeline",
    text: "Stack video, audio, text, and images across an unlimited number of layers, as far as the edit needs to go.",
  },
  {
    icon: Sparkles,
    title: "Advanced motion",
    text: "Keyframes, easing, and transforms live in the timeline itself, so motion you would look for in After Effects stays one tool away.",
  },
  {
    icon: Puzzle,
    title: "External extensions",
    text: "The editor is built to be extended, so a missing capability is something you can write rather than wait for.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What is Cartcut?",
    answer:
      "An open-source video editing software built for creators who want professional editing without giving up ownership of their tools.",
  },
  {
    question: "Is it hard to learn?",
    answer:
      "There is a slight learning curve, as with any professional-grade editing software. If you have used a timeline editor before, you will be at home quickly.",
  },
  {
    question: "Is it really free?",
    answer:
      "Yes, it is completely free. There are no watermarks, and it operates entirely as a community-driven project.",
  },
  {
    question: "How do I contribute?",
    answer: (
      <>
        Open an issue or a pull request on{" "}
        <a css={linkStyle} href={REPO_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
        . Bug reports and feature requests are as welcome as code.
      </>
    ),
  },
];

export function CartCut() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div css={pageStyle}>
      <TopNavBar />

      <div css={contentStyle}>
        <img css={logoStyle} src="/cartcut.png" alt="CartCut" />

        <p css={leadStyle}>
          <b>Open Source Video Editor.</b> It is aimed at protecting the freedom
          of creation and the rights of the creators. No subscription, no
          watermark, no account. You download it, you own it, and the source is
          yours to read and change.
        </p>

        <div css={actionsStyle}>
          <a
            css={[buttonBaseStyle, primaryButtonStyle]}
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noreferrer"
          >
            <AppleIcon />
            Download for macOS
          </a>
          <a
            css={[buttonBaseStyle, secondaryButtonStyle]}
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
          >
            <Github css={buttonIconStyle} />
            View on GitHub
          </a>
        </div>

        <iframe
          css={videoStyle}
          src="https://www.youtube.com/embed/AFZVSosNOUw?si=QTgA76zITTZGxTJV"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>

        <div css={cardGridStyle}>
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} css={cardStyle}>
              <span css={cardIconWrapStyle}>
                <Icon css={cardIconStyle} />
              </span>
              <h3 css={cardTitleStyle}>{title}</h3>
              <p css={cardTextStyle}>{text}</p>
            </div>
          ))}
        </div>

        <div css={itemListStyle}>
          <div>
            <h3 css={itemTitleStyle}>Open source</h3>
            <p css={itemTextStyle}>
              The whole editor is public. Read it, fork it, ship a patch, or run
              your own build.
            </p>
          </div>
          <div>
            <h3 css={itemTitleStyle}>Easy editing</h3>
            <p css={itemTextStyle}>
              An easy yet free style of editing. The basics are where you expect
              them, and nothing is locked behind a plan.
            </p>
          </div>
          <div>
            <h3 css={itemTitleStyle}>Lightweight</h3>
            <p css={itemTextStyle}>
              A familiar and lightweight editor for smooth editing without
              stumbling. It starts fast and stays out of the way.
            </p>
          </div>
          <div>
            <h3 css={itemTitleStyle}>And more</h3>
            <p css={itemTextStyle}>
              Features keep arriving through open-source contribution. What the
              community needs is what gets built next.
            </p>
          </div>
        </div>

        <blockquote css={quoteStyle}>
          I made this because I was pissed off that the free editing program
          started charging for its services.
          <span css={quoteNameStyle}>H. Jun Huh @ cartesiancs</span>
        </blockquote>

        <div css={faqListStyle}>
          {FAQ_ITEMS.map((item, index) => {
            const open = openIndex === index;
            return (
              <div key={item.question} css={faqItemStyle}>
                <button
                  type="button"
                  css={faqQuestionStyle}
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : index)}
                >
                  {item.question}
                  <ChevronDown
                    css={[faqChevronStyle, open && faqChevronOpenStyle]}
                  />
                </button>
                <div css={[faqAnswerWrapStyle, open && faqAnswerWrapOpenStyle]}>
                  <div css={faqAnswerStyle}>
                    <p css={faqAnswerTextStyle}>{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
