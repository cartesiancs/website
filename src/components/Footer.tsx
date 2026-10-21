/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const footerStyle = css({
  width: "100%",
  borderTop: "1px solid rgb(36, 36, 43)",

  backgroundColor: "#0d0e0f",
  color: "#e6e6eb",
  marginTop: "0rem",
});

const innerStyle = css({
  maxWidth: "1320px",
  margin: "0 auto",
  padding: "3rem 2rem 2rem 2rem",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: "3rem",
  flexWrap: "wrap",
  "@media (max-width: 640px)": {
    padding: "2.5rem 1.5rem 1.5rem 1.5rem",
    gap: "2rem",
  },
});

const brandStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "0.5rem",
  minWidth: "200px",
});

const brandNameStyle = css({
  fontSize: "1.1rem",
  fontWeight: 600,
  color: "#ffffff",
  letterSpacing: "-0.01em",
});

const brandTextStyle = css({
  margin: 0,
  fontSize: "0.85rem",
  lineHeight: 1.5,
  color: "#8a8a8f",
});

const columnsStyle = css({
  display: "flex",
  flexDirection: "row",
  gap: "3rem",
  flexWrap: "wrap",
  "@media (max-width: 640px)": {
    gap: "2rem",
  },
});

const columnStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "0.6rem",
  minWidth: "120px",
});

const columnTitleStyle = css({
  margin: 0,
  fontSize: "0.7rem",
  fontWeight: 600,
  color: "#8a8a8f",
  marginBottom: "0.25rem",
});

const linkStyle = css({
  fontSize: "0.9rem",
  fontWeight: 400,
  color: "#bfbfc7",
  textDecoration: "none",
  transition: "color 0.3s ease",
  marginBottom: "0.2rem",
  ":hover": {
    color: "#ffffff",
  },
});

const bottomStyle = css({
  maxWidth: "1320px",
  margin: "0 auto",
  padding: "1.5rem 2rem 2.5rem 2rem",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
  flexWrap: "wrap",
  fontSize: "0.8rem",
  color: "#8a8a8f",
  "@media (max-width: 640px)": {
    padding: "1.5rem",
  },
});

function Footer() {
  return (
    <footer css={footerStyle}>
      <div css={innerStyle}>
        <div css={brandStyle}>
          <span css={brandNameStyle}>cartesiancs</span>
          <p css={brandTextStyle}>to explore strange new worlds.</p>
        </div>

        <div css={columnsStyle}>
          <div css={columnStyle}>
            <h3 css={columnTitleStyle}>Company</h3>
            <a css={linkStyle} href="/">
              About
            </a>
            <a css={linkStyle} href="/product">
              Product
            </a>
            <a css={linkStyle} href="/fleet">
              Fleet
            </a>
            <a css={linkStyle} href="/career">
              Career
            </a>
            <a css={linkStyle} href="mailto:info@cartesiancs.com">
              Contact
            </a>
          </div>

          <div css={columnStyle}>
            <h3 css={columnTitleStyle}>Writing</h3>
            <a
              css={linkStyle}
              href="https://blog.cartesiancs.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Blog
            </a>
          </div>

          <div css={columnStyle}>
            <h3 css={columnTitleStyle}>Social</h3>
            <a
              css={linkStyle}
              href="https://github.com/cartesiancs"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              css={linkStyle}
              href="https://www.linkedin.com/company/cartesiancs"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              css={linkStyle}
              href="https://x.com/cartesiancs"
              target="_blank"
              rel="noopener noreferrer"
            >
              X
            </a>
            <a
              css={linkStyle}
              href="https://www.youtube.com/@cartesiancs"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube
            </a>
            <a
              css={linkStyle}
              href="https://www.instagram.com/cartesinc"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div css={bottomStyle}>
        <span>&copy; {new Date().getFullYear()} cartesiancs</span>
      </div>
    </footer>
  );
}

export default Footer;
